import { useState } from 'react';
import { novaRodada, passarTurno, reacoesMaximas } from '../../regras/habilidades.js';
import { estadoDoMotor, aplicarEstadoDoMotor, folegoMaximo } from '../../lib/ficha.js';
import { Secao } from '../ui.jsx';
import { Termo } from '../Termo.jsx';
import { som } from '../../lib/som.js';

function Acao({ rotulo, gasta, onClick, sub, termo }) {
  return (
    <button type="button" onClick={onClick} className={`cartao ${gasta ? 'cartao-gasto' : 'cartao-ativo'}`} aria-pressed={gasta}>
      <div className="text-[14px] font-semibold uppercase tracking-[0.12em]">{termo ? <Termo id={termo}>{rotulo}</Termo> : rotulo}</div>
      <div className="text-[13px] text-suave">{gasta ? 'gasta' : sub || 'disponível'}</div>
    </button>
  );
}

export function Turno({ f, atualizar, registrar, toast, somenteMestre = false }) {
  const [aliviar, setAliviar] = useState(false);
  const a = f.acoes;
  const alternar = (campo) => atualizar({ acoes: { ...a, [campo]: !a[campo] } });
  const alternarReacao = (i) => atualizar({ acoes: { ...a, regulares: a.regulares.map((g, j) => (j === i ? !g : g)) } });
  const nReacoes = reacoesMaximas(f.efeitos);

  const avisarExpirados = (lista) => {
    if (lista.length) toast(`Terminou: ${lista.map((e) => e.nome || e.id).join(', ')}`);
  };

  const passar = () => {
    const r = passarTurno(estadoDoMotor(f));
    atualizar(aplicarEstadoDoMotor(f, r.estado));
    som.tocar('turno');
    avisarExpirados(r.expirados);
  };

  const nova = () => {
    const r = novaRodada(estadoDoMotor(f), { aliviarPdE: aliviar, folegoMax: folegoMaximo(f) });
    atualizar(aplicarEstadoDoMotor(f, r.estado));
    avisarExpirados(r.expirados);
    som.tocar('rodada');
    registrar(`Rodada ${r.estado.rodada}`, aliviar ? 'Nova rodada: ações liberadas, fôlegos restaurados e −2 PdE.' : 'Nova rodada: ações liberadas e fôlegos restaurados.');
    toast(`Rodada ${r.estado.rodada} — ações e fôlegos restaurados.`);
  };

  return (
    <Secao titulo="Turno e ações" tag={<><Termo id="rodada">rodada</Termo> {f.rodada} · <Termo id="turno">turno</Termo> {f.turno}</>}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {somenteMestre ? (
          <p className="flex items-center gap-2 rounded border border-ouro/30 bg-ouro/5 px-3 py-1.5 text-[14px] text-suave">
            <span aria-hidden>🔒</span> Quem passa o turno e a rodada é o mestre da campanha — suas ações e fôlegos são atualizados por ele.
          </p>
        ) : (
          <>
            <button type="button" className="btn btn-primario" onClick={nova}>Nova rodada</button>
            <button type="button" className="btn" onClick={passar}>Passar turno</button>
            <label className="flex items-center gap-2 text-[14px] text-suave">
              <input type="checkbox" checked={aliviar} onChange={(e) => setAliviar(e.target.checked)} />
              −2 PdE ao fim da rodada
            </label>
          </>
        )}
        <div className="ml-auto flex overflow-hidden rounded border border-linha-forte" role="group" aria-label="Posse de bola">
          <button type="button" aria-pressed={f.comBola} onClick={() => atualizar({ comBola: true })}
            className={`px-3 py-1.5 text-[14px] font-semibold uppercase tracking-[0.12em] ${f.comBola ? 'bg-ciano text-black' : 'bg-black text-suave'}`}>● Com bola</button>
          <button type="button" aria-pressed={!f.comBola} onClick={() => atualizar({ comBola: false })}
            className={`px-3 py-1.5 text-[14px] font-semibold uppercase tracking-[0.12em] ${!f.comBola ? 'bg-azul text-white' : 'bg-black text-suave'}`}>○ Sem bola</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Acao termo="tatica" rotulo="Tática" gasta={a.tatica} onClick={() => alternar('tatica')} />
        <Acao termo="egoista" rotulo="Egoísta" gasta={a.egoista} onClick={() => alternar('egoista')} />
        {f.nivel >= 8 && <Acao termo="egoista" rotulo="Egoísta extra" gasta={a.egoistaExtra} onClick={() => alternar('egoistaExtra')} sub="nível 8" />}
        <Acao termo="movimento" rotulo="Movimento" gasta={a.movimento} onClick={() => alternar('movimento')} />
        {Array.from({ length: nReacoes }, (_, i) => (
          <Acao key={i} termo="reacao" rotulo={`Reação ${i + 1}`} gasta={a.regulares[i]} onClick={() => alternarReacao(i)} />
        ))}
      </div>
    </Secao>
  );
}
