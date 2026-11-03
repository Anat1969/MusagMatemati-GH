import { mcModelUrl } from '../lib/bridge';
import { findModels, useModelChai } from '../lib/modelchai';

// מושג חדש מהמחולל: אם יש לו מודל באטלס של "מודל חי", מציעים אותו מיד, עם מה שהמנוע בונה היום.
const FIT = { full: 'נבנה במלואו', partial: 'נבנה בקירוב', none: 'עוד לא נבנה' } as const;

export default function LiveSuggest({ concept }: { concept: string }) {
  const found = findModels(useModelChai(), concept);
  if (!found.length) return null;
  return (
    <section className="live-suggest" aria-label="מודל חי מתאים">
      <span className="label">יש לזה מודל חי</span>
      {found.map((m) => (
        <a key={m.id} className="live-suggest-row press" href={mcModelUrl(m.id)} target="_blank" rel="noreferrer" data-model={m.id}>
          <span className="nm"><strong className="nm-he">{m.name_he}</strong><span className="nm-latin" dir="ltr">{m.name}</span></span>
          <span className={`live-fit fit-${m.fit.level}`}>{FIT[m.fit.level]}</span>
          <span className="live-suggest-plain">{m.plain.split(/(?<=\.)\s/)[0]}</span>
        </a>
      ))}
    </section>
  );
}
