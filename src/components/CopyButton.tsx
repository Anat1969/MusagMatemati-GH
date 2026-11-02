import { useState } from 'react';

export default function CopyButton({ text, label = 'העתקה', className = '' }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); } catch {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch { /* ignore */ } t.remove();
    }
    setDone(true); setTimeout(() => setDone(false), 1600);
  };
  return (
    <button type="button" className={`press btn-sm ${className}`} onClick={copy} aria-live="polite">
      {done ? 'הועתק' : label}
    </button>
  );
}
