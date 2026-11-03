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
