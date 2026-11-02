import { useSyncExternalStore } from 'react';
import { setMediaOverride, uploadImage } from './api';

// תמונות שהוחלפו במסגרות. מקור האמת: השרת (media_assets.<slot>.musag). בלי שרת: עותק במכשיר, עם חיווי.
export type Slot = 'exterior' | 'interior';
export interface Override { url: string; local?: boolean }
type MediaMap = Record<string, Partial<Record<Slot, Override>>>;

const KEY_REMOTE = 'mm.media.remote.v1';
const KEY_LOCAL = 'mm.media.local.v1';
const read = (k: string): MediaMap => { try { return JSON.parse(localStorage.getItem(k) || '{}'); } catch { return {}; } };
const write = (k: string, v: MediaMap) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };

let listeners: (() => void)[] = [];
let snapshot = merge();
function merge(): MediaMap {
  const remote = read(KEY_REMOTE), local = read(KEY_LOCAL), out: MediaMap = { ...remote };
  for (const [id, slots] of Object.entries(local)) out[id] = { ...(out[id] || {}), ...slots };
  return out;
}
const emit = () => { snapshot = merge(); listeners.forEach((l) => l()); };

export function useMedia() {
  return useSyncExternalStore((l) => { listeners.push(l); return () => { listeners = listeners.filter((x) => x !== l); }; }, () => snapshot);
}

// מה שהוחלף בסשן הזה גובר על תשובת שרת שיצאה לפני ההחלפה. null: הוחזר המקור.
const session: Record<string, Partial<Record<Slot, string | null>>> = {};

/** מהשורות של השרת: רק החלפות שנעשו כאן. */
export function setRemoteMedia(rows: { id: string; media_assets?: any }[]) {
  const map: MediaMap = {};
  for (const r of rows) for (const slot of ['exterior', 'interior'] as Slot[]) {
    const url = r.media_assets?.[slot]?.musag?.url;
    if (url) (map[r.id] ||= {})[slot] = { url };
  }
  for (const [id, slots] of Object.entries(session)) for (const [slot, url] of Object.entries(slots) as [Slot, string | null][]) {
    if (url) (map[id] ||= {})[slot] = { url }; else if (map[id]) delete map[id][slot];
  }
  write(KEY_REMOTE, map);
  emit();
}

const MAX = 1600, QUALITY = 0.85, LIMIT = 25 * 1024 * 1024;

/** מקטין לרוחב או לגובה של עד 1600 פיקסל ושומר כ-WebP. בלי חיתוך: הפרופורציה נשמרת. */
export async function compress(file: Blob): Promise<Blob> {
  if (!file.type.startsWith('image/')) throw new Error('זה לא קובץ תמונה. אפשר להדביק, לגרור או להעלות JPG, PNG או WebP.');
  if (file.size > LIMIT) throw new Error('התמונה גדולה מ-25 מגה. נסו תמונה קטנה יותר.');
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, MAX / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('הדחיסה נכשלה'))), 'image/webp', QUALITY));
}

const toDataUrl = (b: Blob) => new Promise<string>((res) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.readAsDataURL(b); });

export type PutResult = 'server' | 'device';

/** מעלה, רושם בשרת, ומעדכן מיד. בלי רשת: נשמר במכשיר בלבד. */
export async function putImage(id: string, slot: Slot, file: Blob): Promise<PutResult> {
  const blob = await compress(file);
  const path = `${id}/musag-${slot}-${Date.now()}.webp`;
  try {
    const url = await uploadImage(path, blob);
    await setMediaOverride(id, slot, url);
    (session[id] ||= {})[slot] = url;
    const remote = read(KEY_REMOTE); (remote[id] ||= {})[slot] = { url }; write(KEY_REMOTE, remote);
    const local = read(KEY_LOCAL); if (local[id]) { delete local[id][slot]; write(KEY_LOCAL, local); }
    emit();
    return 'server';
  } catch {
    const local = read(KEY_LOCAL); (local[id] ||= {})[slot] = { url: await toDataUrl(blob), local: true };
    if (!write(KEY_LOCAL, local)) throw new Error('אין מקום במכשיר, והשרת לא זמין. נסו שוב כשיש רשת.');
    emit();
    return 'device';
  }
}

/** מחזיר את התמונה המקורית. */
export async function resetImage(id: string, slot: Slot) {
  const local = read(KEY_LOCAL); if (local[id]) { delete local[id][slot]; write(KEY_LOCAL, local); }
  (session[id] ||= {})[slot] = null;
  const remote = read(KEY_REMOTE); if (remote[id]) { delete remote[id][slot]; write(KEY_REMOTE, remote); }
  emit();
  await setMediaOverride(id, slot, null);
}

// מצב עריכה: נדלק מכפתור הלוגו. גרירה והדבקה עובדות תמיד; כפתורי ההעלאה וההחזרה רק במצב עריכה.
let editing = (() => { try { return localStorage.getItem('mm.editing') === '1'; } catch { return false; } })();
let editL: (() => void)[] = [];
export const useEditing = () => useSyncExternalStore((l) => { editL.push(l); return () => { editL = editL.filter((x) => x !== l); }; }, () => editing);
export function setEditing(v: boolean) { editing = v; try { localStorage.setItem('mm.editing', v ? '1' : '0'); } catch { /* ignore */ } editL.forEach((l) => l()); }

// המסגרת שמתחת לעכבר או בפוקוס מקבלת הדבקה (Ctrl+V).
let pasteTarget: ((f: File) => void) | null = null;
export const setPasteTarget = (fn: ((f: File) => void) | null) => { pasteTarget = fn; };
export function installPaste() {
  const on = (e: ClipboardEvent) => {
    if (!pasteTarget) return;
    if ((e.target as HTMLElement)?.closest?.('input,textarea')) return;
    const file = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith('image/'))?.getAsFile();
    if (file) { e.preventDefault(); pasteTarget(file); }
  };
  window.addEventListener('paste', on);
  return () => window.removeEventListener('paste', on);
}
