import { useEffect, useState } from 'react';
import { MC_SITE, MCModel } from './bridge';

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
