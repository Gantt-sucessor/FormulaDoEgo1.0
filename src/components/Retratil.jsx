import { useState } from 'react';
import { getTextosAbertos, setTextosAbertos } from '../lib/local.js';

/** Estado "textos abertos/recolhidos" de uma lista de habilidades, lembrado entre visitas. */
export function useTextosAbertos(lista, inicial = false) {
  const [aberto, setAberto] = useState(() => (inicial ? true : getTextosAbertos(lista)));
  const mudar = (v) => { setAberto(v); setTextosAbertos(lista, v); };
  return [aberto, mudar];
}

export function BotaoRetrair({ aberto, onChange, className = '' }) {
  return (
    <button type="button" className={`btn btn-mini btn-fantasma ${className}`} aria-pressed={aberto} onClick={() => onChange(!aberto)}>
      {aberto ? '▾ Recolher textos' : '▸ Expandir textos'}
    </button>
  );
}

/**
 * Lista de habilidades com botão geral "Expandir/Recolher textos". Os cartões recebem `aberto`
 * (use key={String(aberto)} neles para o botão geral valer sobre as escolhas de cada cartão).
 */
export function Retratil({ lista, inicial = false, children }) {
  const [aberto, mudar] = useTextosAbertos(lista, inicial);
  return (
    <div>
      <div className="mb-3 flex justify-end"><BotaoRetrair aberto={aberto} onChange={mudar} /></div>
      {children(aberto)}
    </div>
  );
}
