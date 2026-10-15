import { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth.jsx';
import { useToast } from '../lib/toast.jsx';
import { Link } from '../lib/router.jsx';
import { Pagina } from '../components/Layout.jsx';
import { ListaFichas } from '../components/ListaFichas.jsx';
import { apagarFicha, listarTodasFichasDoJogador } from '../api/fichas.js';
import { Confirmar } from '../components/ui.jsx';

export default function Home() {
  const { usuario } = useAuth();
  const toast = useToast();
  const [fichas, setFichas] = useState(null);

  const carregar = () => listarTodasFichasDoJogador(usuario.id).then(setFichas).catch(() => setFichas([]));
  useEffect(() => { carregar(); }, [usuario.id]);

  const apagar = async (f) => {
    if (!Confirmar(`Apagar a ficha "${f.nome_personagem}" de vez? Essa ação não pode ser desfeita.`)) return;
    try { await apagarFicha(f.id); toast('Ficha apagada.'); carregar(); } catch (e) { toast(e.message, 'erro'); }
  };

  return (
    <Pagina>
      <section className="py-8 text-center sm:py-12">
        <div className="legenda mb-3">Sistema de RPG · Fórmula do Ego 1.0</div>
        <h1 className="text-[clamp(34px,11vw,72px)] font-bold uppercase leading-[1.05] tracking-[0.18em] glow-azul">
          Fórmula<br />do <span className="text-ciano glow-ciano">Ego</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] text-suave">Fichas, mesa e salas ao vivo. Cada rolagem, habilidade e efeito aparece em tempo real para o mestre.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link para="/ficha/nova" className="btn btn-primario">Nova ficha</Link>
          <Link para="/fichas" className="btn">Entrar numa sala</Link>
          <Link para="/mestre" className="btn btn-ouro">Painel do mestre</Link>
        </div>
      </section>
      <section className="painel">
        <div className="mb-3 flex items-center justify-between"><span className="titulo-caixa">Minhas fichas</span><span className="legenda">{fichas?.length ?? '…'}</span></div>
        {fichas === null ? <p className="py-4 text-mudo">Carregando…</p> : <ListaFichas fichas={fichas} aoApagar={apagar} />}
      </section>
    </Pagina>
  );
}
