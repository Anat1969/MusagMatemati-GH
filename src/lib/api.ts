// הגישה לשרת הקיים של MathArch (Supabase של פרויקט Lovable).
// המפתח הוא מפתח anon ציבורי, אותו מפתח שכבר נמצא באתר המקורי. מפתחות ה-AI נשמרים בשרת בלבד.
export const SB_URL = 'https://zdeivlkaqrnsqvtzfypw.supabase.co';
export const SB_ANON =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZWl2bGthcXJuc3F2dHpmeXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNzc2NTMsImV4cCI6MjA5MTc1MzY1M30.TLQajdlydTn5StneXvyIgyc5QM6rug6DujVqDyu_qcg';

const headers = { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}`, 'Content-Type': 'application/json' };

export interface Dimensions {
  insight: string;
  architecturalName: string;
  proverb: string;
  interpretation: string;
  imagePrompts: { exterior: string; interior: string };
}

async function call<T>(fn: string, body: unknown): Promise<T> {
  const res = await fetch(`${SB_URL}/functions/v1/${fn}`, { method: 'POST', headers, body: JSON.stringify(body) });
  let data: any = null;
  try { data = await res.json(); } catch { /* empty */ }
  if (!res.ok || data?.error) throw new Error(data?.error || `השרת החזיר ${res.status}`);
  return data as T;
}

export const generateDimensions = (concept: string) => call<Dimensions>('generate-dimensions', { concept });
export const generateImages = (exteriorPrompt: string, interiorPrompt: string) =>
  call<{ exterior: string; interior: string }>('generate-images', { exteriorPrompt, interiorPrompt });

export async function fetchArticles(): Promise<any[]> {
  const res = await fetch(`${SB_URL}/rest/v1/articles?select=*&order=created_at.desc`, { headers });
  if (!res.ok) throw new Error(`articles ${res.status}`);
  return res.json();
}

const auth = async () => (await import('./auth')).writeHeaders();

export async function upsertArticle(row: Record<string, unknown>) {
  const res = await fetch(`${SB_URL}/rest/v1/articles`, {
    method: 'POST',
    headers: { ...headers, ...(await auth()), Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify([row]),
  });
  if (!res.ok) throw new Error(`save ${res.status}`);
}

// תמונות במסגרות: אותו דלי כמו באתר המקורי (article-media, ציבורי).
export const BUCKET = 'article-media';
export const publicUrl = (path: string) => `${SB_URL}/storage/v1/object/public/${BUCKET}/${path}`;

export async function uploadImage(path: string, blob: Blob) {
  const res = await fetch(`${SB_URL}/storage/v1/object/${BUCKET}/${path}`, {
    method: 'POST',
    headers: { ...(await auth()), 'Content-Type': blob.type, 'x-upsert': 'true' },
    body: blob,
  });
  if (!res.ok) throw new Error(`העלאה ${res.status}`);
  return publicUrl(path);
}

/** כותב את ההחלפה ל-media_assets.<slot>.musag, בלי לגעת בתמונה המקורית. url ריק מחזיר את המקור. */
export async function setMediaOverride(id: string, slot: 'exterior' | 'interior', url: string | null) {
  const get = await fetch(`${SB_URL}/rest/v1/articles?id=eq.${id}&select=media_assets`, { headers });
  if (!get.ok) throw new Error(`קריאה ${get.status}`);
  const rows = await get.json();
  if (!rows.length) throw new Error('המושג לא נמצא בשרת');
  const media = rows[0].media_assets || {};
  const cur = { ...(media[slot] || {}) };
  if (url) cur.musag = { url, at: new Date().toISOString() }; else delete cur.musag;
  const next = { ...media, [slot]: cur };
  const res = await fetch(`${SB_URL}/rest/v1/articles?id=eq.${id}`, {
    method: 'PATCH',
    headers: { ...headers, ...(await auth()), Prefer: 'return=minimal' },
    body: JSON.stringify({ media_assets: next, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(`שמירה ${res.status}`);
}
