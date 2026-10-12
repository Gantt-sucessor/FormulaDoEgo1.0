import { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth.jsx';
import { useToast } from '../lib/toast.jsx';
import { Link, useRouter } from '../lib/router.jsx';
import { useFicha } from '../lib/useFicha.js';
import { getAbaSalva, setAbaSalva } from '../lib/local.js';
import { ARMAS } from '../data/armas.js';
import { oticaDe } from '../lib/ficha.js';
import { Pagina } from '../components/Layout.jsx';
import { IconeArma } from '../components/ui.jsx';
import { BarraRecursos } from '../components/mesa/Recursos.jsx';
import { AbaMesa } from '../components/AbaMesa.jsx';
import { AbaPersonagem } from '../components/AbaPersonagem.jsx';
import { AbaFluxo } from '../components/AbaFluxo.jsx';
import { Fita } from '../components/Fita.jsx';

const ABAS = [['mesa', 'Na mesa', '⚔'], ['personagem', 'Personagem', '☰'], ['fluxo', 'Talentos & Fluxo', '≋']];
const STATUS = { nova: 'ainda não criada', pendente: 'alterações não salvas…', salvando: 'salvando…', salvo: 'salvo ✓', 'sem-nome': 'sem nome — não salvo', erro: 'erro ao salvar' };

export default function Ficha({ id }) {
  const { usuario } = useAuth();
  const toast = useToast();
  const { ir } = useRouter();
  const ficha = useFicha(id, usuario);
  const [aba, setAba] = useState(getAbaSalva);
  const [sinalFita, setSinalFita] = useState(0);
  const { f, existe, registro, campanha, status } = ficha;

  useEffect(() => { document.title = f.nome ? `${f.nome} — Fórmula do Ego` : 'Ficha — Fórmula do Ego'; }, [f.nome]);
  useEffect(() => { if (id === 'nova') setAba('personagem'); }, [id]);

  const mudarAba = (a) => { setAba(a); setAbaSalva(a); window.scrollTo({ top: 0 }); };

  const criarFicha = async () => {
    try {
      const row = await ficha.criar();
      toast('Ficha criada! A partir de agora tudo salva sozinho.');
      ir(`/ficha/${row.id}`, { substituir: true });
    } catch (e) {
      toast(e.message || 'Não deu pra salvar a ficha.', 'erro');
    }
  };

  const compartilhar = async () => {
    const link = `${window.location.origin}/publica/${registro.id}`;
    try { await navigator.clipboard.writeText(link); toast('Link copiado! Quem tiver o link vê a ficha (somente leitura).'); }
    catch { window.prompt('Copie o link para compartilhar a ficha:', link); }
  };

  if (ficha.carregando) return <Pagina><p className="py-16 text-center text-mudo">Carregando ficha…</p></Pagina>;
  if (ficha.erroCarga) return <Pagina><div className="painel text-center"><h2 className="titulo-pagina mb-2">Ficha não encontrada</h2><p className="mb-4 text-suave">{ficha.erroCarga}</p><Link para="/fichas" className="btn">← minhas fichas</Link></div></Pagina>;

  const arma = ARMAS.find((a) => a.id === f.armaId);
  const otica = oticaDe(f);

  return (
    <Pagina larga>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconeArma id={arma?.id} nome={arma?.nome || f.nome} tamanho={52} />
          <div>
            <div className="legenda">{existe ? 'Ficha' : 'Novo personagem'}{campanha ? ` · ${campanha.nome}` : ''}</div>
            <h1 className="titulo-pagina !text-[clamp(18px,4.5vw,28px)]">{f.nome || 'Sem nome'}</h1>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {arma && <span className="chip">{arma.nome}</span>}
              {otica && <span className="chip">{otica.nome}</span>}
              <span className="chip">Nível {f.nivel}</span>
              {!campanha && <span className="chip">sem campanha</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] ${status === 'erro' ? 'text-perigo' : 'text-mudo'}`} role="status">{STATUS[status]}</span>
          {existe && <button type="button" className="btn btn-mini" onClick={compartilhar}>🔗 Compartilhar</button>}
          <Link para="/fichas" className="btn btn-mini btn-fantasma" onClick={() => ficha.salvarAgora()}>← fichas</Link>
        </div>
      </div>

      {/* Abas (desktop) + recursos grudados no topo */}
      <div className="sticky top-[45px] z-20 -mx-3 border-b border-linha bg-fundo/95 px-3 backdrop-blur sm:-mx-5 sm:px-5">
        <div className="hidden sm:block" role="tablist" aria-label="Partes da ficha">
          {ABAS.map(([k, r]) => <button key={k} type="button" role="tab" className="aba" aria-selected={aba === k} onClick={() => mudarAba(k)}>{r}</button>)}
        </div>
        <BarraRecursos f={f} atualizar={ficha.atualizar} />
      </div>

      <div className="mt-4">
        {aba === 'mesa' && <AbaMesa ficha={ficha} toast={toast} abrirFita={() => setSinalFita((n) => n + 1)} />}
        {aba === 'personagem' && <AbaPersonagem ficha={ficha} toast={toast} criarFicha={criarFicha} />}
        {aba === 'fluxo' && <AbaFluxo ficha={ficha} toast={toast} />}
      </div>

      {/* Abas (celular): barra fixa embaixo, ao alcance do polegar */}
      <nav className="pb-seguro fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-linha-forte bg-fundo/95 backdrop-blur sm:hidden" role="tablist" aria-label="Partes da ficha">
        {ABAS.map(([k, r, icone]) => (
          <button key={k} type="button" role="tab" aria-selected={aba === k} onClick={() => mudarAba(k)}
            className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] ${aba === k ? 'text-ciano' : 'text-mudo'}`}>
            <span className="text-lg leading-none">{icone}</span>{r.replace(' & ', ' & ')}
          </button>
        ))}
      </nav>

      <Fita
        historico={ficha.historico}
        abrirSinal={sinalFita}
        aoRolarAvulso={ficha.rolarAvulso}
      />
    </Pagina>
  );
}
