import { useEffect, useRef, useState } from 'react';
import { OWNER, signIn, signOut, useAuth } from '../lib/auth';
import { setEditing, useEditing } from '../lib/media';
import { go } from '../lib/route';

export const DEV_SESSION_URL = 'https://claude.ai/code/session_018qeN18rN5AxfGiAQxVfXYn';
export const LOVABLE_URL = 'https://lovable.dev/projects/5627b53f-ff90-4c6c-a1cc-ce1038440dfe';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ai-menu': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { chat?: string; research?: string };
    }
  }
}

/** כפתור הלוגו A&I (ai-menu.js). כל פעולות המערכת נמצאות בתוכו, לא בסרגל. */
export default function AIMenu() {
  const ref = useRef<HTMLElement & { items?: unknown[]; status?: string }>(null);
  const editing = useEditing();
  const { email, isOwner } = useAuth();
  const [note, setNote] = useState('');
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.status = note || (email ? (isOwner ? `מחוברת: ${email}` : `${email}: צפייה בלבד`) : editing ? 'מצב עריכה: שמירה במכשיר עד הכניסה' : '');
    el.items = [
      { label: editing ? 'סיום עריכה' : 'מצב עריכה', hint: editing ? 'פעיל' : 'תמונות במסגרות', pressed: editing, onSelect: () => setEditing(!editing) },
      email
        ? { label: 'יציאה', hint: email, onSelect: () => signOut() }
        : {
            label: 'כניסה: קישור למייל',
            hint: OWNER,
            onSelect: () => {
              setNote('שולח קישור...');
              signIn()
                .then(() => setNote(`נשלח קישור ל-${OWNER}. פתחי אותו בדפדפן הזה`))
                .catch((e) => setNote(`הקישור לא נשלח: ${e.message}. נסי שוב בעוד דקה`));
            },
          },
      { label: 'מושג חדש במחולל', onSelect: () => go('lab') },
      { label: 'הגרסה המקורית ב-Lovable', onSelect: () => window.open(LOVABLE_URL, '_blank') },
      { label: 'הדפסה ל-PDF', hint: 'A4', onSelect: () => window.print() },
    ];
  }, [editing, email, isOwner, note]);
  return <ai-menu ref={ref} chat={DEV_SESSION_URL} />;
}
