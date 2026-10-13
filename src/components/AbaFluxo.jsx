import { ATRIBUTOS } from '../data/atributos.js';
import { JOGADAS } from '../data/jogadas.js';
import {
  TIPOS_AURA, EFEITOS_AURA, MARCAS_DESPERTAR, limiteMarcasDespertar, podeMarcarDificuldade, custoAtributoComplexo, custoTotalComplexo,
  CUSTO_POR_VANTAGEM_COMPLEXO, MAX_VANTAGENS_COMPLEXO, MAX_BONUS_COMPLEXO, NIVEL_MINIMO_FLUXO_COMPLEXO,
} from '../data/fluxo.js';
import { TALENTOS_EVOLUTIVOS, TALENTOS_SIMPLES, TALENTOS_RAZOAVEIS, TALENTOS_COMPLEXOS, MAX_SLOTS_TALENTOS } from '../data/talentos.js';
import { Secao, Passo, Campo, Selecao, Contador } from './ui.jsx';
import { StatLinha, TextoLivro } from './Habilidade.jsx';

const GRUPOS_TALENTO = [
  ['Evolutivos (1 chama/nível)', TALENTOS_EVOLUTIVOS],
  ['Simples (1 chama)', TALENTOS_SIMPLES],
  ['Razoáveis (2 chamas)', TALENTOS_RAZOAVEIS],
  ['Complexos (3 chamas)', TALENTOS_COMPLEXOS],
];
const GRUPOS_MARCA = [
  ['facil', 'Fáceis (+10% cada)'], ['media', 'Médias (+20% cada)'], ['dificil', 'Difíceis (+30% cada)'], ['impossivel', 'Impossíveis (+40% cada)'],
];
const GRUPOS_JOGADA = { chutes: 'Chutes', passes: 'Passes', dribles: 'Dribles', defesa: 'Defesa', goleiro: 'Goleiro', outras: 'Outras' };

