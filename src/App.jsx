import { AuthProvider, useAuth } from './lib/auth.jsx';
import { RouterProvider, casar, useRouter } from './lib/router.jsx';
import { ToastProvider } from './lib/toast.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Fichas from './pages/Fichas.jsx';
import Ficha from './pages/Ficha.jsx';
import Sala from './pages/Sala.jsx';
import Mestre from './pages/Mestre.jsx';
import FichaPublica from './pages/FichaPublica.jsx';

function Rotas() {
  const { caminho } = useRouter();
  const { usuario, carregando } = useAuth();

  // A ficha compartilhada abre sem login
  const publica = casar('/publica/:id', caminho);
  if (publica) return <FichaPublica id={publica.id} />;

  if (carregando) return <p className="py-24 text-center text-mudo">Carregando…</p>;
  if (!usuario) return <Login />;

  let p;
  if (caminho === '/') return <Home />;
  if (caminho === '/fichas') return <Fichas />;
  if ((p = casar('/ficha/:id', caminho))) return <Ficha key={p.id} id={p.id} />;
  if (caminho === '/sala') return <Sala />;
  if ((p = casar('/sala/:codigo', caminho))) return <Sala key={p.codigo} codigo={p.codigo.toUpperCase()} />;
  if (caminho === '/mestre') return <Mestre />;
  if ((p = casar('/mestre/:codigo', caminho))) return <Mestre key={p.codigo} codigo={p.codigo.toUpperCase()} />;
  return <Home />;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <RouterProvider>
          <Rotas />
        </RouterProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
