import { useState } from 'react';

// שרטוט חי לכל כלל: הנתונים על השרטוט עצמו, והשרטוט משתנה איתם.
const INK = 'var(--ink)', MUTE = 'var(--ink-mute)';

function Golden() {
  const [n, setN] = useState(6);
  const phi = (1 + Math.sqrt(5)) / 2;
  // מלבן זהב שמתחלק שוב ושוב לריבוע ולמלבן זהב קטן יותר
  const squares: { x: number; y: number; s: number; dir: number }[] = [];
  let x = 0, y = 0, w = 300, h = 300 / phi;
  for (let i = 0; i < n; i++) {
    const dir = i % 4;
    if (dir === 0) { squares.push({ x, y, s: h, dir }); x += h; w -= h; }
    else if (dir === 1) { squares.push({ x, y, s: w, dir }); y += w; h -= w; }
    else if (dir === 2) { squares.push({ x: x + w - h, y, s: h, dir }); w -= h; }
    else { squares.push({ x, y: y + h - w, s: w, dir }); h -= w; }
  }
  // רבע עיגול בכל ריבוע, כך שהקשתות מתחברות לספירלה אחת רציפה
  const arc = (q: (typeof squares)[number]) => {
    const { x, y, s, dir } = q;
    if (dir === 0) return `M${x},${y + s} A${s},${s} 0 0 1 ${x + s},${y}`;
    if (dir === 1) return `M${x},${y} A${s},${s} 0 0 1 ${x + s},${y + s}`;
    if (dir === 2) return `M${x + s},${y} A${s},${s} 0 0 1 ${x},${y + s}`;
    return `M${x + s},${y + s} A${s},${s} 0 0 1 ${x},${y}`;
  };
  return (
    <figure className="dg">
      <svg viewBox="-4 -4 308 194" style={{ direction: 'ltr' }} role="img" aria-label="מלבן זהב שמתחלק לריבוע ולמלבן זהב קטן">
        <rect x="0" y="0" width="300" height={300 / phi} fill="var(--sheet)" stroke={INK} strokeWidth="1.5" />
        {squares.map((q, i) => <rect key={i} x={q.x} y={q.y} width={q.s} height={q.s} fill="var(--blueprint)" fillOpacity={0.06 + i * 0.05} stroke={INK} strokeWidth="1" />)}
        {squares.map((q, i) => <path key={'a' + i} d={arc(q)} fill="none" stroke="var(--phi)" strokeWidth="2.5" />)}
        <text x="150" y={300 / phi + 14} className="dg-t" textAnchor="middle">1.618 : 1</text>
      </svg>
      <div className="dg-ctl">
        <span className="label">חלוקות</span>
        <input type="range" min={1} max={9} value={n} onChange={(e) => setN(+e.target.value)} aria-label="מספר חלוקות" />
        <bdi className="num">{n}</bdi>
      </div>
      <figcaption>כל ריבוע שמורידים משאיר <strong>מלבן זהב</strong> קטן יותר.</figcaption>
    </figure>
  );
}

function Prime() {
  const [max, setMax] = useState(60);
  const isP = (k: number) => { if (k < 2) return false; for (let d = 2; d * d <= k; d++) if (k % d === 0) return false; return true; };
  const cols = 10;
  const count = Array.from({ length: max }, (_, i) => i + 1).filter(isP).length;
  return (
    <figure className="dg">
      <svg viewBox={`0 0 300 ${Math.ceil(max / cols) * 30}`} style={{ direction: 'ltr' }} role="img" aria-label={`נפה של ארטוסתנס עד ${max}`}>
        {Array.from({ length: max }, (_, i) => i + 1).map((k) => {
          const x = ((k - 1) % cols) * 30, y = Math.floor((k - 1) / cols) * 30, p = isP(k);
          return (
            <g key={k}>
              <rect x={x + 1} y={y + 1} width="28" height="28" fill={p ? 'var(--blueprint)' : 'var(--sheet)'} stroke="var(--rule)" />
              <text x={x + 15} y={y + 19} textAnchor="middle" className="dg-n" fill={p ? '#fff' : MUTE}>{k}</text>
            </g>
          );
        })}
      </svg>
      <div className="dg-ctl">
        <span className="label">עד</span>
        <input type="range" min={20} max={100} step={10} value={max} onChange={(e) => setMax(+e.target.value)} aria-label="טווח המספרים" />
        <bdi className="num">{max}</bdi>
      </div>
      <figcaption>עד <bdi className="num">{max}</bdi> יש <strong><bdi className="num">{count}</bdi> ראשוניים</strong>, בכחול. נפת ארטוסתנס Eratosthenes.</figcaption>
    </figure>
  );
}

