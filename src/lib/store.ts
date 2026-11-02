import { useEffect, useState, useSyncExternalStore } from 'react';
import { CONCEPTS } from './concepts';
import { Dimensions, fetchArticles, upsertArticle } from './api';

// מושג שנוצר במחולל: אותו מבנה כמו באתר המקורי, נשמר מקומית ומסונכרן לשרת.
export interface Generated {
  id: string;
  concept: string;
  createdAt: string;
  dimensions: Dimensions;
  images: { exterior?: string | null; interior?: string | null };
}

const KEY_GEN = 'mm.generated.v1';
const KEY_REMOTE = 'mm.remote.v1';

const read = <T,>(k: string, d: T): T => {
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d; } catch { return d; }
};
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* full or blocked */ } };

const seeded = new Set(CONCEPTS.map((c) => c.id));
let listeners: (() => void)[] = [];
let snapshot: Generated[] = merge(read<Generated[]>(KEY_GEN, []), read<Generated[]>(KEY_REMOTE, []));

function merge(local: Generated[], remote: Generated[]) {
  const map = new Map<string, Generated>();
  [...remote, ...local].forEach((g) => { if (!seeded.has(g.id)) map.set(g.id, g); });
  return [...map.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
const emit = () => { snapshot = merge(read(KEY_GEN, []), read(KEY_REMOTE, [])); listeners.forEach((l) => l()); };

export function useGenerated() {
  return useSyncExternalStore(
    (l) => { listeners.push(l); return () => { listeners = listeners.filter((x) => x !== l); }; },
    () => snapshot,
  );
}

let synced = false;
export async function syncRemote() {
  if (synced) return;
  synced = true;
  try {
    const rows = await fetchArticles();
    const list: Generated[] = rows.map((r: any) => ({
      id: r.id,
      concept: r.concept,
      createdAt: r.created_at,
      dimensions: {
        insight: r.insight, architecturalName: r.architectural_name, proverb: r.proverb, interpretation: r.interpretation,
        imagePrompts: { exterior: r.exterior_prompt || '', interior: r.interior_prompt || '' },
      },
      images: {
        exterior: r.media_assets?.exterior?.image?.url || r.image_exterior,
        interior: r.media_assets?.interior?.image?.url || r.image_interior,
      },
    }));
    write(KEY_REMOTE, list);
    emit();
  } catch { /* offline: local copy stays */ }
}

export type SaveState = 'idle' | 'saving' | 'saved' | 'local';

export async function saveGenerated(g: Generated): Promise<SaveState> {
  const local = read<Generated[]>(KEY_GEN, []).filter((x) => x.id !== g.id);
  write(KEY_GEN, [g, ...local]);
  emit();
  try {
    await upsertArticle({
      id: g.id, concept: g.concept, tags: [g.concept], created_at: g.createdAt, updated_at: new Date().toISOString(),
      insight: g.dimensions.insight, architectural_name: g.dimensions.architecturalName, proverb: g.dimensions.proverb,
      interpretation: g.dimensions.interpretation, exterior_prompt: g.dimensions.imagePrompts.exterior,
      interior_prompt: g.dimensions.imagePrompts.interior, image_exterior: g.images.exterior, image_interior: g.images.interior,
    });
    return 'saved';
  } catch {
    return 'local';
  }
}

// יומן היישום: מחשבה, מעשה ורישום לכל מושג. נשמר אוטומטית.
export interface Journal { think: string; do: string; record: string; savedAt?: number }

export function useJournal(slug: string) {
  const key = `mm.journal.${slug}`;
  const [j, setJ] = useState<Journal>(() => read<Journal>(key, { think: '', do: '', record: '' }));
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>(j.savedAt ? 'saved' : 'idle');
  useEffect(() => { const v = read<Journal>(key, { think: '', do: '', record: '' }); setJ(v); setState(v.savedAt ? 'saved' : 'idle'); }, [key]);
  useEffect(() => {
    if (state !== 'saving') return;
    const t = setTimeout(() => { const v = { ...j, savedAt: Date.now() }; write(key, v); setJ(v); setState('saved'); }, 500);
    return () => clearTimeout(t);
  }, [j, state, key]);
  const update = (field: keyof Omit<Journal, 'savedAt'>, value: string) => { setJ((p) => ({ ...p, [field]: value })); setState('saving'); };
  return { journal: j, update, state };
}

export const uid = () =>
  (crypto as any).randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0; return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
