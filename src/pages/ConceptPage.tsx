import { useEffect } from 'react';
import CopyButton from '../components/CopyButton';
import Diagram from '../components/Diagram';
import Rich, { Name, Src } from '../components/Rich';
import { bySlug, CONCEPTS, Concept, forceOf } from '../lib/concepts';
import { go, href } from '../lib/route';
import { Generated, useGenerated, useJournal } from '../lib/store';

export const lines = (t: string) => t.split(/(?<=[.!?])\s+/).join('\n');

function Ops({ index, total, onPrev, onNext }: { index: number; total: number; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="ops" role="toolbar" aria-label="תפעול הכתבה">
      <button type="button" className="op" onClick={onPrev} aria-label="הקודם" title="הקודם">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
      </button>
      <span className="op-pos"><bdi className="num">{index + 1}</bdi> / <bdi className="num">{total}</bdi></span>
      <button type="button" className="op" onClick={onNext} aria-label="הבא" title="הבא">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
      </button>
      <a className="op" href={href('magazine')} aria-label="סגירה, חזרה למגזין" title="חזרה למגזין">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </a>
    </div>
  );
}

function Journal({ c }: { c: Concept }) {
  const { journal, update, state } = useJournal(c.slug);
  const stamp = journal.savedAt ? new Date(journal.savedAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) : '';
  return (
    <section className="loop" aria-label="יישום: מחשבה, מעשה, רישום">
      <div className="loop-head">
        <h2 className="section-head">מה עושים עם זה היום.</h2>
        <span className={`saved ${state}`} aria-live="polite">{state === 'saving' ? 'שומר...' : state === 'saved' ? `נשמר ${stamp}` : 'שמירה אוטומטית'}</span>
      </div>
      <div className="loop-grid">
        <label className="loop-step">
          <span className="label">1 · מחשבה</span>
          <Rich as="p" className="loop-q">{c.action.think}</Rich>
          <textarea className="field" rows={3} value={journal.think} onChange={(e) => update('think', e.target.value)} placeholder="מה עלה לכם" />
        </label>
        <label className="loop-step">
          <span className="label">2 · מעשה</span>
          <Rich as="p" className="loop-q">{c.action.do}</Rich>
          <textarea className="field" rows={3} value={journal.do} onChange={(e) => update('do', e.target.value)} placeholder="מה עשיתם" />
        </label>
        <label className="loop-step">
          <span className="label">3 · רישום</span>
          <p className="loop-q">מה גיליתם, במשפט אחד? זה ההמשך לפעם הבאה.</p>
          <textarea className="field" rows={3} value={journal.record} onChange={(e) => update('record', e.target.value)} placeholder="התובנה שלכם" />
        </label>
      </div>
    </section>
  );
}

function Hero({ c, ops }: { c: Concept; ops: JSX.Element }) {
  const f = forceOf(c.force);
  const head = (
    <header className="ft-head">
      <div className="ft-kicker"><span style={{ color: f.color }}>{f.name}</span> · {c.name} · <span dir="ltr">{c.latin}</span></div>
      <h1 className="ft-title">{c.architecturalName}</h1>
      <Rich as="p" className="ft-deck">{`${c.insightLine}\n${c.insightText}`}</Rich>
    </header>
  );
  const img = <img src={c.images.exterior} alt={`${c.architecturalName}, חזית`} />;
  const cap = <figcaption className="ft-caption">הדמיה שנוצרה במחולל MathArch, לפי הפרומפט שבסוף הכתבה.</figcaption>;
  if (c.layout === 'split') return (<div className="ft-split">{ops}<figure>{img}{cap}</figure>{head}</div>);
  if (c.layout === 'strip') return (<>{ops}{head}<figure className="ft-strip">{img}{cap}</figure></>);
  return (<>{ops}<figure className="ft-full">{img}<div className="ft-full-shade">{head}</div>{cap}</figure></>);
}

