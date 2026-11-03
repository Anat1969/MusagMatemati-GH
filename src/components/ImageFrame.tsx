import React, { useRef, useState } from 'react';
import { putImage, resetImage, setPasteTarget, Slot, useEditing, useMedia } from '../lib/media';

// מסגרת תמונה שאפשר להדביק אליה (Ctrl+V), לגרור אליה קובץ או להעלות. התמונה נשמרת בשרת ומופיעה בכל מכשיר.
// הכפתורים (העלאה, החזרת המקור) מופיעים רק במצב עריכה, שנדלק מכפתור הלוגו. גרירה והדבקה עובדות תמיד.
interface Props {
  id: string;
  slot: Slot;
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  caption?: string;
  lazy?: boolean;
  children?: React.ReactNode;
}

type State = { kind: 'idle' } | { kind: 'busy' } | { kind: 'ok'; text: string } | { kind: 'err'; text: string };

export default function ImageFrame({ id, slot, src, alt, className = '', imgClassName, caption, lazy, children }: Props) {
  const media = useMedia();
  const editing = useEditing();
  const over = media[id]?.[slot];
  const shown = over?.url || src || '';
  const [drag, setDrag] = useState(false);
  const [state, setState] = useState<State>({ kind: 'idle' });
  const input = useRef<HTMLInputElement>(null);

  const take = async (file: File | undefined | null) => {
    if (!file) return;
    setState({ kind: 'busy' });
    try {
      const where = await putImage(id, slot, file);
      setState({ kind: 'ok', text: where === 'server' ? 'התמונה נשמרה, ותופיע בכל מכשיר' : where === 'guest' ? 'נשמרה במכשיר הזה. לשמירה לכולם: פתחי את הקישור האישי במכשיר הזה' : 'נשמרה במכשיר הזה בלבד. השרת לא זמין כרגע' });
    } catch (e) {
      setState({ kind: 'err', text: e instanceof Error ? e.message : 'השמירה נכשלה' });
    }
    setTimeout(() => setState((s) => (s.kind === 'ok' ? { kind: 'idle' } : s)), 3500);
  };

  const reset = async () => {
    setState({ kind: 'busy' });
    try { await resetImage(id, slot); setState({ kind: 'ok', text: 'התמונה המקורית חזרה' }); }
    catch { setState({ kind: 'err', text: 'ההחזרה נשמרה במכשיר, אבל לא בשרת. נסו שוב כשיש רשת' }); }
  };

  const activate = () => setPasteTarget(take);

  return (
    <figure
      className={`frame ${className} ${drag ? 'is-drag' : ''} ${editing ? 'is-edit' : ''} ${shown ? '' : 'is-empty'}`}
      data-frame={`${id}:${slot}`}
      tabIndex={0}
      aria-label={`${alt}. אפשר להדביק, לגרור או להעלות תמונה`}
      onMouseEnter={activate}
      onFocus={activate}
      onMouseLeave={() => setPasteTarget(null)}
      onDragEnter={(e) => { if ([...e.dataTransfer.types].includes('Files')) { e.preventDefault(); setDrag(true); } }}
      onDragOver={(e) => { if ([...e.dataTransfer.types].includes('Files')) { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; } }}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDrag(false); }}
      onDrop={(e) => { e.preventDefault(); setDrag(false); take(e.dataTransfer.files[0]); }}
    >
      {shown ? (
        <img src={shown} alt={alt} className={imgClassName} loading={lazy ? 'lazy' : undefined} />
      ) : (
        <div className="frame-empty" onClick={() => input.current?.click()}>
          <strong>אין תמונה עדיין</strong>
          <span>גררו לכאן תמונה, הדביקו אותה, או לחצו להעלאה</span>
        </div>
      )}

      {children}
      {drag && <div className="frame-drop" aria-hidden="true"><strong>שחררו כאן</strong><span>התמונה תחליף את הקיימת</span></div>}

      {editing && shown && (
        <div className="frame-tools" role="toolbar" aria-label="תמונה">
          <button type="button" className="op" onClick={() => input.current?.click()} aria-label="העלאת תמונה" title="העלאת תמונה">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M5 20h14" /></svg>
          </button>
          {over && (
            <button type="button" className="op" onClick={reset} aria-label="החזרת התמונה המקורית" title="החזרת התמונה המקורית">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v5h5" /></svg>
            </button>
          )}
        </div>
      )}
      {editing && <div className="frame-hint">גררו, הדביקו (Ctrl+V) או העלו תמונה</div>}

      {state.kind !== 'idle' && (
        <div className={`frame-status ${state.kind}`} role="status">
          {state.kind === 'busy' ? 'מעלה ושומר...' : state.text}
        </div>
      )}
      {over?.local && state.kind === 'idle' && <div className="frame-status err" role="status">נשמרה במכשיר הזה בלבד</div>}

      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => { take(e.target.files?.[0]); e.target.value = ''; }} />
      {caption && <figcaption className="ft-caption">{caption}</figcaption>}
    </figure>
  );
}
