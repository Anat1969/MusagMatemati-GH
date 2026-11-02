// צילומי מסך מול vite preview, עם מוקים לשרת ול-ai-menu. usage: node tests/shot.cjs [out] [hash...]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const MENU = fs.readFileSync(__dirname + '/fixtures/ai-menu.js', 'utf8');
const out = process.argv[2] || 'tests/shots';
const hashes = process.argv.slice(3).length ? process.argv.slice(3) : ['', '#/magazine', '#/c/golden-ratio', '#/c/mobius', '#/lab'];
fs.mkdirSync(out, { recursive: true });
(async () => {
  const srv = spawn('npx', ['vite', 'preview', '--port', '4198', '--strictPort'], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 2500));
  const b = await chromium.launch();
  try {
    for (const [n, vp] of [['desk', { width: 1440, height: 900 }], ['mob', { width: 390, height: 844 }]]) {
      const p = await b.newPage({ viewport: vp });
      await p.route('**/appofapp-gh.vercel.app/**', (r) => r.fulfill({ status: 200, contentType: 'application/javascript', body: MENU }));
      await p.route('**/*.supabase.co/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
      for (const h of hashes) {
        await p.goto('http://localhost:4198/' + h, { waitUntil: 'networkidle' });
        await p.waitForTimeout(1300);
        const name = (h.replace(/[#/]/g, '_') || 'home');
        await p.screenshot({ path: `${out}/${n}${name}.png`, fullPage: n === 'desk' });
      }
      await p.close();
    }
  } finally { await b.close(); srv.kill(); }
})();
