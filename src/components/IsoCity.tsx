import { useMemo } from 'react';
import { CONCEPTS, FORCES } from '../lib/concepts';
import { go } from '../lib/route';

// עיר המושגים: שישה בניינים בהטלה איזומטרית ב-SVG, אחד לכל מושג.
// הצורה של כל בניין נגזרת מהכלל המתמטי שלו. שלושה רובעים: סדר, רצף, שינוי.

type P3 = [number, number, number];
type Face = { pts: P3[]; tone: number; depth: number };

const S = 15; // קנה מידה
const C = Math.cos(Math.PI / 6), Sn = Math.sin(Math.PI / 6);
const proj = ([x, y, z]: P3) => [(x - y) * C * S, (x + y) * Sn * S - z * S] as const;
const poly = (pts: P3[]) => pts.map((p) => proj(p).map((n) => n.toFixed(1)).join(',')).join(' ');

const HEX: Record<string, string> = { order: '#24497A', flow: '#2E7D74', change: '#B5572A' };
function shade(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.round(k >= 0 ? c + (255 - c) * k : c * (1 + k));
  const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
  return `rgb(${r},${g},${b})`;
}

function box(x: number, y: number, z: number, w: number, d: number, h: number): Face[] {
  const t = z + h;
  const depth = x + w / 2 + y + d / 2 + z * 0.5;
  return [
    { pts: [[x + w, y, z], [x + w, y + d, z], [x + w, y + d, t], [x + w, y, t]], tone: -0.18, depth },
    { pts: [[x, y + d, z], [x + w, y + d, z], [x + w, y + d, t], [x, y + d, t]], tone: -0.38, depth },
    { pts: [[x, y, t], [x + w, y, t], [x + w, y + d, t], [x, y + d, t]], tone: 0.28, depth },
  ];
}

// פסאודו־אקראי קבוע, כדי שהאנטרופיה תיראה אותו דבר בכל טעינה
const rnd = (i: number) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

function shapes(slug: string): Face[] {
  switch (slug) {
    case 'golden-ratio': // מלבני זהב: רוחב וגובה ביחס φ
      return [...box(0.4, 0.8, 0, 3.24, 3.6, 2), ...box(3.64, 0.8, 0, 2, 3.6, 3.24), ...box(3.64, 0.8, 3.24, 1.24, 2, 0.76)];
    case 'prime': // מונולית אחד שאי אפשר לחלק, וכדור־קובייה קטן
      return [...box(1.6, 1.2, 0, 2.2, 2.2, 6.2), ...box(4.2, 4, 0, 1.3, 1.3, 1.3), ...box(0.6, 4.2, 0, 0.7, 0.7, 0.7)];
    case 'integral': { // טרסות: סכום שכבות דקות
      const f: Face[] = [];
      for (let i = 0; i < 7; i++) f.push(...box(0.3 + i * 0.36, 0.3 + i * 0.36, i * 0.55, 5.4 - i * 0.72, 5.4 - i * 0.72, 0.55));
      return f;
    }
    case 'entropy': { // רשת מסודרת שמתפרקת לכיוון פינה אחת
      const f: Face[] = [];
      let k = 0;
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
        const chaos = (i + j) / 6;
        const jx = (rnd(k) - 0.5) * chaos * 1.2, jy = (rnd(k + 50) - 0.5) * chaos * 1.2;
        const h = Math.max(0.25, 2.6 * (1 - chaos * rnd(k + 9) * 1.1));
        f.push(...box(0.3 + i * 1.4 + jx, 0.3 + j * 1.4 + jy, 0, 1, 1, h));
        k++;
      }
      return f;
    }
    case 'oxymoron': { // גוש כבד שמרחף על עמודים דקים מעל מים
      const f: Face[] = [];
      [[1, 1], [4.2, 1], [1, 4.2], [4.2, 4.2]].forEach(([x, y]) => f.push(...box(x, y, 0, 0.14, 0.14, 1.9).map((q) => ({ ...q, tone: q.tone + 0.45 }))));
      f.push(...box(0.6, 0.6, 1.9, 4.2, 4.2, 2.3));
      return f;
    }
    case 'mobius': { // רצועה עם חצי סיבוב
      const f: Face[] = [];
      const R = 2.1, W = 0.75, cx = 3, cy = 3, z0 = 2.2, N = 56;
      const P = (u: number, v: number): P3 => [cx + (R + v * Math.cos(u / 2)) * Math.cos(u), cy + (R + v * Math.cos(u / 2)) * Math.sin(u), z0 + v * Math.sin(u / 2) * 1.6];
      for (let i = 0; i < N; i++) {
        const u0 = (i / N) * Math.PI * 2, u1 = ((i + 1) / N) * Math.PI * 2;
        const pts: P3[] = [P(u0, -W), P(u1, -W), P(u1, W), P(u0, W)];
        const m = pts.reduce((a, p) => [a[0] + p[0] / 4, a[1] + p[1] / 4, a[2] + p[2] / 4], [0, 0, 0]);
        // גוון לפי כיוון הנורמל ביחס לאור: משטח עם צד אחד, ולכן ערך מוחלט
        const a = [pts[1][0] - pts[0][0], pts[1][1] - pts[0][1], pts[1][2] - pts[0][2]];
        const b = [pts[3][0] - pts[0][0], pts[3][1] - pts[0][1], pts[3][2] - pts[0][2]];
        const n = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
        const len = Math.hypot(n[0], n[1], n[2]) || 1;
        const light = Math.abs((n[0] * 0.3 + n[1] * 0.2 + n[2] * 0.93) / len);
        f.push({ pts, tone: -0.45 + light * 0.75, depth: m[0] + m[1] + m[2] * 0.5 });
      }
      f.push(...box(2.6, 2.6, 0, 0.8, 0.8, 1.4).map((q) => ({ ...q, depth: -10 })));
      return f;
    }
  }
  return [];
}

