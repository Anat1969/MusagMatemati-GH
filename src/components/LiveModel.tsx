import Rich from './Rich';
import { mcModelUrl, MC_SITE } from '../lib/bridge';
import { Concept } from '../lib/concepts';
import { useModelChai } from '../lib/modelchai';

const REL = { same: 'אותו מושג', near: 'מושג קרוב' } as const;
const FIT = { full: 'נבנה במלואו', partial: 'נבנה בקירוב', none: 'עוד לא נבנה' } as const;

// המודל החי: מה שהמושג נעשה כשבונים אותו בתלת־ממד, מתוך האטלס של "מודל חי".
export default function LiveModel({ c }: { c: Concept }) {
  const atlas = useModelChai();
  const links = c.models || [];
  return (
    <section className="live" aria-label="המודל החי">
      <div className="live-head">
        <span className="label">המודל החי · math-creator</span>
        <h2 className="section-head">{links.length ? 'מהכלל לגוף שאפשר לבנות.' : 'למושג הזה עוד אין גוף.'}</h2>
        <Rich as="p" className="muted">{links.length
          ? 'באפליקציה **מודל חי** המושג נבנה כמודל תלת־ממדי, עם התכונות שעוברות למרחב ומה שהמנוע בונה היום.'
          : 'באטלס של **מודל חי** אין עדיין מודל שנבנה מהמושג הזה.\nזה חור גלוי: הזדמנות למודל הבא.'}</Rich>
      </div>
      {links.length > 0 ? (
        <div className="live-grid">
          {links.map((l) => {
            const m = atlas[l.id];
            return (
              <article key={l.id} className="live-card" data-model={l.id}>
                <div className="live-meta">
                  <span className={`live-rel rel-${l.relation}`}>{REL[l.relation]}</span>
                  {m && <span className={`live-fit fit-${m.fit.level}`}>{FIT[m.fit.level]}</span>}
                </div>
                <h3 className="nm"><strong className="nm-he">{m?.name_he || l.id}</strong>{m && <span className="nm-latin" dir="ltr">{m.name}</span>}</h3>
                <Rich as="p" className="live-why">{`**הכלל שמחבר:** ${l.why}`}</Rich>
                {m && (
                  <>
                    <p className="live-plain">{m.plain.split(/(?<=\.)\s/)[0]}</p>
                    <dl className="live-traits">
                      {m.traits.slice(0, 3).map((t) => (
                        <div key={t.id}><dt>{t.label}</dt><dd>{t.space}</dd></div>
                      ))}
                    </dl>
                    {m.limits[0] && <p className="live-limit"><strong>מגבלה:</strong> {m.limits[0]}</p>}
                  </>
                )}
                <a className="press btn live-open" href={mcModelUrl(l.id)} target="_blank" rel="noreferrer">פתיחה במודל חי</a>
              </article>
            );
          })}
        </div>
      ) : (
        <a className="press btn" href={`${MC_SITE}/#/learn`} target="_blank" rel="noreferrer">לאטלס המודלים</a>
      )}
    </section>
  );
}
