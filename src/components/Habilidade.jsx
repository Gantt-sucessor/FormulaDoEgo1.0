import { Fragment } from 'react';
import { condicaoDeBola, somenteUmaVezEmFluxo } from '../regras/habilidades.js';
import { Termo } from './Termo.jsx';
import { chaveDeRotulo } from '../data/glossario.js';

/** Texto do livro: bullets "• " viram lista; [condições] ficam laranja e em itálico. */
export function TextoLivro({ texto, className = '' }) {
  if (!texto) return null;
  const linhas = String(texto).split('\n').filter((l) => l.trim() !== '');
  const marcar = (linha) =>
    linha.split(/(\[[^\]]+\])/g).map((parte, i) =>
      /^\[[^\]]+\]$/.test(parte) ? <span key={i} className="tag-condicao">{parte}</span> : <Fragment key={i}>{parte}</Fragment>,
    );
  const bullets = linhas.filter((l) => l.trim().startsWith('•'));
  const soltas = linhas.filter((l) => !l.trim().startsWith('•'));
  return (
    <div className={`texto-livro ${className}`}>
      {soltas.map((l, i) => <p key={`p${i}`} className="mb-2">{marcar(l)}</p>)}
      {bullets.length > 0 && (
        <ul className="list-none space-y-2">
          {bullets.map((l, i) => (
            <li key={i} className="relative !ml-0 pl-4">
              <span className="absolute left-0 text-ciano">▸</span>
              {marcar(l.replace(/^\s*•\s*/, ''))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const ROTULOS = [['esf', 'Esf.'], ['dis', 'Dis.'], ['dur', 'Dur.'], ['tda', 'TdA'], ['prep', 'Prep.'], ['gex', 'G.Ex.']];

export function StatLinha({ h }) {
  const itens = ROTULOS.filter(([k]) => h[k] && h[k] !== '-');
  if (!itens.length) return null;
  return (
    <div className="stat-linha">
      {itens.map(([k, rotulo]) => <span key={k}><b><Termo id={chaveDeRotulo(rotulo)}>{rotulo}</Termo></b>{h[k]}</span>)}
    </div>
  );
}

const TIPO_COR = {
  'sem bola': 'border-azul text-azul',
  'com bola': 'border-ciano text-ciano',
  variante: 'border-laranja text-laranja',
  fluxo: 'border-ouro text-ouro',
};

export function SeloTipo({ h }) {
  if (!h.tipo) return null;
  return (
    <span className={`rounded-sm border px-1.5 py-px text-[12px] font-semibold uppercase tracking-[0.14em] ${TIPO_COR[h.tipo] || 'border-linha-forte text-suave'}`}>
      <Termo id={h.tipo}>{h.tipo}</Termo>{h.simbolo ? <Termo id={h.simbolo === '✪' ? 'zona_dourada' : h.simbolo === '❖' ? 'reacao_quimica' : ''} className="ml-1">{h.simbolo}</Termo> : null}
    </span>
  );
}

export function SeloBola({ h }) {
  const c = condicaoDeBola(h);
  if (c === 'qualquer' || h.condicao) return null; // a condição já aparece escrita, como no livro
  return <span className="chip">{c === 'com' ? '● com a bola' : '○ sem a bola'}</span>;
}

/** Habilidade no formato do livro: nome, tipo, frase, condição, estatísticas e texto. */
export function HabilidadeLivro({ h, acoes, compacta = false }) {
  return (
    <article className="rounded border border-linha bg-black/40 p-4">
      <header className="mb-1 flex flex-wrap items-center gap-2">
        <h4 className="text-[15px] font-bold uppercase tracking-[0.18em]">{h.nome}</h4>
        <SeloTipo h={h} />
        {somenteUmaVezEmFluxo(h) && h.tipo !== 'fluxo' && <span className="chip"><Termo id="uma_vez_fluxo">1× por fluxo</Termo></span>}
      </header>
      {h.frase && !compacta && <p className="mb-2"><span className="frase">“{h.frase}”</span></p>}
      {h.condicao && <p className="tag-condicao mb-1 text-[14px]">[{h.condicao}]</p>}
      {h.requisito && <p className="mb-1 text-[14px] text-suave">Pré-requisito: {h.requisito}</p>}
      <StatLinha h={h} />
      <div className="mt-2"><TextoLivro texto={h.texto} /></div>
      {acoes && <div className="mt-3">{acoes}</div>}
    </article>
  );
}
