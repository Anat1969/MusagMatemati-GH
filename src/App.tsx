import { useEffect } from 'react';
import TopBar from './components/TopBar';
import { useRoute } from './lib/route';
import { syncRemote } from './lib/store';
import ConceptPage from './pages/ConceptPage';
import Home from './pages/Home';
import Lab from './pages/Lab';
import Magazine from './pages/Magazine';

export default function App() {
  const route = useRoute();
  useEffect(() => { syncRemote(); }, []);
  useEffect(() => {
    const titles: Record<string, string> = { home: 'מושג מתמטי', magazine: 'מגזין · מושג מתמטי', lab: 'מחולל · מושג מתמטי' };
    document.title = titles[route.page] || 'מושג מתמטי';
  }, [route.page]);

  return (
    <>
      <TopBar route={route} />
      {route.page === 'magazine' ? <Magazine route={route} />
        : route.page === 'c' ? <ConceptPage key={route.arg} arg={route.arg} />
        : route.page === 'lab' ? <Lab route={route} />
        : <Home />}
    </>
  );
}
