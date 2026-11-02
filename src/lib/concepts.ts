// מקור הנתונים היחיד של האפליקציה. כל תצוגה נגזרת מכאן.
// כתיב Rich: **מודגש**, ==תובנה==. מספרים מודגשים אוטומטית.
// שישה מושגים, שלושה כוחות: איך מחלקים (סדר), איך מחברים (רצף), ואיך משתנים (שינוי).

export type ForceId = 'order' | 'flow' | 'change';

export interface Force {
  id: ForceId;
  name: string;
  question: string;
  line: string;
  color: string;
  wash: string;
}

export const FORCES: Force[] = [
  { id: 'order', name: 'סדר', question: 'איך מחלקים', line: 'חלוקה שיוצרת **יחס** ו**יסוד**.', color: 'var(--blueprint)', wash: 'var(--blueprint-wash)' },
  { id: 'flow', name: 'רצף', question: 'איך מחברים', line: 'חיבור שמבטל את **הגבול** בין חלקים.', color: 'var(--patina)', wash: 'var(--patina-wash)' },
  { id: 'change', name: 'שינוי', question: 'איך משתנים', line: 'מתח בין **סדר** ל**אי־סדר**, בזמן ובחומר.', color: 'var(--rust)', wash: 'var(--rust-wash)' },
];

export const forceOf = (id: ForceId) => FORCES.find((f) => f.id === id)!;

export interface Named { he: string; latin?: string }
export interface Source { label: string; href?: string }

export interface Concept {
  slug: string;
  id: string; // מזהה השורה בטבלת articles המקורית
  name: string;
  latin: string;
  force: ForceId;
  architecturalName: string;
  layout: 'full' | 'split' | 'strip';
  rule: { text: string; formula: string; source: Source };
  insightLine: string;
  insightText: string;
  works: string;
  fails: string;
  failsSource?: Source;
  precedent: { name: Named; by: string; year: string; text: string; source: Source };
  city: { name: Named; text: string };
  quote?: { text: string; original: string; by: Named; work: string; year: string };
  haiku: { lines: [string, string, string]; note: string };
  action: { think: string; do: string };
  post: string;
  links: { to: string; rule: string; insight: string; action: string }[];
  /** הגשר לאפליקציית "מודל חי" (math-creator): מודלים באטלס שלה. 'same' אותו מושג, 'near' מושג קרוב, עם הכלל שמחבר. */
  models?: { id: string; relation: 'same' | 'near'; why: string }[];
  images: { exterior: string; interior: string };
  videos: { exterior?: string; interior?: string };
  generated: { insight: string; proverb: string; interpretation: string };
  prompts: { exterior: string; interior: string };
  mj: { distill: string; prompt: string };
}

const MEDIA = 'https://zdeivlkaqrnsqvtzfypw.supabase.co/storage/v1/object/public/article-media';
const MJ = 'Documentary realism, Professional architecture photography, 1:1 --ar 1:1 --no text, words, writing, frame divisions';