const LOT = 7.6;
const lotOf = (i: number) => {
  // עמודה לכל כוח, שני מושגים בכל עמודה
  const c = CONCEPTS[i];
  const col = 2 - FORCES.findIndex((f) => f.id === c.force); // סדר מימין, כמו קריאה בעברית
  const row = CONCEPTS.filter((x, j) => x.force === c.force && j < i).length;
  return [col * LOT, row * LOT] as const;
};

export default function IsoCity({ active, setActive }: { active: string | null; setActive: (s: string | null) => void }) {
  const items = useMemo(() => CONCEPTS.map((c, i) => {
    const [ox, oy] = lotOf(i);
    const faces = shapes(c.slug)
      .map((f) => ({ ...f, pts: f.pts.map(([x, y, z]) => [x + ox, y + oy, z] as P3), depth: f.depth + ox + oy }))
      .sort((a, b) => a.depth - b.depth);
    const pts2 = faces.flatMap((f) => f.pts.map(proj));
    const top = Math.min(...pts2.map((p) => p[1]));
    const cx = (Math.min(...pts2.map((p) => p[0])) + Math.max(...pts2.map((p) => p[0]))) / 2;
    const label = [cx, top - 26] as const;
    return { c, faces, ox, oy, label, depth: ox + oy };
  }).sort((a, b) => a.depth - b.depth), []);

  const W = 3 * LOT, H = 2 * LOT;
  // גבולות אמיתיים של כל מה שמצויר, כדי שלא יישאר שטח מת
  const all = items.flatMap((it) => it.faces.flatMap((f) => f.pts.map(proj)));
  const xs = all.map((p) => p[0]), ys = all.map((p) => p[1]);
  const [lx, ly] = proj([0, H, 0]), [rx] = proj([W, 0, 0]), [, by] = proj([W, H, 0]);
  const minX = Math.min(...xs, lx) - 40, maxX = Math.max(...xs, rx) + 40, minY = Math.min(...ys) - 34, maxY = Math.max(...ys, by) + 30;
  const vb = `${minX.toFixed(0)} ${minY.toFixed(0)} ${(maxX - minX).toFixed(0)} ${(maxY - minY).toFixed(0)}`;

  return (
    <svg className="iso" viewBox={vb} role="img" aria-label="עיר המושגים: שישה בניינים בשלושה רובעים, סדר, רצף ושינוי" style={{ direction: 'ltr' }}>
      {/* קרקע: שלושה רובעים */}
      {FORCES.map((f, i) => { const col = 2 - i; return (
        <g key={f.id} className="iso-district">
          <polygon points={poly([[col * LOT + 0.1, 0.1, 0], [col * LOT + LOT - 0.3, 0.1, 0], [col * LOT + LOT - 0.3, H - 0.3, 0], [col * LOT + 0.1, H - 0.3, 0]])} fill={shade(HEX[f.id], 0.88)} stroke={shade(HEX[f.id], 0.5)} strokeWidth="1" />
          {Array.from({ length: 7 }).map((_, k) => (
            <line key={k} className="iso-grid" {...(() => { const a = proj([col * LOT + 0.1 + k * 1.2, 0.1, 0]); const b = proj([col * LOT + 0.1 + k * 1.2, H - 0.3, 0]); return { x1: a[0], y1: a[1], x2: b[0], y2: b[1] }; })()} />
          ))}
        </g>
      ); })}
      {items.map(({ c, faces, label }, n) => {
        const dim = active && active !== c.slug;
        return (
          <g
            key={c.slug}
            className={`iso-bldg ${active === c.slug ? 'is-active' : ''}`}
            style={{ opacity: dim ? 0.28 : 1, animationDelay: `${n * 0.12}s` }}
            onMouseEnter={() => setActive(c.slug)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(c.slug)}
            onBlur={() => setActive(null)}
            onClick={() => go('c', c.slug)}
            onKeyDown={(e) => { if (e.key === 'Enter') go('c', c.slug); }}
            tabIndex={0}
            role="link"
            aria-label={`${c.name}: ${c.architecturalName}`}
          >
            {faces.map((f, i) => (
              <polygon key={i} points={poly(f.pts)} fill={shade(HEX[c.force], f.tone)} stroke={shade(HEX[c.force], -0.55)} strokeWidth="0.6" strokeLinejoin="round" />
            ))}
          </g>
        );
      })}
      {items.map(({ c, label }) => (
        <text key={c.slug} x={label[0]} y={label[1] + 18} className={`iso-label ${active === c.slug ? 'on' : ''}`} textAnchor="middle" onClick={() => go('c', c.slug)}>{c.name}</text>
      ))}

    </svg>
  );
}
