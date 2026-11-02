import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { buildBridge } from './src/lib/bridge';

// bridge.json: מה ש"מושג מתמטי" מפרסם ל"מודל חי", נבנה ממקור הנתונים בכל בנייה.
const bridge = (): Plugin => ({
  name: 'musag-bridge',
  apply: 'build',
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'bridge.json', source: JSON.stringify(buildBridge(), null, 1) });
  },
});

// Vercel serves from "/", the build:github link (raw.githack) uses relative "./".
export default defineConfig({
  plugins: [react(), bridge()],
  base: '/',
});