function Integral() {
  const [n, setN] = useState(6);
  const f = (x: number) => 20 + 110 * Math.sin((x / 300) * Math.PI * 0.9) ** 1.4;
  const dx = 300 / n;
  let sum = 0;
  const bars = Array.from({ length: n }, (_, i) => { const h = f(i * dx); /* סכום שמאלי: המדרגות נראות, והסטייה קטנה עם הצעד */ sum += h * dx; return { x: i * dx, h }; });
  let exact = 0; for (let i = 0; i < 600; i++) exact += f(i * 0.5 + 0.25) * 0.5;
  const err = Math.abs(sum - exact) / exact * 100;
  const path = Array.from({ length: 61 }, (_, i) => `${i ? 'L' : 'M'}${i * 5},${150 - f(i * 5)}`).join(' ');
  return (
    <figure className="dg">
      <svg viewBox="-4 -4 308 168" style={{ direction: 'ltr' }} role="img" aria-label={`סכום רימן עם ${n} מלבנים`}>
        {bars.map((b, i) => <rect key={i} x={b.x} y={150 - b.h} width={dx} height={b.h} fill="var(--patina)" fillOpacity={0.22} stroke="var(--patina)" strokeWidth="1" />)}
        <path d={path} fill="none" stroke={INK} strokeWidth="2" />
        <line x1="0" y1="150" x2="300" y2="150" stroke={INK} />
      </svg>
      <div className="dg-ctl">
        <span className="label">מלבנים</span>
        <input type="range" min={3} max={60} value={n} onChange={(e) => setN(+e.target.value)} aria-label="מספר מלבנים" />
        <bdi className="num">{n}</bdi>
      </div>
      <figcaption>עם <bdi className="num">{n}</bdi> מלבנים הסטייה מהשטח היא <strong><bdi className="num">{err.toFixed(1)}%</bdi></strong>. ככל שהצעד קטן, המדרגות נעלמות.</figcaption>
    </figure>
  );
}

function Entropy() {
  const [t, setT] = useState(30);
  const rnd = (i: number) => { const s = Math.sin(i * 91.7 + 17.3) * 43758.5453; return s - Math.floor(s); };
  const pts = Array.from({ length: 64 }, (_, i) => {
    const gx = 20 + (i % 8) * 14, gy = 30 + Math.floor(i / 8) * 14;
    const k = t / 100;
    return { x: gx + (rnd(i) * 280 - (gx - 10)) * k * (0.6 + rnd(i + 3) * 0.4), y: gy + (rnd(i + 99) * 130 - (gy - 15)) * k * (0.6 + rnd(i + 7) * 0.4) };
  });
  return (
    <figure className="dg">
      <svg viewBox="0 0 300 160" style={{ direction: 'ltr' }} role="img" aria-label={`פיזור חלקיקים אחרי ${t} יחידות זמן`}>
        <rect x="10" y="20" width="118" height="118" fill="none" stroke="var(--rule)" strokeDasharray="4 3" />
        {pts.map((p, i) => <rect key={i} x={p.x} y={p.y} width="8" height="8" fill="var(--rust)" fillOpacity={0.85 - (t / 100) * 0.35} />)}
      </svg>
      <div className="dg-ctl">
        <span className="label">זמן</span>
        <input type="range" min={0} max={100} value={t} onChange={(e) => setT(+e.target.value)} aria-label="זמן" />
        <bdi className="num">{t}</bdi>
      </div>
      <figcaption>בזמן <bdi className="num">0</bdi> הכול בתוך הריבוע. ככל שהזמן עובר, <strong>הסדר מתפזר</strong>, ולא חוזר מעצמו.</figcaption>
    </figure>
  );
}

