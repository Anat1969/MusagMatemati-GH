// בדיקת קצה לקצה: npm run build && node tests/e2e.cjs. מריץ vite preview, ומדמה את השרת ואת ai-menu.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const MENU = fs.readFileSync(__dirname + '/fixtures/ai-menu.js', 'utf8');
const BASE = 'http://localhost:4199/';
const fails = [];
const ok = (cond, msg) => { console.log((cond ? 'PASS ' : 'FAIL ') + msg); if (!cond) fails.push(msg); };
const DIM = { insight: 'פרקטל חוזר על עצמו בכל קנה מידה. הוא מלמד צמיחה.', architecturalName: 'היכל הפרקטל', proverb: 'כל ענף הוא עץ.', interpretation: 'הפתגם מלמד על חזרה.', imagePrompts: { exterior: 'fractal exterior', interior: 'fractal interior' } };
const REMOTE = [{ id: 'remote-1', concept: 'סימטריה', created_at: '2026-10-01T10:00:00Z', insight: 'סימטריה היא איזון.', architectural_name: 'אולם המראה', proverb: 'p', interpretation: 'i', exterior_prompt: 'e', interior_prompt: 'i', media_assets: {} }];

async function mock(p, calls) {
  await p.route('**/appofapp-gh.vercel.app/**', (r) => r.fulfill({ status: 200, contentType: 'application/javascript', body: MENU }));
  await p.route('**/*.supabase.co/**', (r) => {
    const u = r.request().url();
    calls.push(r.request().method() + ' ' + u.replace(/^https:\/\/[^/]+/, ''));
    if (u.includes('/functions/v1/generate-dimensions')) return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(DIM) });
    if (u.includes('/functions/v1/generate-images')) return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ exterior: BASE + 'media/golden-ext.webp', interior: BASE + 'media/golden-int.webp' }) });
    if (u.includes('/rest/v1/articles') && r.request().method() === 'GET') return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(REMOTE) });
    return r.fulfill({ status: 201, body: '' });
  });
}

