import { useState } from 'react';
import IsoCity from '../components/IsoCity';
import Rich, { Name } from '../components/Rich';
import { CONCEPTS, EXAMPLES, FORCES } from '../lib/concepts';
import { go, href } from '../lib/route';
import { useGenerated } from '../lib/store';

export default function Home() {
  const [active, setActive] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const generated = useGenerated();
  const act = CONCEPTS.find((c) => c.slug === active);

  return (
    <main className="page page-wide">
      <section className="hero rise">
        <div className="hero-text">
          <div className="kicker">MathArch · מתמטיקה ואדריכלות</div>
          <h1 className="hero-title">כל בניין עונה על <bdi className="num">3</bdi> שאלות.</h1>
          <Rich as="p" className="hero-sub">{'**איך מחלקים**, **איך מחברים** ו**איך משתנים**.\n**6** מושגים מתמטיים, כל אחד עם כלל, בניין, תקדים ופעולה בעיר.'}</Rich>
          <div className="hero-kpi">
            <div><span className="label">מושגים</span><bdi className="num kpi">{CONCEPTS.length}</bdi></div>
            <div><span className="label">כוחות</span><bdi className="num kpi">{FORCES.length}</bdi></div>
            <div><span className="label">מהמחולל</span><bdi className="num kpi">{generated.length}</bdi></div>
          </div>
        </div>
        <div className="hero-city">
          <IsoCity active={active} setActive={setActive} />
          <div className="city-tip" aria-live="polite">
            {act ? <><strong>{act.name}</strong> <span className="city-tip-sub">{act.architecturalName}</span></> : <span className="city-tip-sub">רחפו על בניין או על שורה במקרא. לחיצה פותחת את המושג.</span>}
          </div>
        </div>
      </section>

      <section className="legend rise" aria-label="מקרא: שלושה כוחות ושישה מושגים">
        {FORCES.map((f) => (
          <div key={f.id} className="legend-col" style={{ ['--fc' as any]: f.color, ['--fw' as any]: f.wash }}>
            <div className="legend-head">
              <span className="legend-swatch" aria-hidden="true" />
              <span className="legend-name">{f.name}</span>
              <span className="legend-q">{f.question}</span>
            </div>
            <Rich as="p" className="legend-line">{f.line}</Rich>
            {CONCEPTS.filter((c) => c.force === f.id).map((c) => (
              <a
                key={c.slug}
                href={href('c', c.slug)}
                className={`legend-row press ${active === c.slug ? 'is-hot' : ''}`}
                onMouseEnter={() => setActive(c.slug)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(c.slug)}
                onBlur={() => setActive(null)}
              >
                <span className="legend-concept">{c.name}</span>
                <Rich className="legend-insight">{c.insightLine}</Rich>
              </a>
            ))}
          </div>
        ))}
      </section>

      <section className="tones rise" aria-label="בעיה, פתרון, תובנה">
        <div className="tone tone-problem">
          <h4>הבעיה</h4>
          <Rich as="p">{'מתמטיקה נלמדת כ**נוסחה**, ואדריכלות כ**צורה**.\nהקשר ביניהן נשאר מופשט.'}</Rich>
        </div>
        <div className="tone tone-solution">
          <h4>הפתרון</h4>
          <Rich as="p">{'לכל מושג: **כלל** עם מקור, **בניין** עם תקדים אמיתי, ו**פעולה** בעיר.\nשרטוט חי מראה את הכלל עובד.'}</Rich>
        </div>
        <div className="tone tone-insight">
          <h4>התובנה</h4>
          <Rich as="p">{'==מושג מובן כשאפשר להיכנס אליו.==\nהבניין הוא הדרך לגעת בכלל.'}</Rich>
        </div>
      </section>

      <section className="home-quote rise">
        <blockquote>
          <p>״הספר הגדול של הטבע כתוב בשפה המתמטית.״</p>
          <footer><Name he="גלילאו גליליי" latin="Galileo Galilei" />, <i>Il Saggiatore</i>, <bdi className="num">1623</bdi> <span className="src">תרגום חופשי. במקור: «è scritto in lingua matematica»</span></footer>
        </blockquote>
      </section>

      <section className="home-lab rise">
        <div>
          <h2 className="section-head">מושג משלכם.</h2>
          <Rich as="p" className="muted">{'המחולל הופך מושג מתמטי ל**שם אדריכלי**, **תובנה**, **פתגם** ו**פרומפטים** לתמונה.'}</Rich>
        </div>
        <form className="lab-form" onSubmit={(e) => { e.preventDefault(); if (draft.trim()) go('lab', undefined, { q: draft.trim() }); }}>
          <input className="field" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="למשל: פרקטל" aria-label="מושג מתמטי למחולל" />
          <button className="press btn btn-primary" type="submit" disabled={!draft.trim()}>יצירת עולם</button>
        </form>
        <div className="chips" aria-label="דוגמאות">
          {EXAMPLES.map((x) => <button key={x} type="button" className="chip" onClick={() => go('lab', undefined, { q: x })}>{x}</button>)}
        </div>
      </section>

      <footer className="inspo">
        בהשראת <Name he="המודולור" latin="Le Modulor" /> של לה קורבוזיה, <bdi className="num">1948</bdi>, ו<Name he="ביתן פיליפס" latin="Philips Pavilion" /> של <Name he="יאניס קסנאקיס" latin="Iannis Xenakis" />, <bdi className="num">1958</bdi>: מתמטיקה שנבנתה.
      </footer>
    </main>
  );
}
