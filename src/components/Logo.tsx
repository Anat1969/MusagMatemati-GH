// אייקון האפליקציה: מלבן זהב עם רבע עיגול, משרטוט לבניין. בלי טקסט.
export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size * 1.618} height={size} viewBox="0 0 161.8 100" aria-hidden="true" className="logo-mark">
      <rect x="1.5" y="1.5" width="158.8" height="97" fill="var(--sheet)" stroke="var(--ink)" strokeWidth="3" />
      <rect x="1.5" y="1.5" width="97" height="97" fill="var(--blueprint)" />
      <line x1="98.5" y1="1.5" x2="98.5" y2="98.5" stroke="var(--ink)" strokeWidth="3" />
      <path d="M98.5 98.5 A97 97 0 0 0 1.5 1.5" fill="none" stroke="var(--phi)" strokeWidth="6" />
      <rect x="98.5" y="1.5" width="61.8" height="61.8" fill="var(--phi)" opacity=".25" />
    </svg>
  );
}