(async () => {
  const srv = spawn('npx', ['vite', 'preview', '--port', '4199', '--strictPort'], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 2500));
  const b = await chromium.launch();
  try {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.grantPermissions(['clipboard-read', 'clipboard-write']);
    const p = await ctx.newPage();
    const calls = [];
    await mock(p, calls);
    const errors = [];
    p.on('pageerror', (e) => errors.push(e.message));
    await p.goto(BASE, { waitUntil: 'networkidle' });

    ok((await p.locator('h1').innerText()).includes('שאלות'), 'דף הבית: שורת התובנה');
    ok(await p.locator('ai-menu .logo').isVisible(), 'כפתור הלוגו A&I בסרגל');
    ok(!(await p.locator('header >> text=העתקת קישור').first().isVisible().catch(() => false)), 'אין כפתורי פיתוח חופשיים בסרגל');
    ok(await p.locator('svg.iso .iso-bldg').count() === 6, 'עיר המושגים: 6 בניינים');
    await p.locator('.legend-row').nth(0).hover();
    ok((await p.locator('.city-tip').innerText()).includes('יחס הזהב'), 'ריחוף על המקרא מדגיש בניין');
    await p.locator('svg.iso .iso-bldg').first().hover();
    ok((await p.locator('.legend-row.is-hot').count()) === 1, 'ריחוף על בניין מדגיש שורה במקרא');
    ok(await p.locator('.hero-kpi .kpi').nth(2).innerText() === '1', 'מושג מהשרת נספר בדף הבית');

    await p.locator('.legend-row', { hasText: 'רצועת מביוס' }).click();
    await p.waitForFunction(() => document.querySelector('h1')?.textContent === 'היכל המשטח היחידאי');
    ok(p.url().endsWith('#/c/mobius'), 'מקרא פותח את כתבת המושג');
    ok(await p.locator('.formula').isVisible(), 'כתבה: הכלל והנוסחה');
    ok(await p.locator('.real-card .nm-latin').first().innerText() === 'Möbius House, Het Gooi', 'כתבה: תקדים בעברית ובלועזית');
    ok(await p.locator('.ft-haiku span').count() === 3, 'כתבה: הייקו בשלוש שורות');
    ok(await p.locator('.ft-link').count() === 2, 'כתבה: חיבורים עם כלל, תובנה ויישום');
    await p.locator('.dg-ctl .chip', { hasText: '0' }).click();
    ok((await p.locator('.dg figcaption').innerText()).includes('שני צדדים'), 'שרטוט חי משתנה עם הבחירה');

    await p.locator('.op[aria-label="הבא"]').click();
    await p.waitForFunction(() => location.hash === '#/c/prime');
    ok(true, 'הבא עובר למושג הבא');
    await p.waitForSelector('h1:text("היכל היסודות הראשוניים")'); await p.waitForTimeout(200);
    await p.keyboard.press('ArrowRight');
    await p.waitForFunction(() => location.hash === '#/c/mobius');
    ok(true, 'חץ במקלדת חוזר למושג הקודם');

    await p.waitForSelector('h1:text("היכל המשטח היחידאי")'); await p.waitForTimeout(200);
    await p.locator('.loop-step textarea').first().fill('רמפה בחניון');
    await p.waitForTimeout(900);
    ok((await p.locator('.loop .saved').innerText()).startsWith('נשמר'), 'יומן היישום: חיווי נשמר');
    await p.reload({ waitUntil: 'networkidle' });
    ok(await p.locator('.loop-step textarea').first().inputValue() === 'רמפה בחניון', 'יומן היישום נשמר אחרי רענון');

    await p.locator('.ft-post button').click();
    ok((await p.evaluate(() => navigator.clipboard.readText())).includes('רצועת מביוס'), 'העתקת הפוסט');
    await p.locator('.prompt.mj button').click();
    const mj = await p.evaluate(() => navigator.clipboard.readText());
    ok(mj.includes('Documentary realism') && mj.includes('--no text, words, writing, frame divisions'), 'פרומפט מידג׳רני כולל את הפרמטרים');

    await p.locator('.op[aria-label^="סגירה"]').click();
    await p.waitForFunction(() => location.hash === '#/magazine');
    ok(await p.locator('.mag-card').count() === 7, 'מגזין: 6 מושגים ומושג מהשרת');
    await p.locator('.chooser .chip', { hasText: 'רצף' }).click(); await p.waitForTimeout(300);
    ok(await p.locator('.mag-card').count() === 2 && p.url().includes('f=flow'), 'בורר: לחיצה מחליפה לרצף');
    await p.locator('.chip-plus').nth(2).click(); await p.waitForTimeout(300);
    ok(await p.locator('.mag-card').count() === 4, 'בורר: פלוס מוסיף את שינוי');
    await p.locator('.chooser .chip', { hasText: 'הכול' }).click(); await p.waitForTimeout(300);
    ok(await p.locator('.mag-card').count() === 7, 'בורר: הכול מאפס');
    await p.reload({ waitUntil: 'networkidle' });

    await p.locator('.search-field').fill('אשדוד'); await p.waitForTimeout(300);
    ok(await p.locator('.mag-card').count() === 3, 'חיפוש: אשדוד מוצא 3 מושגים');
    await p.locator('.search-field').fill('ביינקה'); await p.waitForTimeout(300);
    ok(await p.locator('.mag-card').count() === 1, 'חיפוש: תקדים לפי שם');
    await p.locator('.search-field').fill('אין כזה'); await p.waitForTimeout(300);
    ok(await p.getByText('לא נמצא מושג.').isVisible(), 'מצב ריק מוסבר');
    await p.locator('.search-x').click();
    ok(await p.locator('.search-field').inputValue() === '', 'איקס מנקה את החיפוש');

    await p.goto(BASE + '#/lab?q=' + encodeURIComponent('פרקטל'), { waitUntil: 'networkidle' });
    await p.waitForSelector('.lab-title');
    ok(await p.locator('.lab-title').innerText() === 'היכל הפרקטל', 'מחולל: מושג חוזר מהשרת');
    ok(calls.some((c) => c.includes('generate-dimensions')), 'מחולל: נשלחה בקשה ל-generate-dimensions');
    await p.getByRole('button', { name: 'יצירת תמונות' }).click();
    await p.waitForSelector('.lab-img img');
    ok(await p.locator('.lab-img img').count() === 2, 'מחולל: שתי תמונות');
    await p.getByRole('button', { name: 'שמירה במגזין' }).click();
    await p.waitForSelector('.saved-line');
    ok(calls.some((c) => c.startsWith('POST /rest/v1/articles')), 'מחולל: נשמר לשרת');
    await p.locator('.saved-line a').click();
    await p.waitForFunction(() => document.querySelector('h1')?.textContent === 'היכל הפרקטל');
    ok(true, 'מחולל: הכתבה שנשמרה נפתחת');
    await p.goto(BASE + '#/magazine?f=gen', { waitUntil: 'networkidle' });
    ok(await p.locator('.mag-card').count() === 2, 'מגזין: המושג החדש מופיע תחת מהמחולל');

    await p.goto(BASE + '#/c/golden-ratio', { waitUntil: 'networkidle' });
    await p.locator('.brand').click();
    await p.waitForFunction(() => location.hash === '#/');
    ok(true, 'שם האפליקציה מוביל לבית');

    const radius = await p.evaluate(() => [...document.querySelectorAll('button, .field, .search-field')].every((x) => getComputedStyle(x).borderRadius === '0px'));
    ok(radius, 'כל הכפתורים והשדות מרובעים');
    ok(await p.locator('.num').count() > 5, 'מספרים מודגשים אוטומטית');

    const cdp = await ctx.newCDPSession(p);
    const inst = await cdp.send('Page.getInstallabilityErrors');
    ok(inst.installabilityErrors.length === 0, 'התקנה: ' + (JSON.stringify(inst.installabilityErrors) || 'אין שגיאות'));

    for (const vp of [{ width: 390, height: 844 }, { width: 1280, height: 900 }]) {
      const m = await b.newPage({ viewport: vp, reducedMotion: 'reduce' });
      await mock(m, []);
      for (const h of ['', '#/magazine', '#/c/golden-ratio', '#/c/mobius', '#/c/prime', '#/c/integral', '#/c/entropy', '#/c/oxymoron', '#/lab']) {
        await m.goto(BASE + h, { waitUntil: 'networkidle' });
        const hs = await m.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
        ok(!hs, `${vp.width}px ${h || 'בית'}: בלי גלילה אופקית`);
      }
      await m.goto(BASE, { waitUntil: 'networkidle' });
      const anim = await m.evaluate(() => getComputedStyle(document.querySelector('.rise')).animationName);
      ok(anim === 'none', `${vp.width}px: הפחתת תנועה מכובדת`);
      await m.close();
    }
    ok(errors.length === 0, 'אין שגיאות JavaScript ' + errors.join(' | '));
  } finally {
    await b.close();
    srv.kill();
  }
  console.log(fails.length ? `\n${fails.length} נכשלו` : '\nהכול עבר');
  process.exit(fails.length ? 1 : 0);
})();