function SeedArticle({ c }: { c: Concept }) {
  const i = CONCEPTS.indexOf(c);
  const f = forceOf(c.force);
  const prev = CONCEPTS[(i - 1 + CONCEPTS.length) % CONCEPTS.length], next = CONCEPTS[(i + 1) % CONCEPTS.length];
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input,textarea')) return;
      if (e.key === 'ArrowRight') go('c', prev.slug);
      if (e.key === 'ArrowLeft') go('c', next.slug);
      if (e.key === 'Escape') go('magazine');
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [prev.slug, next.slug]);

  const ops = <Ops index={i} total={CONCEPTS.length} onPrev={() => go('c', prev.slug)} onNext={() => go('c', next.slug)} />;
  const sources = [c.rule.source, c.precedent.source, ...(c.failsSource ? [c.failsSource] : [])];

  return (
    <article className={`ft concept force-${c.force}`} style={{ ['--accent' as any]: f.color }}>
      <div className="crumbs ft-crumbs"><a href={href('home')}>בית</a> / <a href={href('magazine', undefined, { f: c.force })}>{f.name}</a> / {c.name}</div>
      <Hero c={c} ops={ops} />

      <section className="rule-block">
        <div className="rule-text">
          <span className="label">הכלל</span>
          <div className="formula" dir="ltr">{c.rule.formula}</div>
          <Rich as="p" className="rule-p">{c.rule.text}</Rich>
          <Src {...c.rule.source} />
        </div>
        <Diagram slug={c.slug} />
      </section>

      <section className="tones tones-2">
        <div className="tone tone-solution"><h4>כשזה עובד</h4><Rich as="p">{c.works}</Rich></div>
        <div className="tone tone-problem"><h4>כשזה נכשל</h4><Rich as="p">{c.fails}</Rich>{c.failsSource && <Src {...c.failsSource} />}</div>
      </section>

      <section className="building">
        <h2 className="section-head">הבניין מבחוץ ומבפנים.</h2>
        <div className="pair">
          <figure><img src={c.images.exterior} alt={`${c.architecturalName}, חזית`} loading="lazy" /><figcaption className="ft-caption">חזית</figcaption></figure>
          <figure><img src={c.images.interior} alt={`${c.architecturalName}, חלל פנימי`} loading="lazy" /><figcaption className="ft-caption">חלל פנימי</figcaption></figure>
        </div>
        {(c.videos.exterior || c.videos.interior) && (
          <div className="pair">
            {c.videos.exterior && <figure><video src={c.videos.exterior} poster={c.images.exterior} controls muted playsInline preload="none" /><figcaption className="ft-caption">חזית בתנועה</figcaption></figure>}
            {c.videos.interior && <figure><video src={c.videos.interior} poster={c.images.interior} controls muted playsInline preload="none" /><figcaption className="ft-caption">פנים בתנועה</figcaption></figure>}
          </div>
        )}
      </section>

      <section className="real">
        <div className="real-card">
          <span className="label">תקדים בעולם · {c.precedent.year}</span>
          <Name as="h3" he={c.precedent.name.he} latin={c.precedent.name.latin} />
          <div className="real-by">{c.precedent.by}</div>
          <Rich as="p">{c.precedent.text}</Rich>
          <Src {...c.precedent.source} />
        </div>
        <div className="real-card city">
          <span className="label">בעיר</span>
          <Name as="h3" he={c.city.name.he} latin={c.city.name.latin} />
          <Rich as="p">{c.city.text}</Rich>
        </div>
      </section>

      <div className="ft-col">
        {c.quote && (
          <blockquote className="ft-quote">
            <span className="label">ציטוט · תרגום</span>
            <p>״{c.quote.text}״</p>
            <p className="quote-orig" dir="auto">"{c.quote.original}"</p>
            <cite><Name he={c.quote.by.he} latin={c.quote.by.latin} />, <i>{c.quote.work}</i>, {c.quote.year}</cite>
          </blockquote>
        )}


        <section className="proverb">
          <span className="label">פתגם שנכתב בהשראת המושג</span>
          <p className="proverb-text">״{c.generated.proverb}״</p>
          <details>
            <summary>הטקסט המלא מהמחולל: תובנה ופרשנות</summary>
            <Rich as="p">{lines(c.generated.insight)}</Rich>
            <Rich as="p">{lines(c.generated.interpretation)}</Rich>
          </details>
        </section>

        <aside className="ft-haiku" aria-label="הייקו">
          {c.haiku.lines.map((l, k) => <span key={k}>{l}</span>)}
          <small>{c.haiku.note}</small>
        </aside>

        <section className="ft-links" aria-label="חיבורים">
          <h2 className="section-head">חיבורים למושגים אחרים.</h2>
          {c.links.map((l) => {
            const to = bySlug(l.to)!;
            return (
              <a key={l.to} className="press ft-link" href={href('c', l.to)} style={{ ['--fc' as any]: forceOf(to.force).color }}>
                <span className="ft-link-to">{c.name} ← {to.name}</span>
                <span className="ft-link-rule"><b>הכלל:</b> <Rich>{l.rule}</Rich></span>
                <Rich className="ft-link-insight">{`==${l.insight}==`}</Rich>
                <span className="ft-link-action"><b>מה עושים:</b> {l.action}</span>
              </a>
            );
          })}
        </section>
      </div>

      <Journal c={c} />

      <div className="ft-col">
        <section className="ft-post" aria-label="פוסט">
          <div className="row-between"><span className="label">פוסט מוכן לשיתוף</span><CopyButton text={c.post.replace(/\*\*/g, '')} label="העתקת הפוסט" /></div>
          <Rich as="p">{c.post}</Rich>
        </section>

        <section className="prompts" aria-label="פרומפטים">
          <h2 className="section-head">פרומפטים לתמונה.</h2>
          <div className="prompt mj">
            <div className="row-between"><span className="label">מידג׳רני</span><CopyButton text={`${c.mj.distill}\n${c.mj.prompt}`} label="העתקה" /></div>
            <p className="prompt-distill">{c.mj.distill}</p>
            <p className="prompt-body">{c.mj.prompt}</p>
          </div>
          <details className="prompt">
            <summary>הפרומפטים המקוריים באנגלית, חזית ופנים</summary>
            <div className="row-between"><span className="label">חזית</span><CopyButton text={c.prompts.exterior} /></div>
            <p className="prompt-body" dir="ltr">{c.prompts.exterior}</p>
            <div className="row-between"><span className="label">פנים</span><CopyButton text={c.prompts.interior} /></div>
            <p className="prompt-body" dir="ltr">{c.prompts.interior}</p>
          </details>
        </section>

        <footer className="ft-sources">
          <span className="label">מקורות</span>
          <ol>{sources.map((s, k) => <li key={k}><Src {...s} /></li>)}</ol>
        </footer>
      </div>
    </article>
  );
}

