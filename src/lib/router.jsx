import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const RouterCtx = createContext(null);

// Links antigos (site em HTML puro) continuam funcionando.
function traduzirLegado(pathname, search) {
  const q = new URLSearchParams(search);
  if (pathname.endsWith('ficha-publica.html') && q.get('id')) return `/publica/${q.get('id')}`;
  if (pathname.endsWith('player.html')) return q.get('ficha') ? `/ficha/${q.get('ficha')}` : '/fichas';
  if (pathname.endsWith('sala.html')) return q.get('codigo') ? `/sala/${q.get('codigo')}` : '/sala';
  if (pathname.endsWith('mestre.html')) return '/mestre';
  if (pathname.endsWith('index.html')) return '/';
  return null;
}

function urlAtual() {
  const legado = traduzirLegado(window.location.pathname, window.location.search);
  return legado || (window.location.pathname + window.location.search) || '/';
}

export function RouterProvider({ children }) {
  const [url, setUrl] = useState(urlAtual);

  useEffect(() => {
    const legado = traduzirLegado(window.location.pathname, window.location.search);
    if (legado) window.history.replaceState({}, '', legado);
    const aoVoltar = () => setUrl(urlAtual());
    window.addEventListener('popstate', aoVoltar);
    return () => window.removeEventListener('popstate', aoVoltar);
  }, []);

  const ir = useCallback((destino, { substituir = false } = {}) => {
    if (destino === window.location.pathname + window.location.search) return;
    window.history[substituir ? 'replaceState' : 'pushState']({}, '', destino);
    setUrl(destino);
    window.scrollTo({ top: 0 });
  }, []);

  const [caminho, busca = ''] = url.split('?');
  const valor = useMemo(() => ({ caminho, busca: busca ? `?${busca}` : '', params: new URLSearchParams(busca), ir }), [url, ir]);
  return <RouterCtx.Provider value={valor}>{children}</RouterCtx.Provider>;
}

export const useRouter = () => useContext(RouterCtx);

/** Casa "/ficha/:id" com "/ficha/abc" → { id: 'abc' } (ou null). */
export function casar(padrao, caminho) {
  const a = padrao.split('/').filter(Boolean);
  const b = caminho.split('/').filter(Boolean);
  if (a.length !== b.length) return null;
  const params = {};
  for (let i = 0; i < a.length; i += 1) {
    if (a[i].startsWith(':')) params[a[i].slice(1)] = decodeURIComponent(b[i]);
    else if (a[i] !== b[i]) return null;
  }
  return params;
}

export function Link({ para, className, children, onClick, ...resto }) {
  const { ir } = useRouter();
  return (
    <a
      href={para}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        onClick?.(e);
        ir(para);
      }}
      {...resto}
    >
      {children}
    </a>
  );
}
