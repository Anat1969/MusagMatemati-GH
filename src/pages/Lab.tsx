import { useCallback, useEffect, useRef, useState } from 'react';
import CopyButton from '../components/CopyButton';
import Rich from '../components/Rich';
import { Dimensions, generateDimensions, generateImages } from '../lib/api';
import { EXAMPLES } from '../lib/concepts';
import { go, href, Route } from '../lib/route';
import { saveGenerated, uid } from '../lib/store';
import { lines } from './ConceptPage';

const PHASES = ['מפענח את המבנה המתמטי', 'בונה מרחב אדריכלי', 'מנסח תובנה פילוסופית', 'יוצר פתגם', 'מעצב חזית ופנים', 'מתרגם למשל אדריכלי'];
type Status = 'idle' | 'loading' | 'done' | 'error';

const cacheKey = (q: string) => `mm.lab.${q}`;

export default function Lab({ route }: { route: Route }) {
  const q = route.params.q || '';
  const [draft, setDraft] = useState(q);
  const [status, setStatus] = useState<Status>('idle');
  const [phase, setPhase] = useState(0);
  const [result, setResult] = useState<Dimensions | null>(null);
  const [error, setError] = useState('');
  const [images, setImages] = useState<{ exterior?: string; interior?: string }>({});
  const [imgState, setImgState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [imgError, setImgError] = useState('');
  const [saved, setSaved] = useState<{ id: string; where: string } | null>(null);
  const started = useRef('');

  const run = useCallback(async (concept: string) => {
    setStatus('loading'); setError(''); setResult(null); setImages({}); setSaved(null); setPhase(0);
    try {
      const d = await generateDimensions(concept);
      setResult(d); setStatus('done');
      try { sessionStorage.setItem(cacheKey(concept), JSON.stringify(d)); } catch { /* ignore */ }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'שגיאה לא ידועה'); setStatus('error');
    }
  }, []);

  useEffect(() => {
    setDraft(q);
    if (!q || started.current === q) return;
    started.current = q;
    try {
      const hit = sessionStorage.getItem(cacheKey(q));
      if (hit) { setResult(JSON.parse(hit)); setStatus('done'); return; }
    } catch { /* ignore */ }
    run(q);
  }, [q, run]);

  useEffect(() => {
    if (status !== 'loading') return;
    const t = setInterval(() => setPhase((p) => (p + 1) % PHASES.length), 2200);
    return () => clearInterval(t);
  }, [status]);

  const makeImages = async () => {
    if (!result) return;
    setImgState('loading'); setImgError('');
    try { setImages(await generateImages(result.imagePrompts.exterior, result.imagePrompts.interior)); setImgState('idle'); }
    catch (e) { setImgError(e instanceof Error ? e.message : 'שגיאה'); setImgState('error'); }
  };

  const save = async () => {
    if (!result) return;
    const id = uid();
    const where = await saveGenerated({ id, concept: q, createdAt: new Date().toISOString(), dimensions: result, images });
    setSaved({ id, where: where === 'saved' ? 'נשמר במגזין ובשרת' : 'נשמר במכשיר הזה. לשמירה לכולם: פתחי את הקישור האישי במכשיר הזה' });
  };

  const submit = (v: string) => { const t = v.trim(); if (!t) return; started.current = ''; try { sessionStorage.removeItem(cacheKey(t)); } catch { /* ignore */ } go('lab', undefined, { q: t }); if (t === q) { started.current = t; run(t); } };

  return (
    <main className="page">
      <div className="crumbs"><a href={href('home')}>בית</a> / מחולל</div>
      <h1 className="page-title">מושג מתמטי הופך לעולם.</h1>
      <Rich as="p" className="page-sub">{'המחולל כותב **שם אדריכלי**, **תובנה**, **פתגם** ו**פרומפטים** לתמונה.\nהטקסט נוצר במודל Gemini בשרת של האפליקציה, והוא טיוטה עד שנבדק מול מקור.'}</Rich>

      <form className="lab-form" onSubmit={(e) => { e.preventDefault(); submit(draft); }}>
        <input className="field" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="מושג מתמטי, למשל: פרקטל" aria-label="מושג מתמטי" />
        <button className="press btn btn-primary" type="submit" disabled={!draft.trim() || status === 'loading'}>{status === 'done' && draft.trim() === q ? 'יצירה מחדש' : 'יצירת עולם'}</button>
      </form>
      <div className="chips" aria-label="דוגמאות">
        {EXAMPLES.map((x) => <button key={x} type="button" className={`chip ${x === q ? 'is-on' : ''}`} onClick={() => submit(x)}>{x}</button>)}
      </div>

      {status === 'idle' && (
        <div className="tone tone-neutral lab-empty">
          <h4>עוד לא נבחר מושג.</h4>
          <p>כתבו מושג או בחרו דוגמה. התוצאה מופיעה כאן, ואפשר לשמור אותה במגזין.</p>
        </div>
      )}

      {status === 'loading' && (
        <div className="lab-loading" aria-live="polite">
          <div className="blueprint-anim" aria-hidden="true"><span /><span /><span /><span /></div>
          <p><strong>{q}</strong>: {PHASES[phase]}...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="tone tone-problem">
          <h4>היצירה נכשלה.</h4>
          <p>{error}</p>
          <p>בדקו חיבור לרשת ונסו שוב. אם זה חוזר, ייתכן שמכסת המודל החינמית נגמרה להיום.</p>
          <button type="button" className="press btn" onClick={() => run(q)}>ניסיון נוסף</button>
        </div>
      )}

      {status === 'done' && result && (
        <article className="lab-result rise">
          <div className="ft-kicker">{q}</div>
          <h2 className="lab-title">{result.architecturalName}</h2>
          <Rich as="p" className="lab-insight">{`==${result.insight.split(/(?<=[.!?])\s+/)[0]}==`}</Rich>
          <Rich as="p" className="muted">{lines(result.insight.split(/(?<=[.!?])\s+/).slice(1).join(' '))}</Rich>
          <blockquote className="lab-proverb">״{result.proverb}״</blockquote>
          <Rich as="p" className="muted">{lines(result.interpretation)}</Rich>

          <div className="pair">
            {(['exterior', 'interior'] as const).map((k) => (
              <figure key={k} className="lab-img">
                {images[k] ? <img src={images[k]} alt={k === 'exterior' ? 'חזית' : 'פנים'} /> : <div className="mag-noimg">{imgState === 'loading' ? 'יוצר תמונה...' : 'עוד אין תמונה'}</div>}
                <figcaption className="ft-caption row-between">{k === 'exterior' ? 'חזית' : 'פנים'} <CopyButton text={result.imagePrompts[k]} label="העתקת פרומפט" /></figcaption>
              </figure>
            ))}
          </div>
          {imgState === 'error' && <div className="tone tone-problem"><h4>התמונות לא נוצרו.</h4><p>{imgError}. אפשר להעתיק את הפרומפט וליצור בכלי אחר.</p></div>}

          <div className="lab-actions">
            <button type="button" className="press btn" onClick={makeImages} disabled={imgState === 'loading'}>{images.exterior ? 'תמונות חדשות' : 'יצירת תמונות'}</button>
            <button type="button" className="press btn btn-primary" onClick={save} disabled={!!saved}>{saved ? 'נשמר' : 'שמירה במגזין'}</button>
          </div>
          {saved && <p className="saved saved-line">{saved.where}. <a href={href('c', saved.id)}>לכתבה</a></p>}
        </article>
      )}
    </main>
  );
}