function GeneratedArticle({ g }: { g: Generated }) {
  const d = g.dimensions;
  const first = d.insight.split(/(?<=[.!?])\s+/)[0];
  return (
    <article className="ft concept">
      <div className="crumbs ft-crumbs"><a href={href('home')}>בית</a> / <a href={href('magazine', undefined, { f: 'gen' })}>מהמחולל</a> / {g.concept}</div>
      <header className="ft-head">
        <div className="ft-kicker">מהמחולל · {g.concept} · <bdi className="num">{new Date(g.createdAt).toLocaleDateString('he-IL')}</bdi></div>
        <h1 className="ft-title">{d.architecturalName}</h1>
        <Rich as="p" className="ft-deck">{first}</Rich>
      </header>
      {(g.images.exterior || g.images.interior) && (
        <div className="pair">
          {g.images.exterior && <figure><img src={g.images.exterior} alt="חזית" /><figcaption className="ft-caption">חזית</figcaption></figure>}
          {g.images.interior && <figure><img src={g.images.interior} alt="חלל פנימי" /><figcaption className="ft-caption">חלל פנימי</figcaption></figure>}
        </div>
      )}
      <div className="ft-col">
        <section className="proverb">
          <span className="label">פתגם</span>
          <p className="proverb-text">״{d.proverb}״</p>
        </section>
        <section><span className="label">תובנה</span><Rich as="p" className="ft-p">{lines(d.insight)}</Rich></section>
        <section><span className="label">פרשנות</span><Rich as="p" className="ft-p">{lines(d.interpretation)}</Rich></section>
        <div className="tone tone-neutral"><h4>טיוטה מהמחולל.</h4><p>הטקסט נוצר במודל ולא נבדק מול מקור. כלל, תקדים ודוגמה מהעיר נוספים כשהמושג עולה למגזין.</p></div>
        <section className="prompts">
          <h2 className="section-head">פרומפטים לתמונה.</h2>
          <div className="row-between"><span className="label">חזית</span><CopyButton text={d.imagePrompts.exterior} /></div>
          <p className="prompt-body" dir="ltr">{d.imagePrompts.exterior}</p>
          <div className="row-between"><span className="label">פנים</span><CopyButton text={d.imagePrompts.interior} /></div>
          <p className="prompt-body" dir="ltr">{d.imagePrompts.interior}</p>
        </section>
      </div>
    </article>
  );
}

export default function ConceptPage({ arg }: { arg: string }) {
  const generated = useGenerated();
  const c = bySlug(arg);
  if (c) return <SeedArticle c={c} />;
  const g = generated.find((x) => x.id === arg);
  if (g) return <GeneratedArticle g={g} />;
  return (
    <main className="page">
      <div className="tone tone-problem"><h4>המושג לא נמצא.</h4><p>ייתכן שהקישור ישן. חזרו ל<a href={href('magazine')}>מגזין</a> ובחרו מושג מהרשימה.</p></div>
    </main>
  );
}
