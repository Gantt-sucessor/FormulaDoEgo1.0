import { Link, useRouter } from '../lib/router.jsx';
import { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth.jsx';
import { som } from '../lib/som.js';

export function Logo() {
  return (
    <Link para="/" className="text-[15px] font-bold uppercase tracking-[0.28em] text-texto no-underline">
      Fórmula do <span className="text-ciano glow-ciano">Ego</span>
    </Link>
  );
}

function BotaoSom() {
  const [ligado, setLigado] = useState(som.ligado);
  useEffect(() => som.inscrever(setLigado), []);
  return (
    <button type="button" onClick={() => som.alternar()} aria-pressed={ligado} aria-label={ligado ? 'Desligar sons' : 'Ligar sons'} title={ligado ? 'Sons ligados' : 'Sons desligados'}
      className={`px-2.5 py-1.5 text-[16px] leading-none ${ligado ? 'text-ciano' : 'text-mudo'}`}>
      {ligado ? '♪' : '♪̸'}
    </button>
  );
}

function NavLink({ para, children }) {
  const { caminho } = useRouter();
  const ativo = para === '/' ? caminho === '/' : caminho.startsWith(para);
  return (
    <Link para={para} className={`px-2.5 py-1.5 text-[13px] font-semibold uppercase tracking-[0.16em] sm:px-3 ${ativo ? 'text-ciano' : 'text-suave hover:text-texto'}`}>
      {children}
    </Link>
  );
}

export function Topbar({ publica = false }) {
  const { usuario, sair } = useAuth();
  const { ir } = useRouter();
  return (
    <header className="pt-seguro sticky top-0 z-30 border-b border-linha bg-fundo/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-2 px-3 py-2.5 sm:px-5">
        <Logo />
        {publica ? (
          <span className="flex items-center gap-2 text-[13px] text-mudo">somente leitura <BotaoSom /></span>
        ) : (
          <nav className="flex items-center">
            <NavLink para="/fichas">Fichas</NavLink>
            <NavLink para="/sala">Sala</NavLink>
            <NavLink para="/mestre">Mestre</NavLink>
            <BotaoSom />
            {usuario && <button type="button" className="px-2.5 py-1.5 text-[13px] font-semibold uppercase tracking-[0.16em] text-mudo hover:text-perigo" onClick={async () => { await sair(); ir('/'); }}>Sair</button>}
          </nav>
        )}
      </div>
    </header>
  );
}

export function Pagina({ children, larga = false, publica = false }) {
  return (
    <>
      <Topbar publica={publica} />
      <main className={`mx-auto px-3 pb-24 pt-5 sm:px-5 sm:pb-12 ${larga ? "max-w-[1800px]" : "max-w-3xl"}`}>{children}</main>
    </>
  );
}
