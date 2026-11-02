import Rich from '../components/Rich';
import { CONCEPTS, FORCES, ForceId, forceOf } from '../lib/concepts';
import { go, href, Route } from '../lib/route';
import { useGenerated } from '../lib/store';

// חיפוש עברי: התאמה בתחילת מילה, גם אחרי אותיות שימוש. מילה עד 3 אותיות חייבת להיות שלמה.
const PREFIX = 'הובכלמש';
export function matches(text: string, q: string) {
  const query = q.trim().toLowerCase();
  if (!query) return true;
  const words = text.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  return query.split(/\s+/).every((t) => words.some((w) => {
    const forms = [w, ...(PREFIX.includes(w[0]) ? [w.slice(1)] : []), ...(PREFIX.includes(w[0]) && PREFIX.includes(w[1]) ? [w.slice(2)] : [])];
    return forms.some((f) => (t.length <= 3 ? f === t : f.startsWith(t)));
  }));
}

type Filter = ForceId | 'gen';

export default function Magazine({ route }: { route: Route }) {
  const generated = useGenerated();
  const q = route.params.q || '';
  const sel = (route.params.f || '').split(',').filter(Boolean) as Filter[];
  const setSel = (next: Filter[]) => go('magazine', undefined, { f: next.join(',') || undefined, q: q || undefined });

  const concepts = CONCEPTS.filter((c) => matches([c.name, c.latin, c.architecturalName, c.precedent.name.he, c.precedent.name.latin, c.city.name.he, c.city.name.latin, c.precedent.by].join(' '), q));
  const gens = generated.filter((g) => matches([g.concept, g.dimensions.architecturalName].join(' '), q));
  const count = (f: Filter) => (f === 'gen' ? gens.length : concepts.filter((c) => c.force === f).length);

  const showC = concepts.filter((c) => !sel.length || sel.includes(c.force));
  const showG = !sel.length || sel.includes('gen') ? gens : [];
  const filters: { id: Filter; name: string }[] = [...FORCES.map((f) => ({ id: f.id as Filter, name: f.name })), { id: 'gen', name: 'מהמחולל' }];

  return (
    <main className="page page-wide">
      <div className="crumbs"><a href={href('home')}>בית</a> / מגזין</div>
      <h1 className="page-title">שישה מושגים, שישה בניינים.</h1>
      <Rich as="p" className="page-sub">{'כל כתבה: **כלל**, **שרטוט חי**, **תקדים**, **דוגמה מהעיר**, **הייקו** ו**פוסט**.\nלחיצה מחליפה את הסינון, והפלוס מוסיף.'}</Rich>

      <div className="chooser" role="toolbar" aria-label="סינון לפי כוח">
        <button type="button" className={`chip ${!sel.length ? 'is-on' : ''}`} onClick={() => setSel([])}>
          הכול <bdi className="num chip-n">{concepts.length + gens.length}</bdi>
        </button>
        {filters.map((f) => {
          const on = sel.includes(f.id);
          return (
            <span key={f.id} className="chip-wrap">
              <button
                type="button"
                className={`chip ${on ? 'is-on' : ''}`}
                aria-pressed={on}
                onClick={() => setSel(on && sel.length === 1 ? [] : [f.id])}
              >
                {f.name} <bdi className="num chip-n">{count(f.id)}</bdi>
              </button>
              {sel.length > 0 && (
                <button type="button" className="chip-plus" aria-label={on ? `הסרת ${f.name}` : `הוספת ${f.name}`} onClick={() => setSel(on ? sel.filter((x) => x !== f.id) : [...sel, f.id])}>
                  {on ? '−' : '+'}
                </button>
              )}
            </span>
          );
        })}
      </div>
      {q && <p className="search-note">חיפוש: <strong>{q}</strong>. <bdi className="num">{showC.length + showG.length}</bdi> תוצאות.</p>}

      {showC.length + showG.length === 0 ? (
        <div className="empty tone tone-neutral">
          <h4>לא נמצא מושג.</h4>
          <p>נסו מילה אחרת, נקו את החיפוש באיקס, או צרו את המושג ב<a href={href('lab', undefined, { q })}>מחולל</a>.</p>
        </div>
      ) : (
        <div className="mag-grid">
          {showC.map((c, i) => {
            const f = forceOf(c.force);
            return (
              <a key={c.slug} href={href('c', c.slug)} className={`mag-card press rise ${i === 0 && !sel.length && !q ? 'mag-lead' : ''}`} style={{ ['--fc' as any]: f.color, animationDelay: `${i * 0.05}s` }}>
                <div className="mag-img"><img src={c.images.exterior} alt={c.architecturalName} loading="lazy" /></div>
                <div className="mag-body">
                  <div className="mag-meta"><span className="mag-force">{f.name}</span><span className="mag-latin" dir="ltr">{c.latin}</span></div>
                  <h2 className="mag-title">{c.name}</h2>
                  <div className="mag-arch">{c.architecturalName}</div>
                  <Rich as="p" className="mag-insight">{c.insightLine}</Rich>
                </div>
              </a>
            );
          })}
          {showG.map((g) => (
            <a key={g.id} href={href('c', g.id)} className="mag-card press rise mag-gen">
              <div className="mag-img">{g.images.exterior ? <img src={g.images.exterior} alt={g.dimensions.architecturalName} loading="lazy" /> : <div className="mag-noimg">אין תמונה עדיין</div>}</div>
              <div className="mag-body">
                <div className="mag-meta"><span className="mag-force gen">מהמחולל</span></div>
                <h2 className="mag-title">{g.concept}</h2>
                <div className="mag-arch">{g.dimensions.architecturalName}</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
