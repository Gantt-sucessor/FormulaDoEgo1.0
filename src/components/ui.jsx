import { useState } from 'react';
import { caminhoIconeArma } from '../data/icones-armas.js';

export const Titulo = ({ children, className = '' }) => <span className={`titulo-caixa ${className}`}>{children}</span>;

export function Secao({ titulo, tag, children, id, className = '' }) {
  return (
    <section id={id} className={`painel scroll-mt-40 ${className}`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Titulo>{titulo}</Titulo>
        {tag && <span className="legenda">{tag}</span>}
      </div>
      {children}
    </section>
  );
}

export const Passo = ({ children }) => <p className="mb-3 text-[14px] text-suave">{children}</p>;

export function Contador({ valor, onMenos, onMais, max, min = 0, rotulo, formato }) {
  return (
    <span className="contador">
      <button type="button" aria-label={`${rotulo || ''} menos`} onClick={onMenos} disabled={valor <= min}>−</button>
      <span>{formato ? formato(valor) : valor}</span>
      <button type="button" aria-label={`${rotulo || ''} mais`} onClick={onMais} disabled={max !== undefined && valor >= max}>+</button>
    </span>
  );
}

export function Campo({ rotulo, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="campo-label">{rotulo}</span>
      {children}
    </label>
  );
}

export function Selecao({ valor, onChange, opcoes, vazio, className = '', ...resto }) {
  return (
    <select className={`entrada ${className}`} value={valor ?? ''} onChange={(e) => onChange(e.target.value)} {...resto}>
      {vazio !== undefined && <option value="">{vazio}</option>}
      {opcoes.map((o) => <option key={o.id} value={o.id} disabled={o.desabilitado}>{o.nome}</option>)}
    </select>
  );
}

export function IconeArma({ id, nome, tamanho = 40 }) {
  const [falhou, setFalhou] = useState(false);
  const caminho = caminhoIconeArma(id);
  const estilo = { width: tamanho, height: tamanho };
  if (!caminho || falhou) {
    return (
      <span className="inline-flex shrink-0 items-center justify-center rounded-full border border-linha-forte bg-black font-bold text-ciano" style={estilo} aria-hidden>
        {(nome || '?').charAt(0).toUpperCase()}
      </span>
    );
  }
  return <img src={caminho} alt={nome} style={estilo} className="shrink-0 rounded-full border border-linha-forte object-cover" onError={() => setFalhou(true)} />;
}

export const Estrelas = ({ n }) => <span className="text-ouro tracking-widest" aria-label={`dificuldade ${n} de 5`}>{'★'.repeat(n)}<span className="text-linha-forte">{'★'.repeat(5 - n)}</span></span>;

export function Vazio({ children }) {
  return <p className="py-6 text-center text-[15px] text-mudo">{children}</p>;
}

export function Confirmar(mensagem) {
  return typeof window !== 'undefined' && window.confirm(mensagem);
}