function Mobius() {
  const [twist, setTwist] = useState(1);
  const R = 70, W = 22, N = 90;
  const P = (u: number, v: number) => {
    const x = (R + v * Math.cos((twist * u) / 2)) * Math.cos(u), y = (R + v * Math.cos((twist * u) / 2)) * Math.sin(u), z = v * Math.sin((twist * u) / 2);
    return [150 + x, 80 + y * 0.42 - z * 1.1, y] as const;
  };
  const quads = Array.from({ length: N }, (_, i) => {
    const u0 = (i / N) * Math.PI * 2, u1 = ((i + 1) / N) * Math.PI * 2;
    const p = [P(u0, -W), P(u1, -W), P(u1, W), P(u0, W)];
    return { p, d: p.reduce((a, q) => a + q[2], 0), side: Math.cos((twist * (u0 + u1)) / 4) };
  }).sort((a, b) => a.d - b.d);
  return (
    <figure className="dg">
      <svg viewBox="0 0 300 160" style={{ direction: 'ltr' }} role="img" aria-label={twist === 1 ? 'רצועת מביוס' : 'טבעת רגילה'}>
        {quads.map((q, i) => <polygon key={i} points={q.p.map((x) => `${x[0].toFixed(1)},${x[1].toFixed(1)}`).join(' ')} fill="var(--patina)" fillOpacity={0.25 + Math.abs(q.side) * 0.55} stroke="var(--patina)" strokeWidth="0.5" />)}
      </svg>
      <div className="dg-ctl">
        <span className="label">חצאי סיבוב</span>
        <button type="button" className={`chip ${twist === 0 ? 'is-on' : ''}`} onClick={() => setTwist(0)}>0</button>
        <button type="button" className={`chip ${twist === 1 ? 'is-on' : ''}`} onClick={() => setTwist(1)}>1</button>
      </div>
      <figcaption>{twist === 1 ? <>חצי סיבוב אחד: <strong>צד אחד ושפה אחת</strong>.</> : <>בלי סיבוב: טבעת עם <strong>שני צדדים</strong> ו<strong>שתי שפות</strong>.</>}</figcaption>
    </figure>
  );
}

function Oxymoron() {
  const [lift, setLift] = useState(50);
  const y = 96 - lift * 0.7;
  return (
    <figure className="dg">
      <svg viewBox="0 0 300 160" style={{ direction: 'ltr' }} role="img" aria-label="גוש כבד שמרחף מעל מים">
        <rect x="0" y="132" width="300" height="28" fill="var(--blueprint)" fillOpacity=".15" />
        {[80, 220].map((x) => <line key={x} x1={x} y1={y + 46} x2={x} y2="132" stroke={INK} strokeWidth="1" strokeOpacity=".5" />)}
        <rect x="60" y={y} width="180" height="46" fill="var(--ink)" />
        <rect x="60" y={y + 46} width="180" height="5" fill="var(--rust)" fillOpacity=".6" />
        <text x="150" y={y + 28} textAnchor="middle" className="dg-t" style={{ fill: '#fff' }}>כבד</text>
        <text x="150" y="148" textAnchor="middle" className="dg-t">שקט</text>
      </svg>
      <div className="dg-ctl">
        <span className="label">ריחוף</span>
        <input type="range" min={0} max={100} value={lift} onChange={(e) => setLift(+e.target.value)} aria-label="גובה הריחוף" />
        <bdi className="num">{lift}</bdi>
      </div>
      <figcaption>ככל שהגוש <strong>הכבד</strong> מרחף גבוה, הניגוד חזק יותר. העמודים הדקים הם מה שהופך אותו לאפשרי.</figcaption>
    </figure>
  );
}

export default function Diagram({ slug }: { slug: string }) {
  switch (slug) {
    case 'golden-ratio': return <Golden />;
    case 'prime': return <Prime />;
    case 'integral': return <Integral />;
    case 'entropy': return <Entropy />;
    case 'mobius': return <Mobius />;
    case 'oxymoron': return <Oxymoron />;
  }
  return null;
}
