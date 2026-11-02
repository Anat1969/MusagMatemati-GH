import { useEffect, useRef, useState } from 'react';
import { go, href, Route } from '../lib/route';
import AIMenu from './AIMenu';
import Logo from './Logo';

const TABS = [
  { page: 'home', label: 'בית' },
  { page: 'magazine', label: 'מגזין' },
  { page: 'lab', label: 'מחולל' },
];

// סרגל עליון קבוע: שם האפליקציה לבית, ניווט תוכן, חיפוש קבוע עם איקס, וכפתור לוגו יחיד.
export default function TopBar({ route }: { route: Route }) {
  const [q, setQ] = useState(route.params.q || '');
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { if (route.page === 'magazine') setQ(route.params.q || ''); }, [route.page, route.params.q]);

  const submit = (v: string) => {
    setQ(v);
    go('magazine', undefined, { f: route.page === 'magazine' ? route.params.f : undefined, q: v.trim() || undefined });
  };
  const current = route.page === 'c' ? 'magazine' : route.page;

  return (
    <header className="topbar">
      <div className="topbar-in">
        <a className="brand" href={href('home')} aria-label="מושג מתמטי, לדף הבית">
          <Logo size={28} />
          <span className="brand-name">מושג מתמטי</span>
        </a>
        <nav className="tabs" aria-label="ניווט">
          {TABS.map((t) => (
            <a key={t.page} className="tab" href={href(t.page)} aria-current={current === t.page ? 'page' : undefined}>{t.label}</a>
          ))}
        </nav>
        <div className="search" role="search">
          <input
            ref={input}
            className="search-field"
            type="search"
            aria-label="חיפוש מושג, בניין או מקום"
            placeholder="חיפוש מושג, בניין, מקום"
            value={q}
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) => submit(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Escape') submit(''); }}
          />
          <button type="button" className="search-x" aria-label="ניקוי חיפוש" onClick={() => { submit(''); input.current?.focus(); }}>×</button>
        </div>
        <AIMenu />
      </div>
    </header>
  );
}