export function AbaFluxo({ ficha, toast }) {
  const { f, atualizar } = ficha;
  const fl = f.fluxo;
  const setFluxo = (patch) => atualizar({ fluxo: { ...fl, ...patch } });
  const aura = TIPOS_AURA.find((t) => t.id === fl.auraTipo);
  const complexoLiberado = f.nivel >= NIVEL_MINIMO_FLUXO_COMPLEXO;
  const tipo = fl.tipo === 'complexo' && !complexoLiberado ? 'basico' : fl.tipo;

  const usadosBasico = Object.values(fl.pontosApice).reduce((a, b) => a + (b || 0), 0);
  const custoComplexo = custoTotalComplexo(fl.apiceComplexo);

  const alternarTalento = (id) => {
    if (f.talentos.includes(id)) return atualizar({ talentos: f.talentos.filter((x) => x !== id) });
    if (f.talentos.length >= MAX_SLOTS_TALENTOS) return toast(`Você já preencheu os ${MAX_SLOTS_TALENTOS} espaços de talentos impetuosos.`, 'erro');
    return atualizar({ talentos: [...f.talentos, id] });
  };

  const mudarComplexo = (id, novo) => setFluxo({ apiceComplexo: { ...fl.apiceComplexo, [id]: novo } });

  const limiteMarcas = limiteMarcasDespertar(f.nivel, fl.auraTipo);

  return (
    <div className="space-y-4">
      <Secao titulo="Talentos impetuosos" tag={`${f.talentos.length}/${MAX_SLOTS_TALENTOS} slots`}>
        <Passo>Marque os talentos que você guarda. Os escolhidos aparecem em “Habilidades ativas”, na aba Na mesa.</Passo>
        {GRUPOS_TALENTO.map(([titulo, lista]) => (
          <div key={titulo} className="mb-4">
            <div className="legenda mb-2">{titulo}</div>
            <div className="grid gap-3 lg:grid-cols-2">
              {lista.map((t) => {
                const marcado = f.talentos.includes(t.id);
                const nivel = f.talentosNiveis[t.id] || 1;
                return (
                  <article key={t.id} className={`rounded border p-3 ${marcado ? 'border-ciano bg-ciano/5' : 'border-linha bg-black/40'}`}>
                    <header className="flex items-center gap-2">
                      <h4 className="text-[13px] font-bold uppercase tracking-[0.14em]">{t.nome}</h4>
                      <button type="button" className={`btn btn-mini ml-auto ${marcado ? 'btn-primario' : ''}`} aria-pressed={marcado} onClick={() => alternarTalento(t.id)}>{marcado ? '✓ Guardado' : 'Guardar'}</button>
                    </header>
                    {t.frase && <p className="my-1"><span className="frase">“{t.frase}”</span></p>}
                    <StatLinha h={t} />
                    <div className="mt-2">
                      {t.niveis ? (
                        <>
                          <select className="entrada mb-2 !w-auto !py-1 !text-[12px]" value={nivel} aria-label={`Nível de ${t.nome}`}
                            onChange={(e) => atualizar({ talentosNiveis: { ...f.talentosNiveis, [t.id]: Number(e.target.value) } })}>
                            {t.niveis.map((_, i) => <option key={i} value={i + 1}>Nível {i + 1}</option>)}
                          </select>
                          <TextoLivro texto={t.niveis[nivel - 1]} />
                        </>
                      ) : <TextoLivro texto={t.texto} />}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </Secao>

      <Secao titulo="Fluxo">
        <div className="grid gap-3 sm:grid-cols-2">
          <Campo rotulo="Tipo de fluxo">
            <Selecao valor={tipo} onChange={(v) => setFluxo({ tipo: v, pontosApice: {}, apiceComplexo: {}, jogadasBonus: [] })} opcoes={[
              { id: 'basico', nome: 'Básico (6 pontos de ápice)' },
              { id: 'complexo', nome: complexoLiberado ? 'Complexo (10 pontos de ápice)' : `Complexo — libera no nível ${NIVEL_MINIMO_FLUXO_COMPLEXO}`, desabilitado: !complexoLiberado },
            ]} />
          </Campo>
          <Campo rotulo="Tipo de Aura">
            <Selecao valor={fl.auraTipo} onChange={(v) => setFluxo({ auraTipo: v, efeitosAuraSelecionados: [] })} vazio="— nenhuma escolhida —" opcoes={TIPOS_AURA} />
          </Campo>
        </div>
        {aura && (
          <div className="mt-3 rounded border border-linha bg-black/40 p-3 text-[12px]">
            <p className="mb-2 text-suave">{aura.tema}</p>
            <p><strong className="text-ciano">% necessário:</strong> {aura.percentual_necessario}% · <strong className="text-ciano">Efeitos de Aura:</strong> {aura.efeitos_permitidos} · <strong className="text-ciano">Marcas extras:</strong> {aura.marcas_adicionais}</p>
          </div>
        )}

        {tipo === 'basico' ? (
          <div className="mt-4">
            <Passo>Pontos de ápice — cada ponto dá +1 de bônus fixo no atributo enquanto o fluxo estiver ativo. ({usadosBasico}/6 usados)</Passo>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ATRIBUTOS.map((a) => (
                <div key={a.id} className="cartao flex items-center justify-between !p-2">
                  <span className="text-[12px]">{a.nome}</span>
                  <Contador valor={fl.pontosApice[a.id] || 0} max={(fl.pontosApice[a.id] || 0) + (usadosBasico >= 6 ? 0 : 1)} rotulo={a.nome}
                    onMenos={() => setFluxo({ pontosApice: { ...fl.pontosApice, [a.id]: Math.max(0, (fl.pontosApice[a.id] || 0) - 1) } })}
                    onMais={() => usadosBasico < 6 && setFluxo({ pontosApice: { ...fl.pontosApice, [a.id]: (fl.pontosApice[a.id] || 0) + 1 } })} />
                </div>
              ))}
            </div>
            <Passo>Escolha até 3 jogadas que ganham +1 vantagem no fluxo básico. ({fl.jogadasBonus.length}/3)</Passo>
            {Object.entries(JOGADAS).map(([grupo, lista]) => (
              <div key={grupo} className="mb-3">
                <div className="legenda mb-1">{GRUPOS_JOGADA[grupo]}</div>
                <div className="flex flex-wrap gap-2">
                  {lista.map((j) => {
                    const marcada = fl.jogadasBonus.includes(j.id);
                    return (
                      <button key={j.id} type="button" aria-pressed={marcada} className={`chip cursor-pointer ${marcada ? '!border-ciano !text-ciano' : ''}`}
                        onClick={() => {
                          if (marcada) return setFluxo({ jogadasBonus: fl.jogadasBonus.filter((x) => x !== j.id) });
                          if (fl.jogadasBonus.length >= 3) return toast('Só dá para escolher 3 jogadas no fluxo básico.', 'erro');
                          return setFluxo({ jogadasBonus: [...fl.jogadasBonus, j.id] });
                        }}>{j.nome}</button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <Passo>O 1º atributo é grátis; cada atributo extra custa 3 pontos para desbloquear. Cada vantagem custa {CUSTO_POR_VANTAGEM_COMPLEXO} pontos e cada +2 de bônus custa 2. ({custoComplexo}/10 usados)</Passo>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {ATRIBUTOS.map((a) => {
                const incluido = Object.prototype.hasOwnProperty.call(fl.apiceComplexo, a.id);
                const d = fl.apiceComplexo[a.id] || { vantagens: 0, bonus: 0 };
                const tentar = (novo) => {
                  const teste = { ...fl.apiceComplexo, [a.id]: novo };
                  if (custoTotalComplexo(teste) > 10) return toast('Sem pontos de ápice suficientes.', 'erro');
                  return mudarComplexo(a.id, novo);
                };
                return (
                  <div key={a.id} className="cartao">
                    <label className="flex cursor-pointer items-center justify-between">
                      <span><input type="checkbox" className="mr-2" checked={incluido} onChange={(e) => {
                        if (e.target.checked) tentar({ vantagens: 0, bonus: 0 });
                        else { const c = { ...fl.apiceComplexo }; delete c[a.id]; setFluxo({ apiceComplexo: c }); }
                      }} />{a.nome}</span>
                      {incluido && <span className="text-[11px] text-mudo">{custoAtributoComplexo(d.vantagens, d.bonus)} pts</span>}
                    </label>
                    {incluido && (
                      <div className="mt-2 space-y-1 text-[12px]">
                        <div className="flex items-center justify-between">Vantagens<Contador valor={d.vantagens} max={MAX_VANTAGENS_COMPLEXO} rotulo="Vantagens" onMenos={() => mudarComplexo(a.id, { ...d, vantagens: d.vantagens - 1 })} onMais={() => tentar({ ...d, vantagens: d.vantagens + 1 })} /></div>
                        <div className="flex items-center justify-between">Bônus<Contador valor={d.bonus} max={MAX_BONUS_COMPLEXO} rotulo="Bônus" formato={(v) => `+${v}`} onMenos={() => mudarComplexo(a.id, { ...d, bonus: d.bonus - 2 })} onMais={() => tentar({ ...d, bonus: d.bonus + 2 })} /></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Secao>

      <Secao titulo="Efeitos de Aura" tag={aura ? `${fl.efeitosAuraSelecionados.length}/${aura.efeitos_permitidos}` : 'escolha a Aura'}>
        <div className="grid gap-2 md:grid-cols-2">
          {EFEITOS_AURA.map((ef) => {
            const marcado = fl.efeitosAuraSelecionados.includes(ef.id);
            return (
              <button key={ef.id} type="button" className={`cartao ${marcado ? 'cartao-ativo' : ''}`} onClick={() => {
                if (marcado) return setFluxo({ efeitosAuraSelecionados: fl.efeitosAuraSelecionados.filter((x) => x !== ef.id) });
                if (!aura) return toast('Escolha um tipo de Aura primeiro.', 'erro');
                if (fl.efeitosAuraSelecionados.length >= aura.efeitos_permitidos) return toast(`Sua Aura só permite ${aura.efeitos_permitidos} efeito(s).`, 'erro');
                return setFluxo({ efeitosAuraSelecionados: [...fl.efeitosAuraSelecionados, ef.id] });
              }}>
                <div className="text-[13px] font-semibold uppercase tracking-[0.1em]">{ef.nome}</div>
                <div className="text-[12px] text-suave">{ef.texto}</div>
              </button>
            );
          })}
        </div>
      </Secao>

      <Secao titulo="Marcas de despertar" tag={`${fl.marcasConhecidas.length}/${limiteMarcas} conhecidas`}>
        <Passo>Marque as que você <strong>conhece</strong> (limitado por nível e Aura). Elas aparecem na aba Na mesa para somar a % do fluxo.</Passo>
        {GRUPOS_MARCA.map(([chave, titulo]) => (
          <div key={chave} className="mb-4">
            <div className="legenda mb-2">{titulo}</div>
            <div className="grid gap-2 md:grid-cols-2">
              {MARCAS_DESPERTAR[chave].map((m) => {
                const marcada = fl.marcasConhecidas.includes(m.id);
                return (
                  <label key={m.id} className={`cartao cursor-pointer ${marcada ? 'cartao-ativo' : ''}`}>
                    <input type="checkbox" className="mr-2" checked={marcada} onChange={(e) => {
                      if (e.target.checked) {
                        if (!podeMarcarDificuldade(chave, fl.marcasConhecidas, f.nivel, fl.auraTipo)) return toast('Sem slot para essa dificuldade — confira a reserva da Aura e as marcas livres do nível.', 'erro');
                        return setFluxo({ marcasConhecidas: [...fl.marcasConhecidas, m.id] });
                      }
                      const usos = { ...fl.marcasUsos }; delete usos[m.id];
                      return setFluxo({ marcasConhecidas: fl.marcasConhecidas.filter((x) => x !== m.id), marcasUsos: usos });
                    }} />
                    <strong className="text-[13px]">{m.nome}</strong>
                    <div className="text-[12px] text-suave">{m.texto}</div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </Secao>
    </div>
  );
}
