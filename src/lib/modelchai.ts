import { useEffect, useState } from 'react';
import { MC_SITE, MCModel } from './bridge';
import { matches } from './search';

// קורא את bridge.json של "מודל חי". נשמר במכשיר, כך שהחיבור עובד גם כשהרשת איטית; בלי רשת, נשארים הקישורים.
const KEY = 'mm.modelchai.v1';
let cache: Record<string, MCModel> | null = null;
let pending: Promise<Record<string, MCModel>> | null = null;

const readLocal = (): Record<string, MCModel> | null => {
  try { const v = localStorage.getItem(KEY); return v ? JSON.parse(v) : null; } catch { return null; }
};

function load(): Promise<Record<string, MCModel>> {
  if (pending) return pending;
  pending = fetch(`${MC_SITE}/bridge.json`, { cache: 'no-cache' })
    .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
    .then((b: { models: MCModel[] }) => {
      const map = Object.fromEntries(b.models.map((m) => [m.id, m]));
      cache = map;
      try { localStorage.setItem(KEY, JSON.stringify(map)); } catch { /* ignore */ }
      return map;
    })
    .catch(() => cache || readLocal() || {});
  return pending;
}

export function useModelChai() {
  const [models, setModels] = useState<Record<string, MCModel>>(() => cache || readLocal() || {});
  useEffect(() => { let on = true; load().then((m) => { if (on) setModels(m); }); return () => { on = false; }; }, []);
  return models;
}

/**
 * Models in the atlas of "מודל חי" that a new concept may be: the name first, then the description.
 * For the generator: a concept typed by hand finds its live model (e.g. "פרקטל" finds the Koch snowflake).
 */
export function findModels(atlas: Record<string, MCModel>, concept: string, limit = 2): MCModel[] {
  const q = concept.replace(/[׳'"״]/g, '').trim()
  if (q.length < 2) return []
  const all = Object.values(atlas)
  const clean = (t: string) => t.replace(/[׳'"״]/g, '')
  const byName = all.filter((m) => matches(clean(`${m.name_he} ${m.name}`), q))
  const byText = all.filter((m) => !byName.includes(m) && matches(clean(m.plain.split(/(?<=\.)\s/)[0] || ''), q))
  return [...byName, ...byText].slice(0, limit)
}
