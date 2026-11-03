import { createClient, type Session } from '@supabase/supabase-js';
import { useSyncExternalStore } from 'react';
import { SB_ANON, SB_URL } from './api';

// זיהוי הבעלים בלי כניסה: קישור אישי (#/me?k=…) שנפתח פעם אחת בכל מכשיר, והמכשיר זוכר מאז (בקשת ענת,
// 03.11.2026). המפתח הוא האישור היחיד של המשתמשת, והוא לא נשמר בקוד. קישור למייל נשאר כגיבוי.
// רק הבעלים כותבת לשרת ומפעילה יצירת תמונות (RLS ובדיקה בפונקציה לפי האימייל); כל השאר קוראים.
// Google המנוהל של Lovable Cloud עובד רק דרך המתווך של Lovable, שקיים רק בדומיין של Lovable,
// ובשרת עצמו אין לו סוד OAuth ("missing OAuth secret"). לכן ב-Vercel: קישור למייל.
export const OWNER = 'shtanat5@gmail.com';
const RETURN_KEY = 'mm.auth.return';

export const sb = createClient(SB_URL, SB_ANON, {
  auth: { flowType: 'pkce', detectSessionInUrl: true, persistSession: true, autoRefreshToken: true, storageKey: 'mm.auth' },
});

let session: Session | null = null;
let ls: (() => void)[] = [];
const emit = () => ls.forEach((l) => l());

sb.auth.getSession().then(({ data }) => { session = data.session; emit(); afterReturn(); });
claimFromLink();
// גם כשהקישור נפתח בלשונית שהאפליקציה כבר פתוחה בה: רק ה-hash משתנה.
window.addEventListener('hashchange', () => { claimFromLink(); });

/** "המכשיר הזה שלי": הקישור האישי נושא את המפתח. נכנסים בשקט, שומרים את הסשן, ומנקים את הכתובת מיד. */
export let deviceNote = '';
async function claimFromLink() {
  const m = window.location.hash.match(/^#\/me\?k=([A-Za-z0-9_-]{20,})/);
  if (!m) return;
  history.replaceState(null, '', window.location.pathname + '#/');
  window.dispatchEvent(new HashChangeEvent('hashchange'));
  const { error } = await sb.auth.signInWithPassword({ email: OWNER, password: m[1]! });
  deviceNote = error ? 'הקישור האישי לא זוהה. אפשר לבקש קישור חדש.' : 'המכשיר הזה מזוהה כשלך. מעכשיו בלי כניסה.'
  emit()
}
sb.auth.onAuthStateChange((_e, s) => { session = s; emit(); });

// אחרי החזרה מ-Google: הכתובת נושאת ?code=. מנקים אותה וחוזרים לדף שממנו יצאנו.
function afterReturn() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has('code') && !url.searchParams.has('error')) return;
  let back = '';
  try { back = sessionStorage.getItem(RETURN_KEY) || localStorage.getItem(RETURN_KEY) || ''; sessionStorage.removeItem(RETURN_KEY); localStorage.removeItem(RETURN_KEY); } catch { /* ignore */ }
  history.replaceState(null, '', url.pathname + (back || url.hash));
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

export function useAuth() {
  const s = useSyncExternalStore((l) => { ls.push(l); return () => { ls = ls.filter((x) => x !== l); }; }, () => session);
  const email = s?.user?.email || '';
  return { email, signedIn: !!s, isOwner: email.toLowerCase() === OWNER };
}

export const isOwner = () => (session?.user?.email || '').toLowerCase() === OWNER;

/** שולח קישור כניסה למייל של הבעלים. הקישור נפתח באותו דפדפן, כי קוד האימות נשמר בו. */
export async function signIn() {
  try { sessionStorage.setItem(RETURN_KEY, window.location.hash); localStorage.setItem(RETURN_KEY, window.location.hash); } catch { /* ignore */ }
  const { error } = await sb.auth.signInWithOtp({ email: OWNER, options: { emailRedirectTo: window.location.origin + window.location.pathname, shouldCreateUser: true } });
  if (error) throw new Error(error.message);
}

export const signOut = () => sb.auth.signOut();

/** כותרות לבקשת כתיבה: עם הכניסה של הבעלים כשיש, אחרת המפתח הציבורי (והשרת יסרב). */
export async function writeHeaders(): Promise<Record<string, string>> {
  const { data } = await sb.auth.getSession();
  return { apikey: SB_ANON, Authorization: `Bearer ${data.session?.access_token || SB_ANON}` };
}
