import { useEffect, useState } from 'react';

// ניתוב hash: הכתובת נושאת את הדף, המושג והסינון, כך שהעתקת קישור שומרת את המצב.
export interface Route { page: string; arg: string; params: Record<string, string> }

const parse = (): Route => {
  const [path, query = ''] = window.location.hash.replace(/^#\/?/, '').split('?');
  const [page, ...rest] = path.split('/');
  return { page: page || 'home', arg: decodeURIComponent(rest.join('/')), params: Object.fromEntries(new URLSearchParams(query)) };
};

export function useRoute() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    let prev = parse().page + parse().arg;
    const on = () => {
      const r = parse();
      const key = r.page + r.arg;
      if (key !== prev) window.scrollTo({ top: 0 });
      prev = key;
      setRoute(r);
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export const href = (page: string, arg?: string, params?: Record<string, string | undefined>) => {
  const clean = Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v)) as Record<string, string>;
  const q = Object.keys(clean).length ? '?' + new URLSearchParams(clean).toString() : '';
  if (page === 'home') return '#/';
  return `#/${page}${arg ? '/' + encodeURIComponent(arg) : ''}${q}`;
};

export const go = (page: string, arg?: string, params?: Record<string, string | undefined>) => {
  window.location.hash = href(page, arg, params);
};
