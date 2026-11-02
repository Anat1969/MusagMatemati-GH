import { useEffect, useRef } from 'react';
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
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.status = editing ? 'מצב עריכה: גררו, הדביקו או העלו תמונה' : '';
    el.items = [
      { label: editing ? 'סיום עריכה' : 'מצב עריכה', hint: editing ? 'פעיל' : 'תמונות במסגרות', pressed: editing, onSelect: () => setEditing(!editing) },
      { label: 'מושג חדש במחולל', onSelect: () => go('lab') },
      { label: 'הגרסה המקורית ב-Lovable', onSelect: () => window.open(LOVABLE_URL, '_blank') },
      { label: 'הדפסה ל-PDF', hint: 'A4', onSelect: () => window.print() },
    ];
  }, [editing]);
  return <ai-menu ref={ref} chat={DEV_SESSION_URL} />;
}
