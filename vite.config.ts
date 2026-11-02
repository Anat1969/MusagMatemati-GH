import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vercel serves from "/", the build:github link (raw.githack) uses relative "./".
export default defineConfig({
  plugins: [react()],
  base: '/',
});
