import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/base.css';
import './styles/feature.css';
import './styles/app.css';

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);

// service worker רק כשהבסיס הוא "/" (Vercel), לא בקישור raw.githack
if ('serviceWorker' in navigator && location.pathname === '/' && location.hostname !== 'localhost') {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