export const CONCEPTS: Concept[] = [
  {
    slug: 'golden-ratio',
    id: '605fd0ce-885c-41ed-853c-f847e3fe9cd7',
    name: 'יחס הזהב',
    latin: 'Golden ratio · φ',
    force: 'order',
    architecturalName: 'מקדש הפרופורציה האלוהית',
    layout: 'full',
    rule: {
      text: 'קטע מחולק כך ש**השלם** ביחס ל**חלק הגדול** שווה לחלק הגדול ביחס ל**קטן**.',
      formula: 'φ = (1+√5)/2 ≈ 1.618',
      source: { label: 'אוקלידס Euclid, יסודות, ספר VI, הגדרה 3', href: 'https://mathcs.clarku.edu/~djoyce/elements/bookVI/defVI3.html' },
    },
    insightLine: '**פרופורציה** שחוזרת בכל קנה מידה.',
    insightText: 'מוסיפים ריבוע למלבן זהב, ומקבלים שוב **מלבן זהב**. אותו **יחס** מחזיק את הפרט ואת השלם.',
    works: 'קצב חזית, חלוקת חדר וגודל חלון נקראים כ**משפחה אחת**.',
    fails: '**מיתוס הפרתנון**: מדידות לא מאשרות שתוכנן לפי φ. נוסחה שמוצמדת בדיעבד אינה עיצוב.',
    failsSource: { label: 'George Markowsky, Misconceptions about the Golden Ratio, 1992', href: 'https://doi.org/10.2307/2686193' },
    precedent: {
      name: { he: 'יחידת המגורים במרסיי', latin: "Unité d'habitation, Marseille" },
      by: 'לה קורבוזיה Le Corbusier',
      year: '1952',
      text: 'כל המידות נגזרות מ**המודולור**: סולם מידות שנבנה מגובה אדם ומ-**φ**, ופורסם ב-1948.',
      source: { label: 'Le Modulor, 1948', href: 'https://en.wikipedia.org/wiki/Modulor' },
    },
    city: {
      name: { he: 'אשדוד', latin: 'Ashdod' },
      text: 'מדדו חלון בחזית שלידכם.\nיחס של **1.6** בין גובה לרוחב הוא מלבן זהב.\nיחס של **1** הוא ריבוע שקט.',
    },
    quote: {
      text: 'האדריכלות היא המשחק המלומד, המדויק והמפואר של נפחים המכונסים באור.',
      original: "L'architecture est le jeu savant, correct et magnifique des volumes assemblés sous la lumière.",
      by: { he: 'לה קורבוזיה', latin: 'Le Corbusier' },
      work: 'Vers une architecture',
      year: '1923',
    },
    haiku: { lines: ['ריבוע נוסף', 'והמלבן שוב שלם', 'צדף על החוף'], note: 'צמיחה שמוסיפה בלי לשנות צורה: כך גדל צדף, וכך גדל מלבן זהב.' },
    action: {
      think: 'איפה בבית שלכם יש חלוקה לא שוויונית שנראית נכונה?',
      do: 'שרטטו חזית עם 3 חלונות, פעם ברוחבים 1, 1.6 ו-2.6 ופעם ברוחב שווה. איזו חזית שקטה יותר?',
    },
    post: 'הפרתנון לא תוכנן לפי יחס הזהב.\nמדידות שפרסם ג׳ורג׳ מרקובסקי George Markowsky ב-1992 הראו שהטענה נשענת על מדידה סלקטיבית.\nובכל זאת, φ חי באדריכלות: לה קורבוזיה Le Corbusier בנה ממנו את המודולור ב-1948, ומדד בו כל דלת ומעקה ביחידת המגורים במרסיי.\nההבדל הוא **כוונה**.\nיחס שמוצמד בדיעבד הוא סיפור. יחס שמתכננים איתו הוא כלי.\nנסו מחר: מדדו חלון בחזית שלכם, ובדקו אם היחס קרוב ל-1.6 או ל-1.\nאיזה מהם מרגיש שקט יותר?',
    links: [
      { to: 'prime', rule: 'שניהם עונים על השאלה **איך מחלקים**.', insight: 'φ מתחלק לעצמו שוב ושוב, והראשוני מסרב להתחלק.', action: 'בחזית: φ לרוחב המפרשים, ומספר ראשוני של מפרשים כדי לקבל ציר מרכזי.' },
      { to: 'integral', rule: 'היחס בין מספרי פיבונאצ׳י עוקבים שואף ל-**φ**.', insight: 'יחס הזהב הוא גבול של צבירה, בדיוק כמו אינטגרל.', action: 'בנו סדרת חדרים בגדלים 1, 1, 2, 3, 5, 8 וראו איך היחס מתייצב.' },
    ],
    models: [
      { id: 'golden_spiral', relation: 'near', why: 'ספירלה שגדלה פי **φ** בכל רבע סיבוב: היחס הופך לצורה בתלת־ממד.' },
      { id: 'fibonacci', relation: 'near', why: 'היחס בין שני מספרים סמוכים בסדרה שואף ל-**φ**.' },
    ],
    images: { exterior: 'media/golden-ext.webp', interior: 'media/golden-int.webp' },
    videos: { exterior: `${MEDIA}/605fd0ce-885c-41ed-853c-f847e3fe9cd7/exterior-video-1782696490253.mp4` },
    generated: {
      insight: 'יחס הזהב, המוטבע עמוק בטבע ובאמנות, הוא מפתח להרמוניה אסתטית המושתתת על פרופורציות אינסופיות אך מאוזנות. באדריכלות, הוא אינו רק כלי חישוב אלא פילוסופיה של יופי המשלבת סדר קוסמי עם חוויה אנושית, ויוצרת מבנים המהדהדים תחושת שלמות טבעית. הוא משמש כקוד גנטי לעיצוב המעורר נוחות ויזואלית ותחושת נצחיות.',
      proverb: 'כאשר יחס נכון נשמר, גם קירות אילמים ישמיעו פזמון יופי.',
      interpretation: 'פתגם זה מדגיש את כוחו של יחס הזהב כעקרון מנחה באדריכלות, המעניק חן ושלמות למבנה. הוא מראה כיצד בחירה מדויקת בפרופורציות, בהשראת יחס הזהב, יכולה להפוך חומר גלם פשוט ליצירה אמנותית המעוררת התפעלות ותחושת הרמוניה עמוקה, כאילו המבנה כולו מזמר יופי.',
    },
    prompts: {
      exterior: 'A grand, harmonious architectural structure, subtly incorporating Golden Ratio principles into its facade and overall massing. Imagine a blend of classical Greek temple aesthetics with modern minimalist lines, creating a timeless and elegant design. The main entrance features a large golden spiral relief. Facade composed of smooth, light-colored stone and bronze accents, with carefully proportioned windows and columns. The building sits on a gentle hill overlooking a pristine landscape at sunset. photorealistic architectural visualization, dramatic lighting, ultra detailed',
      interior: 'An opulent yet serene interior space, a main hall or atrium, where every element adheres to the Golden Ratio for maximum aesthetic harmony. High ceilings with a subtle spiral motif in the center, guiding the eye towards a grand skylight. Walls are clad in polished marble and warm wood panels, divided into Golden Ratio segments. Furniture is minimalist and elegant, arranged in a way that respects the spatial proportions, with a large, inviting lounge area in the foreground. Soft, volumetric lighting streams in from strategically placed windows and the skylight, illuminating dust motes and creating a peaceful ambiance. photorealistic interior design, volumetric lighting, ultra detailed',
    },
    mj: {
      distill: 'חזית שבה כל חלק מחזיר את יחס השלם.',
      prompt: `מקדש של פרופורציה: חזית אבן גיר בהירה המחולקת למלבני זהב מקוננים, עמודים דקים בקצב של 1 ל-1.618, ספירלה מוטבעת בברונזה מעל הכניסה, גבעה נמוכה באור שקיעה רך, ${MJ}`,
    },
  },
  {
    slug: 'mobius',
    id: '27fa02c0-2586-483a-a425-2c58a2b70617',
    name: 'רצועת מביוס',
    latin: 'Möbius strip',
    force: 'flow',
    architecturalName: 'היכל המשטח היחידאי',
    layout: 'split',
    rule: {
      text: 'משטח עם **צד אחד** ו**שפה אחת**. מקבלים אותו כשמסובבים רצועה ב**חצי סיבוב** ומחברים את קצותיה.',
      formula: 'חצי סיבוב ← צד אחד, שפה אחת',
      source: { label: 'אוגוסט פרדיננד מביוס August F. Möbius ויוהאן בנדיקט ליסטינג J. B. Listing, באופן בלתי תלוי, 1858', href: 'https://en.wikipedia.org/wiki/M%C3%B6bius_strip' },
    },
    insightLine: '**פנים וחוץ** הם אותו משטח.',
    insightText: 'מי שהולך לאורך הרצועה חוזר לנקודת המוצא הפוך, בלי לחצות אף **שפה**.',
    works: 'מסלול רציף בלי מסדרון מת: **רמפה** שהופכת לרצפה, ורצפה שהופכת לתקרה.',
    fails: 'רצף בלי עצירה **מבלבל**. בלי נקודות נחיתה ושילוט, המבקר לא יודע איפה הוא.',
    precedent: {
      name: { he: 'בית מביוס', latin: 'Möbius House, Het Gooi' },
      by: 'UNStudio, בן ואן ברקל Ben van Berkel וקרוליין בוס Caroline Bos',
      year: '1998',
      text: 'מסלול היום ומסלול העבודה נכרכים זה בזה כמו רצועה, ו**בטון** ו**זכוכית** מחליפים צדדים לאורכם.',
      source: { label: 'UNStudio, Möbius House', href: 'https://www.unstudio.com/en/page/12102/m%C3%B6bius-house' },
    },
    city: {
      name: { he: 'חניון קומות בעיר', latin: 'Parking ramp' },
      text: 'רמפה שמחברת קומה לקומה היא **רצף אחד**.\nשימו לב איפה היא מסמנת לכם עצירה, ואיפה אתם הולכים לאיבוד.',
    },
    haiku: { lines: ['נמלה צועדת', 'על פס נייר מפותל', 'חוזרת הפוכה'], note: 'הדימוי של מאוריץ אשר M. C. Escher, ברצועת מביוס II, 1963: הליכה בלי לחצות שפה.' },
    action: {
      think: 'איפה במבנה שאתם מכירים עוברים מבפנים לבחוץ בלי לשים לב?',
      do: 'גזרו רצועת נייר, סובבו חצי סיבוב, הדביקו, וחתכו לאורך האמצע. מה קיבלתם?',
    },
    post: 'גזרו רצועת נייר, סובבו חצי סיבוב והדביקו.\nעכשיו חתכו לאורך האמצע.\nבמקום שתי רצועות תקבלו **רצועה אחת**, ארוכה פי 2.\nזו רצועת מביוס, שתוארה ב-1858: משטח עם צד אחד ושפה אחת.\nב-1998 הפכו אותה UNStudio לבית מגורים בהולנד, שבו מסלול היום ומסלול העבודה נכרכים זה בזה.\nהתובנה לאדריכלות: **גבול הוא החלטה**, לא גזירה.\nאיפה בבניין שלכם הייתם מוותרים על הדלת בין בפנים לבחוץ?',
    links: [
      { to: 'integral', rule: 'שניהם **מבטלים את הגבול**: מביוס בין צדדים, האינטגרל בין חלקים.', insight: 'רצף הוא לא היעדר חלוקה, אלא חלוקה כל כך דקה שאינה מורגשת.', action: 'תכננו מסלול שבו הקיר, הרצפה והתקרה הם פס אחד.' },
      { to: 'oxymoron', rule: 'משטח שהוא **פנים וחוץ** בבת אחת.', insight: 'רצועת מביוס היא אוקסימורון גאומטרי שעובד.', action: 'סמנו בתוכנית מקום אחד שהוא גם בפנים וגם בחוץ: מרפסת, אכסדרה, מעבר.' },
    ],
    models: [{ id: 'mobius', relation: 'same', why: 'אותו משטח: **צד אחד** ו**שפה אחת**, בחצי סיבוב.' }],
    images: { exterior: 'media/mobius-ext.webp', interior: 'media/mobius-int.webp' },
    videos: {
      exterior: `${MEDIA}/27fa02c0-2586-483a-a425-2c58a2b70617/exterior-video-1778330203510.mp4`,
      interior: `${MEDIA}/27fa02c0-2586-483a-a425-2c58a2b70617/interior-video-1778330252181.mp4`,
    },
    generated: {
      insight: 'רצועת מביוס חושפת כיצד משטח תלת-ממדי יכול להכיל אינסוף פנים וחוץ באותו אופן. בארכיטקטורה, היא מזמינה אותנו לדמיין חללים שבהם הגבולות בין פנים לחוץ, או בין קומה לקומה, מיטשטשים ומתמזגים לישות אחת רציפה. זוהי קריאה ליצור מבנים שבהם המסע דרך המרחב הוא חוויה של גילוי אינסופי ואי-הפרדה.',
      proverb: 'הדרך הנפתלת מראה פנים רבות, אך בבסיסה היא משטח אחד ויחיד.',
      interpretation: 'המשפט מלמד אותנו כי לעיתים, מה שנראה כבעל פנים מרובות או צדדים נפרדים, הוא למעשה ביטוי של יחידה אחת ורציפה, בדומה לרצועת מביוס. באדריכלות, פירוש הדבר ליצור מבנים שבהם המעברים והחללים נחווים כחלק ממארג אינסופי אחד, המטשטש את הגבולות המקובלים ומזמין להתבוננות עמוקה יותר על אחדות המרחב.',
    },
    prompts: {
      exterior: "A photorealistic architectural visualization, dramatic lighting, ultra detailed, of a monumental, sculptural building inspired by the Möbius strip. The structure features a continuous, twisting surface of polished concrete and panoramic glass, seamlessly blending exterior walls with roof and ground. It appears as one unified, looping form, with no clear distinction between 'side' and 'top'. Set against a dramatic, clear blue sky with a minimalist landscape. The overall impression is one of fluid motion and infinite continuity.",
      interior: 'A photorealistic interior design, volumetric lighting, ultra detailed, of a vast, open-plan space inspired by the Möbius strip. The interior features continuous, flowing surfaces where floor, wall, and ceiling merge seamlessly without sharp corners or defined boundaries. Smooth, light-colored polished concrete or marble forms endless ramps and walkways that loop and twist, creating a sense of infinite progression. Natural light filters in from unseen sources, creating soft gradients and highlights on the continuous curves. Minimalist furniture pieces are integrated directly into the architecture, emphasizing the unity of the space.',
    },
    mj: {
      distill: 'קיר שהופך לגג בלי תפר אחד.',
      prompt: `היכל של משטח אחד: סרט בטון מלוטש שמתפתל בחצי סיבוב והופך מקיר לגג ומגג לרצפה, זכוכית פנורמית ברצף, נוף מינימלי ושמיים בהירים, ${MJ}`,
    },
  },
  {
    slug: 'prime',
    id: '1857174f-7c06-4a43-a2ea-cb7e03fbee45',
    name: 'מספר ראשוני',
    latin: 'Prime number',
    force: 'order',
    architecturalName: 'היכל היסודות הראשוניים',
    layout: 'strip',
    rule: {
      text: 'מספר גדול מ-1 שמתחלק רק ב-1 ו**בעצמו**. כל מספר שלם בנוי מראשוניים, ב**דרך אחת בלבד**.',
      formula: '2, 3, 5, 7, 11, 13 …',
      source: { label: 'אוקלידס Euclid, יסודות, ספר IX, משפט 20: יש אינסוף ראשוניים', href: 'https://mathcs.clarku.edu/~djoyce/elements/bookIX/propIX20.html' },
    },
    insightLine: '**יסוד** שאי אפשר לפרק.',
    insightText: 'כמו **אבן פינה**, ראשוני הוא חלק שממנו בונים, ואינו מתחלק ל**חלקים קטנים** יותר.',
    works: 'מקצב של **5** או **7** מפרשים לא מתחלק לקבוצות שוות, ולכן מסמן **מרכז אחד** ברור.',
    fails: 'טוהר צורני בלי הקשר הופך ל**אנדרטה קרה**. יסוד צריך גם בית.',
    precedent: {
      name: { he: 'בית האספה הלאומית של בנגלדש', latin: 'Jatiya Sangsad Bhaban, Dhaka' },
      by: 'לואי קאן Louis Kahn',
      year: '1982',
      text: 'קירות בטון ענקיים נחתכים ב**עיגולים**, **משולשים** ו**ריבועים**: צורות יסוד בלי קישוט אחד.',
      source: { label: 'Jatiya Sangsad Bhaban', href: 'https://en.wikipedia.org/wiki/Jatiya_Sangsad_Bhaban' },
    },
    city: {
      name: { he: 'בניין ציבורי בעיר', latin: 'Colonnade' },
      text: 'ספרו עמודים בקולונדה או מרפסות בחזית.\nמספר **אי־זוגי** נותן ציר מרכזי לכניסה.\nמספר **ראשוני** גם לא מתחלק לקבוצות שוות.',
    },
    quote: {
      text: 'יש יותר מספרים ראשוניים מכל כמות נתונה של מספרים ראשוניים.',
      original: 'Prime numbers are more than any assigned multitude of prime numbers.',
      by: { he: 'אוקלידס', latin: 'Euclid' },
      work: 'יסודות, ספר IX, משפט 20, בתרגום Heath',
      year: 'בערך 300 לפני הספירה',
    },
    haiku: { lines: ['אבן אחת', 'שום פטיש לא יחצה', 'עליה הבית'], note: 'הייקו על אבן הפינה: מה שאי אפשר לפרק הוא מה שנושא.' },
    action: {
      think: 'מה ה"ראשוני" בפרויקט שלכם: הרכיב שאם תורידו אותו, הכול נופל?',
      do: 'סמנו בתוכנית את האלמנט האחד שאי אפשר לחלק או לוותר עליו, ונמקו במשפט אחד.',
    },
    post: 'אין מספר ראשוני אחרון.\nאוקלידס Euclid הוכיח את זה לפני כ-2,300 שנה, בספר IX של היסודות.\nראשוני הוא מספר שאי אפשר לפרק, וכל מספר אחר בנוי ממנו.\nבאדריכלות זה נקרא **יסוד**.\nלואי קאן Louis Kahn בנה בדאקה Dhaka בית אספה מקירות בטון שחתוכים בעיגולים, במשולשים ובריבועים, בלי קישוט.\nהדרך המעשית: מקצב של 5 או 7 מפרשים לא מתחלק לקבוצות שוות, ולכן מסמן מרכז אחד.\nמה היסוד בפרויקט שלכם, הדבר שאם תורידו אותו הכול נופל?',
    links: [
      { to: 'golden-ratio', rule: 'שניהם עונים על השאלה **איך מחלקים**.', insight: 'φ מתחלק לעצמו שוב ושוב, והראשוני מסרב להתחלק.', action: 'מספר ראשוני של מפרשים, וכל מפרש ביחס φ.' },
      { to: 'integral', rule: 'משפט המספרים הראשוניים: מספר הראשוניים עד x קרוב ל-**∫dt/ln t**.', insight: 'גם מה שנראה אקראי מציית לצבירה רציפה.', action: 'חפשו בעיר סדר שנראה מקרי: חלונות, עצים, תחנות. האם יש בו קצב?' },
    ],
    models: [{ id: 'ulam_spiral', relation: 'near', why: 'הראשוניים, מסודרים בספירלה על רשת, נעשים **דפוס** של מלא וריק: אלכסונים בתוך פיזור.' }],
    images: { exterior: 'media/prime-ext.webp', interior: 'media/prime-int.webp' },
    videos: {
      exterior: `${MEDIA}/1857174f-7c06-4a43-a2ea-cb7e03fbee45/exterior-video-1778330785393.mp4`,
      interior: `${MEDIA}/1857174f-7c06-4a43-a2ea-cb7e03fbee45/interior-video-1778330774708.mp4`,
    },
    generated: {
      insight: 'מספרים ראשוניים הם אבני היסוד הבלתי ניתנות לחלוקה של עולם המספרים, המגלמות את העקרונות הבסיסיים והטהורים ביותר. בארכיטקטורה, הם מתורגמים למבנים יסודיים וחזקים, שאינם ניתנים לפירוק לגורמים פשוטים יותר, ומהווים את השלד הבלתי מעורער שעליו נבנית המורכבות כולה. הם מסמלים את הטוהר, העמידות והכוח הטמון בפשטות הראשונית, חיוניים לכל יצירה מורכבת.',
      proverb: 'כמספר ראשוני יחיד, כך אבן פינה, יסוד לכל אשר יבוא.',
      interpretation: 'אבן הפינה בארכיטקטורה, בדומה למספר הראשוני במתמטיקה, היא היסוד הבלתי מעורער והבלתי ניתן לחלוקה. היא מסמלת את הכוח והשלמות הטמונים בפשטות המוחלטת, שממנה נובעת כל מורכבות ותפארת הבניין. בלעדיה, שום מבנה אינו יכול לעמוד איתן ובטוח, שכן היא הראשונית והחיונית מכל.',
    },
    prompts: {
      exterior: 'A colossal, monolithic architectural marvel inspired by prime numbers, standing solitary on a barren, windswept plateau under a dramatic sky. The structure consists of immense, pure geometric forms – towering cuboids, perfect spheres, and sharp pyramids – interlocking in an irreducible, elegant composition. No ornate details, only the raw power of fundamental shapes. The material is dark, unpolished basalt, with subtle, almost invisible seams, suggesting indivisibility and ancient strength. Dramatic lighting from a low sun casts long, stark shadows, highlighting the building\'s formidable presence. photorealistic architectural visualization, dramatic lighting, ultra detailed',
      interior: "A vast, minimalist interior chamber within the 'Hall of Primal Foundations'. The space is cavernous, yet feels incredibly pure and serene. Smooth, polished, seamless obsidian walls rise to an unseen height, reflecting the soft, volumetric light filtering in from a single, central aperture in the ceiling. In the center, a single, perfectly spherical luminescent object hovers, casting a gentle, ethereal glow. The only 'details' are faint, almost imperceptible etchings of prime number sequences spiraling up the walls, subtly revealing the underlying mathematical order. The air is still and sacred, evoking a sense of deep introspection. photorealistic interior design, volumetric lighting, ultra detailed",
    },
    mj: {
      distill: 'צורות יסוד שאין בהן דבר מיותר.',
      prompt: `היכל יסודות: מונוליתים של בזלת כהה בצורות טהורות, קובייה, כדור ופירמידה משתלבים בלי קישוט, רמה חשופה לרוח, שמש נמוכה וצללים ארוכים, ${MJ}`,
    },
  },
  {
    slug: 'integral',
    id: '5a9a1813-5fac-4fa1-8724-bc5e39c7a4f7',
    name: 'אינטגרל',
    latin: 'Integral · ∫',
    force: 'flow',
    architecturalName: 'מקדש הרצף המצטבר',
    layout: 'full',
    rule: {
      text: 'סכום של **אינסוף חלקים זעירים**: השטח מתחת לעקומה, כגבול של סכום **מלבנים צרים**.',
      formula: '∫f dx = lim Σ f·Δx',
      source: { label: 'גוטפריד וילהלם לייבניץ G. W. Leibniz כתב את הסימן ∫ לראשונה, 1675', href: 'https://en.wikipedia.org/wiki/Integral_symbol' },
    },
    insightLine: 'השלם הוא **סכום** של צעדים קטנים.',
    insightText: 'כשהמלבנים נעשים צרים, המדרגות הופכות ל**עקומה**, והבניין נקרא כ**נפח אחד** רציף.',
    works: 'שכבות דקות, מדרגות ופסים שמצטברים לצורה אחת נותנים תחושת **צמיחה**.',
    fails: 'כשהשכבה לא מורגשת, נשאר **גוש**. כשהיא גסה מדי, נשארות **מדרגות** ולא עקומה.',
    precedent: {
      name: { he: 'באר המדרגות צ׳אנד באורי', latin: 'Chand Baori, Abhaneri' },
      by: 'ראג׳סטאן, הודו Rajasthan, India',
      year: 'המאה ה-9',
      text: 'כ-**3,500** מדרגות צרות יורדות **13** קומות אל המים: סכום מדרגות שהופך לבור אחד.',
      source: { label: 'Chand Baori', href: 'https://en.wikipedia.org/wiki/Chand_Baori' },
    },
    city: {
      name: { he: 'שמורת חולות אשדוד־ניצנים', latin: 'Ashdod–Nitzanim Sands' },
      text: 'דיונה היא **אינטגרל של רוח**.\nגרגר ועוד גרגר, עד גבעה שלמה.\nאיש לא תכנן אותה כשלם.',
    },
    quote: {
      text: 'אם ראיתי רחוק יותר, הרי זה משום שעמדתי על כתפי ענקים.',
      original: 'If I have seen further it is by standing on the shoulders of Giants.',
      by: { he: 'אייזק ניוטון', latin: 'Isaac Newton' },
      work: 'מכתב לרוברט הוק Robert Hooke',
      year: '1676',
    },
    haiku: { lines: ['גרגר על גרגר', 'הרוח בונה גבעה', 'בלי לספור אחד'], note: 'דיונה בחוף אשדוד: צבירה שאין בה רגע אחד של בנייה.' },
    action: {
      think: 'מה בעיר נבנה בצעדים קטנים שאיש לא תכנן כשלם?',
      do: 'שרטטו עקומה ומלאו אותה ב-5 מלבנים, אחר כך ב-20. מתי זה מפסיק להיראות כמו מדרגות?',
    },
    post: 'דיונה לא נבנית. היא **מצטברת**.\nגרגר ועוד גרגר, עד שיש גבעה.\nזה בדיוק אינטגרל: סכום של אינסוף חלקים זעירים, שלייבניץ Leibniz נתן לו את הסימן ∫ ב-1675.\nבראג׳סטאן שבהודו, באר המדרגות צ׳אנד באורי Chand Baori יורדת 13 קומות אל המים בכ-3,500 מדרגות.\nמלמעלה היא נראית כמו סכום מלבנים שהופך לבור אחד.\nהתובנה: השלם נקרא כרציף כשהצעד קטן מספיק.\nאיזה חלק בעיר שלכם נבנה מצעדים קטנים שאיש לא תכנן כשלם?',
    links: [
      { to: 'mobius', rule: 'שניהם **מבטלים את הגבול**: האינטגרל בין חלקים, מביוס בין צדדים.', insight: 'רצף הוא חלוקה כל כך דקה שאינה מורגשת.', action: 'הפכו גרם מדרגות לרמפה, וראו מה קורה לתנועה בחלל.' },
      { to: 'entropy', rule: 'קלאוזיוס הגדיר את השינוי באנטרופיה כ**אינטגרל**: ΔS = ∫dQ/T.', insight: 'גם הזמן מצטבר. בלייה היא אינטגרל של ימים.', action: 'תעדו נקודה אחת בעיר פעם בחודש, וחברו את התמונות לרצף.' },
      { to: 'golden-ratio', rule: 'היחס בין מספרי פיבונאצ׳י עוקבים שואף ל-**φ**.', insight: 'פרופורציה יכולה להיות תוצאה של צבירה.', action: 'סדרת חדרים בגדלים 1, 1, 2, 3, 5, 8.' },
    ],
    models: [{ id: 'riemann', relation: 'same', why: 'סכום רימן הוא **ההגדרה** של האינטגרל: מלבנים שנעשים צרים עד שהם עקומה.' }],
    images: { exterior: 'media/integral-ext.webp', interior: 'media/integral-int.webp' },
    videos: {
      exterior: `${MEDIA}/5a9a1813-5fac-4fa1-8724-bc5e39c7a4f7/exterior-video-1778329374283.mp4`,
      interior: `${MEDIA}/5a9a1813-5fac-4fa1-8724-bc5e39c7a4f7/interior-video-1778329286423.mp4`,
    },
    generated: {
      insight: 'האינטגרל, כמהות של צבירה אינסופית של שינויים זעירים, משקף בארכיטקטורה את האופן שבו מרחב מתהווה כסכום רציף של נקודות, קווים ומשטחים. הוא מדמה את תהליך הבנייה כמסע של חיבור חלקיקים מינימליים לכדי יצירה אחת, שלמה וזורמת, שבה כל פרט תורם למסה הכוללת. זהו המימוש הפיזי של הצטברות, שבו כל לבנה, כל קשת, וכל עמוד מצטרפים לידי ביטוי של נפח וצורה.',
      proverb: 'כפי שהגרגרים בונים את המדבר, וכפי שהטיפות ממלאות את הים, כך החלקיקים הזעירים מקימים את היכל האדם.',
      interpretation: 'פתגם זה מבטא את תמצית רעיון האינטגרל – השלם נוצר מאינספור חלקים זעירים ובלתי נפרדים. בארכיטקטורה, כל אבן, כל קרן אור וכל קטע של חומר מתחברים לכדי יצירה רציפה המגדירה מרחב ונפח, בדומה לאופן שבו פונקציה מסוימת מצטברת לאורך קטע נתון ליצירת שטח או נפח כולל. הוא מדגיש את החשיבות של כל פרט, כמה קטן שיהיה, בבניית המבנה השלם והעוצמתי.',
    },
    prompts: {
      exterior: "A grand, flowing architectural structure that appears to emerge seamlessly from the landscape, composed of numerous thin, overlapping, and curvilinear layers of polished stone and shimmering glass. The layers subtly shift and expand, creating a sense of continuous growth and accumulation, culminating in a complex yet harmonious form. Water features flow along and through the building's base, mirroring its smooth lines. The structure's mass gives a sense of integrated volume. photorealistic architectural visualization, dramatic lighting (golden hour), ultra detailed, reflecting pool, epic scale.",
      interior: 'An expansive, serene interior space within a modern architectural masterpiece. The walls and ceiling are composed of continuous, sweeping curves of light-colored, seamless material, forming a unified, enveloping environment. Volumetric light streams in through hidden skylights and continuous ribbon windows, creating soft gradients and highlighting the smooth transitions between surfaces. Integrated seating and structural elements appear to grow organically from the floor, seamlessly blending into the overall design. The space evokes a sense of accumulated calm and flowing form. photorealistic interior design, volumetric lighting, ultra detailed, minimalist aesthetic, natural materials.',
    },
    mj: {
      distill: 'שכבות דקות שנעשות צורה אחת.',
      prompt: `מקדש של צבירה: שכבות אבן מלוטשת דקות שמתעגלות ומצטברות לגוש זורם אחד, מים זורמים לאורך הבסיס, אור שעת זהב, ${MJ}`,
    },
  },
  {
    slug: 'entropy',
    id: '4901c64d-5ebc-49fc-bc3d-fd502664f75f',
    name: 'אנטרופיה',
    latin: 'Entropy · S',
    force: 'change',
    architecturalName: 'מבוך השינוי המתהווה',
    layout: 'split',
    rule: {
      text: 'מדד ל**אי־סדר**. במערכת סגורה הוא **לא יורד**: החוק השני של התרמודינמיקה.',
      formula: 'ΔS ≥ 0',
      source: { label: 'רודולף קלאוזיוס Rudolf Clausius טבע את המונח, 1865', href: 'https://en.wikipedia.org/wiki/Entropy' },
    },
    insightLine: '**הזמן** הוא חומר בניין.',
    insightText: 'כל בניין נע מ**סדר** לאי־סדר. השאלה היא אם התכנון **מתנגד** לזה או **משתמש** בזה.',
    works: '**פטינה**, בלייה ואבן שמשתנה עם השנים נותנות לבניין **זיכרון**.',
    fails: 'התעלמות מבלייה: חומר שנראה טוב רק **ביום הפתיחה**.',
    precedent: {
      name: { he: 'מצודת אשדוד־ים', latin: 'Ashdod-Yam Fortress' },
      by: 'חוף אשדוד Ashdod',
      year: 'התקופה המוסלמית הקדומה',
      text: 'חומות אבן על **קו החוף**, שהרוח והחול מפרקים ומכסים לאט. ההריסה היא **חלק מהמקום**.',
      source: { label: 'Ashdod-Yam', href: 'https://en.wikipedia.org/wiki/Ashdod-Yam' },
    },
    city: {
      name: { he: 'חוף אשדוד', latin: 'Ashdod beach' },
      text: 'אחרי כל סערה, החול מכסה מדרגות ושבילים.\nהעיר מתקנת, והחול חוזר.\nזו **אנטרופיה בקנה מידה עירוני**.',
    },
    quote: {
      text: 'האנטרופיה של העולם שואפת למקסימום.',
      original: 'Die Entropie der Welt strebt einem Maximum zu.',
      by: { he: 'רודולף קלאוזיוס', latin: 'Rudolf Clausius' },
      work: 'Annalen der Physik',
      year: '1865',
    },
    haiku: { lines: ['חומה ישנה', 'החול נכנס בסדקים', 'גם הוא בונה'], note: 'במצודת אשדוד־ים הבלייה לא מוחקת. היא כותבת שכבה חדשה.' },
    action: {
      think: 'איזה חומר בבית שלכם נעשה יפה יותר עם הזמן, ואיזה רק מתבלה?',
      do: 'צלמו מקום אחד בעיר היום, ושוב בעוד חודש. מה השתנה בלי שאיש נגע?',
    },
    post: 'הבלייה של בניין היא לא תקלה. היא **חוק**.\nרודולף קלאוזיוס Rudolf Clausius כתב ב-1865 שהאנטרופיה של העולם שואפת למקסימום.\nכל חומה תתפרק, וכל שביל יתכסה בחול.\nבמצודת אשדוד־ים Ashdod-Yam רואים את זה על קו החוף: הרוח והחול ממשיכים לבנות את המקום אחרי שהבונים הלכו.\nהתובנה לתכנון: לא לשאול איך הבניין ייראה ביום הפתיחה, אלא בעוד 30 שנה.\nבחרו חומר שמתבגר יפה.\nאיזה חומר בבית שלכם נעשה יפה יותר עם הזמן?',
    links: [
      { to: 'oxymoron', rule: 'שניהם חיים ב**מתח** בין סדר לאי־סדר.', insight: 'האנטרופיה היא מתח לאורך זמן. האוקסימורון הוא מתח ברגע אחד.', action: 'הציבו בחזית אחת חלק מדויק וחלק שמותר לו להתבלות.' },
      { to: 'integral', rule: 'ΔS = **∫dQ/T**: השינוי באנטרופיה הוא אינטגרל.', insight: 'בלייה היא צבירה של ימים.', action: 'תעדו נקודה אחת בעיר פעם בחודש.' },
    ],
    models: [{ id: 'random_walk', relation: 'near', why: 'הילוך מקרי הוא מודל של **דיפוזיה**: כך מתפזר הסדר, וכך עולה האנטרופיה.' }],
    images: { exterior: 'media/entropy-ext.webp', interior: 'media/entropy-int.webp' },
    videos: {},
    generated: {
      insight: 'אנטרופיה, במובנה הארכיטקטוני, אינה רק בלגן, אלא תנועה בלתי פוסקת מסדר מוגדר לאי-סדר בעל פוטנציאל חדש. היא מזמינה אותנו להתבונן במבנים לא כסטטיים, אלא כדינמיים, הנתונים לשינוי, לבלייה ולטרנספורמציה. כך, הארכיטקטורה יכולה לחגוג את מורכבות העולם, שבו קיימת התפרקות מתמדת לצד יצירה בלתי פוסקת של צורות ומשמעויות חדשות.',
      proverb: 'כאשר האבן הונחה בסדר, יבוא הזמן והחול יפרה את קווי המתאר.',
      interpretation: 'משל עתיק זה מדבר על חוקי האנטרופיה הטבועים בכל מבנה פיזי. הוא מזכיר לנו כי גם המערכות המסודרות ביותר, כמו קיר אבן מוצק, נתונות לתהליכי בלייה והתפוררות טבעיים. החול המפרה את קווי המתאר אינו רק הרס, אלא יצירה של טקסטורות וצורות חדשות, עדות לזמן ולתהליך הבלתי נמנע של הפיכה ממצב של סדר למצב של אי-סדר מורכב.',
    },
    prompts: {
      exterior: 'A colossal, brutalist-inspired structure where sharp, geometric forms gradually dissolve into organic, eroded textures and chaotic clusters of fractal-like elements. The building appears to be both forming and deforming simultaneously, with intricate patterns of decay and growth intermingling across its vast surfaces. Some sections show pristine, ordered facades, while adjacent parts are covered in intricate, seemingly random networks of cracks, vines, or sculptural outgrowths that defy traditional structural logic. Dramatic, raking sunlight emphasizes the deep shadows and complex textures. Style: photorealistic architectural visualization, dramatic lighting, ultra detailed',
      interior: 'An expansive, cavernous interior where structural elements appear to be in a constant state of flux. Pillars morph into organic, root-like structures, and walls are composed of countless small, irregularly shaped modules that seem to be shifting and rearranging. The floor is an intricate mosaic of disparate materials that blend imperfectly, leading to a sense of non-uniformity. Light filters in through complex, fractured openings in the ceiling, creating dappled, shifting patterns of light and shadow on textured surfaces that display intentional signs of wear, patina, and controlled disintegration. Volumetric dust motes dance in the light. Style: photorealistic interior design, volumetric lighting, ultra detailed',
    },
    mj: {
      distill: 'סדר ובלייה באותה חזית.',
      prompt: `מבוך של זמן: מבנה בטון גאומטרי שחלקו חד ומסודר וחלקו מתפורר לטקסטורות של חול, סדקים וצמחייה, שמש נמוכה ורוחבית, ${MJ}`,
    },
  },
  {
    slug: 'oxymoron',
    id: 'c657363a-401d-4670-906c-2eee860a4f36',
    name: 'אוקסימורון',
    latin: 'Oxymoron · A ∧ ¬A',
    force: 'change',
    architecturalName: 'מגדל השקט הרועם',
    layout: 'strip',
    rule: {
      text: 'צירוף של שני מושגים **סותרים** שיוצר משמעות שלישית. בלוגיקה, **A וגם לא־A** הוא תמיד שקר. באוקסימורון הוא נעשה **דימוי**.',
      formula: 'A ∧ ¬A',
      source: { label: 'ביוונית: oxys, חד, ו־mōros, טיפש', href: 'https://en.wikipedia.org/wiki/Oxymoron' },
    },
    insightLine: '**ניגוד** שמחזיק את המבנה.',
    insightText: '**כבד** ו**קל**, **אטום** ו**שקוף** באותו גוף: המתח ביניהם הוא מה שעוצר את העין.',
    works: 'גוש כבד שמרחף, אבן שמעבירה אור: הפתעה ש**מבהירה את שני הצדדים**.',
    fails: 'ניגוד בשביל אפקט, בלי רעיון שמחבר, נשאר **גימיק**.',
    precedent: {
      name: { he: 'ספריית ביינקה לספרים נדירים', latin: 'Beinecke Rare Book Library, Yale' },
      by: 'גורדון בנשאפט Gordon Bunshaft, SOM',
      year: '1963',
      text: 'קירות של **שיש דק** מעבירים אור פנימה: אבן כבדה שמתנהגת כמו **חלון**.',
      source: { label: 'Beinecke Rare Book & Manuscript Library', href: 'https://en.wikipedia.org/wiki/Beinecke_Rare_Book_%26_Manuscript_Library' },
    },
    city: {
      name: { he: 'היכל הספר, ירושלים', latin: 'Shrine of the Book, Jerusalem' },
      text: 'כיפה **לבנה** מול קיר **בזלת שחור**.\nפרדריק קיסלר Frederick Kiesler וארמנד ברטוס Armand Bartos, 1965.\nבני האור ובני החושך מהמגילות, באבן.',
    },
    quote: {
      text: 'פחות זה יותר.',
      original: 'Well, less is more, Lucrezia',
      by: { he: 'רוברט בראונינג', latin: 'Robert Browning' },
      work: 'Andrea del Sarto',
      year: '1855',
    },
    haiku: { lines: ['אבן שקופה', 'אור עובר בעד הכובד', 'שקט שרועם'], note: 'השיש של ביינקה: כובד שמכניס אור.' },
    action: {
      think: 'אילו שני דברים "סותרים" אתם רוצים בפרויקט: פתוח ומוגן? כבד וקל?',
      do: 'בחרו חומר אחד, ותנו לו תפקיד הפוך מהרגיל: אבן שמאירה, זכוכית שנושאת.',
    },
    post: 'אבן יכולה להיות **חלון**.\nבספריית ביינקה Beinecke שבאוניברסיטת ייל Yale, מ-1963, קירות של שיש דק מעבירים אור לחדר, ומגינים על הספרים מהשמש הישירה.\nזה אוקסימורון בבנייה: שני דברים סותרים בגוף אחד.\nגם "פחות זה יותר" התחיל כצירוף כזה, בשיר של רוברט בראונינג Robert Browning מ-1855, לפני שמיס ואן דר רוהה Mies van der Rohe הפך אותו לסיסמה.\nהתובנה: הניגוד מבהיר את שני הצדדים.\nאיזה חומר בפרויקט שלכם הייתם מבקשים לעשות את ההפך מהרגיל?',
    links: [
      { to: 'entropy', rule: 'שניהם חיים ב**מתח** בין סדר לאי־סדר.', insight: 'האוקסימורון הוא מתח ברגע אחד. האנטרופיה היא מתח לאורך זמן.', action: 'חזית שבה חלק אחד מדויק וחלק אחד חופשי.' },
      { to: 'mobius', rule: 'משטח שהוא **פנים וחוץ** בבת אחת.', insight: 'מביוס הוא אוקסימורון שהמתמטיקה מוכיחה.', action: 'מקום אחד בתוכנית שהוא גם בפנים וגם בחוץ.' },
    ],
    models: [{ id: 'klein', relation: 'near', why: 'משטח שהפנים והחוץ שלו הם **אותו משטח**: סתירה שהגאומטריה מאפשרת.' }],
    images: { exterior: 'media/oxymoron-ext.webp', interior: 'media/oxymoron-int.webp' },
    videos: {
      exterior: `${MEDIA}/c657363a-401d-4670-906c-2eee860a4f36/exterior-video-1780700703080.mp4`,
      interior: `${MEDIA}/c657363a-401d-4670-906c-2eee860a4f36/interior-video-1780704994328.mp4`,
    },
    generated: {
      insight: 'האוקסימורון באדריכלות מייצג את האמנות העדינה של שילוב ניגודים גמורים ליצירת שלם חדש ועשיר במשמעות. הוא מראה כיצד יסודות סותרים – כבדות וקלות, שקיפות ואטימות, יציבות וחוסר יציבות – יכולים שלא רק להתקיים זה לצד זה, אלא אף להזין זה את זה, ליצור מתח פרודוקטיבי ולהוליד יופי ואיזון בלתי צפויים. זהו ביטוי לכך שהאמת האדריכלית העמוקה ביותר טמונה לעיתים קרובות בחיבור הפרדוקסלי.',
      proverb: 'בניגודים ימצא האיזון, ומה שנראה כסותר, הוא יסוד החיים והבנייה.',
      interpretation: 'הפתגם מצביע על כך שאיזון אמיתי וחיים נובעים דווקא מחיבור של ניגודים. בדומה לאוקסימורון המשלב מילים סותרות ליצירת משמעות עמוקה, כך גם האדריכלות משלבת חומרים, צורות ופונקציות מנוגדות – חלל סגור ופתוח, אור וצל – כדי להגיע ליציבות אסתטית ופונקציונלית. דווקא מתוך המתח בין הניגודים עולה המבנה השלם והמשמעותי, כשהפרדוקס הופך ליסוד העיצוב.',
    },
    prompts: {
      exterior: 'A brutalist concrete fortress-like structure that appears to defy gravity, floating weightlessly above a tranquil, reflective water feature. Portions of the massive, opaque concrete walls seamlessly transition into delicate, ultra-transparent glass panels, revealing glowing, intricate interior details. The building creates a striking visual paradox of immense mass and ethereal lightness. photorealistic architectural visualization, dramatic lighting (late afternoon sun casting long shadows), ultra detailed',
      interior: "A vast, cavernous interior space with raw, minimalist concrete surfaces creating an austere atmosphere, yet punctuated by areas of extreme, intricate ornamentation crafted from polished brass and dark, reflective wood. The lighting is dramatically contrasting, with pools of intense, focused light illuminating specific delicate details, while other areas remain in deep, moody shadow, creating a sense of 'roaring silence' and 'dark light'. photorealistic interior design, volumetric lighting, ultra detailed",
    },
    mj: {
      distill: 'כובד שמרחף מעל מים שקטים.',
      prompt: `מגדל השקט הרועם: מבצר בטון כבד שמרחף מעל בריכה שקטה, קירות אטומים שהופכים לזכוכית שקופה, אור אחר הצהריים וצללים ארוכים, ${MJ}`,
    },
  },
];

export const bySlug = (s: string) => CONCEPTS.find((c) => c.slug === s);
export const EXAMPLES = ['פרקטל', 'היפרבולואיד', 'סימטריה', 'אינסוף', 'טסלציה', 'גבול'];
