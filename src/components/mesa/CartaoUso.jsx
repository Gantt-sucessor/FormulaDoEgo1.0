import { useState } from 'react';
import { aplicarUso, descreverDuracao, parseEsforco, parseGex, parseTdA, verificarUso } from '../../regras/habilidades.js';
import { aplicarEstadoDoMotor, estadoDoMotor } from '../../lib/ficha.js';
import { descreverMod } from '../../regras/modificadores.js';
import { PERICIAS } from '../../data/pericias.js';
import { som } from '../../lib/som.js';
import { SeloBola, SeloTipo, StatLinha, TextoLivro } from '../Habilidade.jsx';

const nomePericia = (id) => PERICIAS.find((p) => p.id === id)?.nome || id;

function contagem(e) {
  const partes = [];
  if (typeof e.rodadas === 'number' && e.rodadas > 0) partes.push(`${e.rodadas} rodada${e.rodadas > 1 ? 's' : ''}`);
  if (typeof e.turnos === 'number' && e.turnos > 0) partes.push(`${e.turnos} turno${e.turnos > 1 ? 's' : ''}`);
  return partes.join(' + ');
}

/** Cartão de uma habilidade/talento: texto do livro, custos, bônus automáticos e o botão Usar. */
export function CartaoUso({ item, f, atualizar, registrar, toast, existe, aberto = true, depois = null, texto = null, nota = null }) {
  const { h, chave, rotuloOrigem } = item;
  const [extraEsf, setExtraEsf] = useState(false);
  const [reacaoExtra, setReacaoExtra] = useState(false);
  const [usarGex, setUsarGex] = useState(true);
  const mesEscolha = (h.mods || []).find((m) => m.escolha);
  const [escolha, setEscolha] = useState(() => (mesEscolha ? mesEscolha.escolha.entre.slice(0, mesEscolha.escolha.qtd) : []));
  const esf = parseEsforco(h.esf);
  const tda = parseTdA(h.tda);
  const gex = parseGex(h.gex);
  const opcoes = { extraEsf, reacaoExtra, usarGex, escolha: mesEscolha ? escolha : undefined };
  const estado = estadoDoMotor(f);
  const { bloqueios, avisos } = verificarUso(estado, h, chave, opcoes);
  const usada = f.usadasFluxo.includes(chave);
  const ativo = f.efeitos.find((e) => e.id === `hab:${chave}`);
  const modsPrevistos = (h.mods || []).map(({ escolha: esc, ...m }) => (esc ? { ...m, pericias: escolha } : m));

  const alternarEscolha = (id) => {
    const q = mesEscolha.escolha.qtd;
    setEscolha((atual) => {
      if (atual.includes(id)) return atual.filter((x) => x !== id);
      return atual.length >= q ? [...atual.slice(1), id] : [...atual, id];
    });
  };

  const usar = () => {
    const ctx = { pericias: f.pericias, atributos: f.atributos };
    const r = aplicarUso(estado, h, chave, ctx, opcoes);
    atualizar(aplicarEstadoDoMotor(f, r.estado));
    som.tocar('usar');
    const dur = r.duracao.tipo === 'tempo' ? ` Duração: ${descreverDuracao(r.duracao)}.` : '';
    const bonus = modsPrevistos.length ? ` Bônus automático: ${modsPrevistos.map(descreverMod).join('; ')}.` : '';
    toast(`${h.nome} usada.${modsPrevistos.length ? ' Bônus aplicado nas jogadas.' : ''}${r.avisos.length ? ` ${r.avisos.join(' ')}` : ''}`);
    registrar(`Usou: ${h.nome}`, `${h.texto || ''}${dur}${bonus}`.trim());
  };

  const encerrar = () => {
    atualizar({ efeitos: f.efeitos.filter((e) => e.id !== `hab:${chave}`) });
    som.tocar('encerrar');
    toast(`${h.nome} encerrada.`);
  };

  return (
    <article className={`rounded border p-4 ${ativo ? 'border-ciano bg-ciano/5' : usada ? 'border-ouro/40 bg-black/40 opacity-70' : 'border-linha bg-black/40'}`}>
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h4 className="text-[16px] font-bold uppercase tracking-[0.16em]">{h.nome}</h4>
        <SeloTipo h={h} />
        <SeloBola h={h} />
        <span className="legenda ml-auto">{rotuloOrigem}</span>
      </header>
      {ativo && (
        <p className="mt-2 flex flex-wrap items-center gap-2 text-[14px] font-semibold text-ciano">
          ● Ativo{contagem(ativo) ? ` — ${contagem(ativo)}` : ativo.duracao ? ` — ${ativo.duracao}` : ''}
          <button type="button" className="btn btn-mini btn-fantasma ml-auto" onClick={encerrar}>Encerrar</button>
        </p>
      )}
      {h.frase && <p className="mt-3"><span className="frase">“{h.frase}”</span></p>}
      {h.condicao && <p className="tag-condicao mt-3 text-[14px]">[{h.condicao}]</p>}
      {h.requisito && <p className="mt-2 text-[14px] text-suave">{h.requisito}</p>}
      <div className="mt-3"><StatLinha h={h} /></div>
      <details key={String(aberto)} open={aberto} className="mt-4 border-t border-linha pt-3">
        <summary className="cursor-pointer text-[14px] text-ciano">texto da habilidade</summary>
        <div className="mt-3"><TextoLivro texto={texto ?? h.texto} /></div>
        {depois}
      </details>
      {nota && modsPrevistos.length === 0 && <p className="mt-3 text-[13px] text-mudo">{nota}</p>}
      {modsPrevistos.length > 0 && (
        <div className="mt-4 rounded border border-ciano/30 bg-ciano/5 p-3 text-[14px]">
          <div className="legenda mb-1 !text-ciano">⚡ Bônus automático ao usar</div>
          <ul className="space-y-0.5 text-suave">{modsPrevistos.map((m, i) => <li key={i}>{descreverMod(m)}</li>)}</ul>
        </div>
      )}
      {mesEscolha && (
        <fieldset className="mt-3">
          <legend className="campo-label">Escolha {mesEscolha.escolha.qtd} perícia{mesEscolha.escolha.qtd > 1 ? 's' : ''}</legend>
          <div className="flex flex-wrap gap-2">
            {mesEscolha.escolha.entre.map((id) => (
              <button key={id} type="button" aria-pressed={escolha.includes(id)} className={`chip cursor-pointer ${escolha.includes(id) ? '!border-ciano !text-ciano' : ''}`} onClick={() => alternarEscolha(id)}>{nomePericia(id)}</button>
            ))}
          </div>
        </fieldset>
      )}
      {(esf.extra > 0 || tda.opcional.reacoes > 0 || gex.folegos > 0 || gex.pds > 0) && (
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[14px] text-suave">
          {esf.extra > 0 && <label className="flex items-center gap-1.5"><input type="checkbox" checked={extraEsf} onChange={(e) => setExtraEsf(e.target.checked)} />+{esf.extra} PdE (versão melhorada)</label>}
          {tda.opcional.reacoes > 0 && <label className="flex items-center gap-1.5"><input type="checkbox" checked={reacaoExtra} onChange={(e) => setReacaoExtra(e.target.checked)} />+{tda.opcional.reacoes} reação</label>}
          {(gex.folegos > 0 || gex.pds > 0) && <label className="flex items-center gap-1.5"><input type="checkbox" checked={usarGex} onChange={(e) => setUsarGex(e.target.checked)} />pagar G.Ex.</label>}
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-primario btn-mini" disabled={!existe || bloqueios.length > 0 || (mesEscolha && escolha.length === 0)} onClick={usar}>
          {usada ? 'Já usada no fluxo' : ativo ? 'Usar de novo' : 'Usar'}
        </button>
        <ul className="space-y-0.5 text-[14px] text-laranja">
          {[...bloqueios, ...avisos].map((a, i) => <li key={i}>⚠ {a}</li>)}
        </ul>
      </div>
    </article>
  );
}
