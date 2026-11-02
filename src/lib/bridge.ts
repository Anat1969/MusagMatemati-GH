// הגשר בין "מושג מתמטי" ל"מודל חי" (math-creator.vercel.app).
// כל אפליקציה מפרסמת bridge.json שנבנה ממקור הנתונים שלה, והשנייה קוראת אותו. אין העתקת תוכן.
import { CONCEPTS, forceOf } from './concepts';

export const SITE = 'https://musag-matemati-gh.vercel.app';
export const MC_SITE = 'https://math-creator.vercel.app';
export const mcModelUrl = (id: string) => `${MC_SITE}/#/learn?m=${encodeURIComponent(id)}`;

const plain = (t: string) => t.replace(/\*\*|==/g, '');
const named = (n: { he: string; latin?: string }) => ({ he: n.he, latin: n.latin || '' });

/** מה ש"מושג מתמטי" מפרסם: ידע עם מקור לכל מושג, והמודלים שהוא מתחבר אליהם. */
export function buildBridge() {
  return {
    app: 'musag-matemati',
    version: 1,
    url: SITE,
    concepts: CONCEPTS.map((c) => ({
      slug: c.slug,
      name: c.name,
      latin: c.latin,
      force: { id: c.force, name: forceOf(c.force).name, question: forceOf(c.force).question },
      architecturalName: c.architecturalName,
      url: `${SITE}/#/c/${c.slug}`,
      image: `${SITE}/${c.images.exterior}`,
      insight: plain(c.insightLine),
      insightText: plain(c.insightText),
      rule: { text: plain(c.rule.text), formula: c.rule.formula, source: c.rule.source },
      precedent: { name: named(c.precedent.name), by: c.precedent.by, year: c.precedent.year, text: plain(c.precedent.text), source: c.precedent.source },
      city: { name: named(c.city.name), text: plain(c.city.text) },
      quote: c.quote ? { text: c.quote.text, by: named(c.quote.by), work: c.quote.work, year: c.quote.year } : null,
      haiku: c.haiku,
      models: (c.models || []).map((m) => ({ ...m, why: plain(m.why) })),
    })),
  };
}

/** מה ש"מודל חי" מפרסם: מודל באטלס, עם התכונות שעוברות למרחב ומה שהמנוע בונה היום. */
export interface MCModel {
  id: string;
  name_he: string;
  name: string;
  family: string;
  plain: string;
  traits: { id: string; label: string; space: string }[];
  limits: string[];
  fit: { level: 'full' | 'partial' | 'none'; word: string; note: string };
  url: string;
}
