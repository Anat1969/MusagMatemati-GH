import { Fragment, ReactNode } from 'react';

// טקסט עשיר: **מודגש**, ==תובנה== (מרקר צהוב), ומספרים מודגשים אוטומטית בכיוון LTR מבודד.
// שבירת שורה (\n) הופכת לשורה חדשה: כל משפט בשורה משלו.
const TOKEN = /(\*\*[^*]+\*\*|==[^=]+==)/g;
const NUM = /(\d[\d,]*(?:\.\d+)?%?)/g;

function Numbers({ text }: { text: string }) {
  return <>{text.split(NUM).map((part, i) => (i % 2 ? <bdi key={i} className="num">{part}</bdi> : <Fragment key={i}>{part}</Fragment>))}</>;
}

function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(TOKEN).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}><Numbers text={part.slice(2, -2)} /></strong>;
        if (part.startsWith('==') && part.endsWith('==')) return <mark key={i} className="insight"><Numbers text={part.slice(2, -2)} /></mark>;
        return <Numbers key={i} text={part} />;
      })}
    </>
  );
}

export default function Rich({ children, as: Tag = 'span', className }: { children: string; as?: any; className?: string }) {
  const lines = String(children).split('\n');
  return (
    <Tag className={className}>
      {lines.map((l, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          <Inline text={l} />
        </Fragment>
      ))}
    </Tag>
  );
}

// שם מקום או אדם: עברית מודגשת וגדולה, לועזית קטנה ובהירה מיד אחריה.
export function Name({ he, latin, as: Tag = 'span' }: { he: string; latin?: string; as?: any }): ReactNode {
  return (
    <Tag className="nm">
      <strong className="nm-he">{he}</strong>
      {latin && <span className="nm-latin" dir="ltr">{latin}</span>}
    </Tag>
  );
}

// מקור לכל טענה: קטן ואפור, בסוף המשפט.
export function Src({ label, href }: { label: string; href?: string }) {
  return href ? <a className="src" href={href} target="_blank" rel="noreferrer">{label}</a> : <span className="src">{label}</span>;
}
