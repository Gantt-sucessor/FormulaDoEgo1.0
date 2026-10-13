import { Link, useRouter } from '../lib/router.jsx';
import { useAuth } from '../lib/auth.jsx';

export function Logo() {
  return (
    <Link para="/" className="text-[13px] font-bold uppercase tracking-[0.28em] text-texto no-underline">
      Fórmula do <span className="text-ciano glow-ciano">Ego</span>
    </Link>
  );
}

function NavLink({ para, children }) {
  const { caminho } = useRouter();
  const ativo = para === '/' ? caminho === '/' : caminho.startsWith(para);
  return (
    <Link para={para} className={`px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] sm:px-3 ${ativo ? 'text-ciano' : 'text-suave hover:text-texto'}`}>
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
          <span className="text-[11px] text-mudo">somente leitura</span>
        ) : (
          <nav className="flex items-center">
            <NavLink para="/fichas">Fichas</NavLink>
            <NavLink para="/sala">Sala</NavLink>
            <NavLink para="/mestre">Mestre</NavLink>
            {usuario && <button type="button" className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-mudo hover:text-perigo" onClick={async () => { await sair(); ir('/'); }}>Sair</button>}
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
