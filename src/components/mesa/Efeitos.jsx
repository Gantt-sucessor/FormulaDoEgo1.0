import { useState } from 'react';
import { CATALOGO_EFEITOS, CATALOGO_EFEITOS_CLASSE, aplicarEfeito, buscarEfeito, removerEfeito } from '../../regras/efeitos.js';
import { Secao } from '../ui.jsx';
import { descreverMod } from '../../regras/modificadores.js';

function restante(e) {
  const partes = [];
  if (typeof e.rodadas === 'number' && e.rodadas > 0) partes.push(`${e.rodadas} rodada${e.rodadas > 1 ? 's' : ''}`);
  if (typeof e.turnos === 'number' && e.turnos > 0) partes.push(`${e.turnos} turno${e.turnos > 1 ? 's' : ''}`);
  return partes.join(' + ');
}

export function Efeitos({ f, atualizar }) {
  const [custom, setCustom] = useState('');
  const alternar = (id) => atualizar({ efeitos: aplicarEfeito(f.efeitos, id) });
  const remover = (id) => atualizar({ efeitos: removerEfeito(f.efeitos, id) });
  const editarTexto = (id, duracao) => atualizar({ efeitos: f.efeitos.map((e) => (e.id === id ? { ...e, duracao } : e)) });
  const diminuir = (id) => atualizar({
    efeitos: f.efeitos.flatMap((e) => {
      if (e.id !== id) return [e];
      if (e.quantidade > 1) return [{ ...e, quantidade: e.quantidade - 1 }];
      return [];
    }),
  });

  return (
    <Secao titulo="Efeitos e condições" tag={`${f.efeitos.length} ativo${f.efeitos.length === 1 ? '' : 's'}`}>
      {f.efeitos.length === 0 ? (
        <p className="mb-3 text-[15px] text-mudo">Nenhum efeito ativo. Habilidades usadas que aplicam efeitos aparecem aqui com a contagem regressiva.</p>
      ) : (
        <ul className="mb-4 space-y-2">
          {f.efeitos.map((e) => {
            const def = buscarEfeito(e.id);
            const negativo = def && Object.prototype.hasOwnProperty.call(CATALOGO_EFEITOS.find((x) => x.id === e.id) || {}, 'tipo') && CATALOGO_EFEITOS.find((x) => x.id === e.id)?.tipo === 'negativo';
            const contagem = restante(e);
            return (
              <li key={e.id} className={`rounded border bg-black/40 p-2.5 ${negativo ? 'border-perigo/40' : 'border-linha'}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <strong className={`text-[15px] uppercase tracking-[0.1em] ${negativo ? 'text-perigo' : 'text-ciano'}`}>
                    {e.nome || def?.nome || e.id}{e.quantidade > 1 ? ` ×${e.quantidade}` : ''}
                  </strong>
                  {contagem ? <span className="chip border-ciano text-ciano">⏳ {contagem}</span> : (
                    <input className="entrada !w-44 !py-1 !text-[14px]" placeholder="duração (anote)" value={e.duracao || ''} onChange={(ev) => editarTexto(e.id, ev.target.value)} aria-label="Duração" />
                  )}
                  <span className="ml-auto flex gap-1">
                    {e.quantidade > 1 && <button type="button" className="btn btn-mini btn-fantasma" onClick={() => diminuir(e.id)} title="Tirar 1 acúmulo">−1</button>}
                    <button type="button" className="btn btn-mini btn-perigo" onClick={() => remover(e.id)} aria-label={`Remover ${e.nome || def?.nome || e.id}`}>✕</button>
                  </span>
                </div>
                {Array.isArray(e.mods) && e.mods.length > 0 && <p className="mt-1 text-[14px] font-semibold text-ciano">⚡ {e.mods.map(descreverMod).join(' · ')}</p>}
                {(def?.texto || e.texto) && <p className="mt-1 line-clamp-3 text-[14px] text-suave">{def?.texto || e.texto}</p>}
              </li>
            );
          })}
        </ul>
      )}
      <details>
        <summary className="cursor-pointer text-[14px] font-semibold uppercase tracking-[0.14em] text-ciano">+ Marcar efeito</summary>
        {[['Negativos', CATALOGO_EFEITOS.filter((x) => x.tipo === 'negativo')], ['Positivos', CATALOGO_EFEITOS.filter((x) => x.tipo === 'positivo')], ['De classe', CATALOGO_EFEITOS_CLASSE]].map(([titulo, lista]) => (
          <div key={titulo} className="mt-3">
            <div className="legenda mb-1">{titulo}</div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {lista.map((ef) => {
                const ativo = f.efeitos.find((e) => e.id === ef.id);
                return (
                  <button key={ef.id} type="button" title={ef.texto} onClick={() => alternar(ef.id)}
                    className={`cartao !py-1.5 ${ativo ? 'cartao-ativo' : ''}`}>
                    <div className="text-[14px] font-semibold">{ef.nome}{ativo?.quantidade > 1 ? ` ×${ativo.quantidade}` : ''}</div>
                    <div className="text-[12px] text-mudo">{ef.acumulativo ? 'empilha' : 'ativar'}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <div className="mt-3 flex gap-2">
          <input className="entrada" placeholder="Outro efeito (ex: Adaptado, Subjugado…)" value={custom} onChange={(e) => setCustom(e.target.value)} />
          <button type="button" className="btn" onClick={() => {
            const nome = custom.trim();
            if (!nome) return;
            atualizar({ efeitos: [...f.efeitos, { id: `personalizado_${Date.now()}`, nome, quantidade: 1, duracao: '' }] });
            setCustom('');
          }}>+ Adicionar</button>
        </div>
      </details>
    </Secao>
  );
}
