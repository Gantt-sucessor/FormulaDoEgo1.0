import { useState } from 'react';
import { JOGADAS } from '../../data/jogadas.js';
import { PERICIAS } from '../../data/pericias.js';
import { ATRIBUTOS } from '../../data/atributos.js';
import { Secao, Contador } from '../ui.jsx';
import { Termo } from '../Termo.jsx';
import { nomeAtributo, valorPericiaDaJogada, sinal } from '../../lib/ficha.js';
import { som } from '../../lib/som.js';
import { modsAtivos, modsParaJogada, consumirEfeitos, descreverMod } from '../../regras/modificadores.js';

const GRUPOS = { chutes: 'Chutes', passes: 'Passes', dribles: 'Dribles', defesa: 'Defesa', goleiro: 'Goleiro', outras: 'Outras' };

function rotuloPericiaComposta(j) {
  return `${j.pericias_compostas.map((id) => PERICIAS.find((p) => p.id === id)?.nome || id).join(' + ')} ÷ ${j.divisor}`;
}

export function Jogadas({ f, rolar, atualizar, toast, existe, abrirFita }) {
  const [vant, setVant] = useState(0);
  const [desv, setDesv] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [escolhendo, setEscolhendo] = useState(null);
  const [livreAtr, setLivreAtr] = useState('potencia');
  const [livrePer, setLivrePer] = useState('');
  const [livreNome, setLivreNome] = useState('');

  const executar = async (args, jogada = null) => {
    const auto = jogada ? modsParaJogada(f.efeitos, jogada) : null;
    try {
      const resultado = await rolar({
        ...args,
        vantagens: vant + (auto?.vantagens || 0), desvantagens: desv + (auto?.desvantagens || 0), bonus: bonus + (auto?.bonus || 0),
        notas: auto?.fontes.map((x) => `${x.fonte}: ${x.texto}`),
      });
      if (auto?.consumir.length) atualizar((atual) => ({ efeitos: consumirEfeitos(atual.efeitos, auto.consumir) }));
      som.rolagem(resultado);
      setVant(0); setDesv(0); setBonus(0);
      abrirFita();
    } catch (e) {
      toast(e.message || 'Não deu pra enviar a rolagem. Confere a internet.', 'erro');
    }
  };

  const clicar = (j) => {
    const def = PERICIAS.find((p) => p.id === j.pericia);
    const vp = valorPericiaDaJogada(f, j);
    if (def) return executar({ nomeJogada: j.nome, valorAtributo: f.atributos[def.atributo] || 0, valorPericia: vp, atributoNome: nomeAtributo(def.atributo), periciaNome: def.nome }, j);
    if (j.atributo) return executar({ nomeJogada: j.nome, valorAtributo: f.atributos[j.atributo] || 0, valorPericia: vp, atributoNome: nomeAtributo(j.atributo), periciaNome: rotuloPericiaComposta(j) }, j);
    if (j.atributo_opcoes) return setEscolhendo(j.id);
    return null;
  };

  const algumMod = vant || desv || bonus;
  const mods = modsAtivos(f.efeitos).filter((m) => m.vantagens || m.desvantagens || m.bonus);

  return (
    <Secao titulo="Jogadas" tag="clique para rolar">
      <div className={`mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 rounded border p-3 ${algumMod ? 'border-ciano bg-ciano/5' : 'border-linha'}`}>
        <span className="legenda">Na próxima rolagem</span>
        {[['Vantagens', vant, setVant, 0], ['Desvantagens', desv, setDesv, 0], ['Bônus', bonus, setBonus, -99]].map(([rotulo, v, set, min]) => (
          <span key={rotulo} className="flex items-center gap-2 text-[14px]">
            {rotulo === 'Bônus' ? rotulo : <Termo id="vantagem">{rotulo}</Termo>}
            <Contador valor={v} min={min} rotulo={rotulo} onMenos={() => set(v - 1)} onMais={() => set(v + 1)} formato={rotulo === 'Bônus' ? sinal : undefined} />
          </span>
        ))}
        {algumMod > 0 || algumMod < 0 ? <button type="button" className="btn btn-mini btn-fantasma" onClick={() => { setVant(0); setDesv(0); setBonus(0); }}>zerar</button> : null}
      </div>
      {mods.length > 0 && (
        <div className="mb-4 rounded border border-ciano/40 bg-ciano/5 p-3 text-[14px]">
          <div className="legenda mb-1 !text-ciano">⚡ Bônus automáticos ativos</div>
          <ul className="space-y-1 text-suave">
            {mods.map((m, i) => <li key={i}><strong className="text-texto">{m.fonte}:</strong> {descreverMod(m)}</li>)}
          </ul>
          <p className="mt-1 text-[13px] text-mudo">Entram sozinhos nas rolagens abaixo. Os de “próxima jogada” saem depois de usados.</p>
        </div>
      )}
      {!existe && <p className="mb-3 text-[15px] text-laranja">Crie a ficha (aba Personagem) para poder rolar.</p>}
      {Object.entries(JOGADAS).map(([grupo, lista]) => (
        <div key={grupo} className="mb-4">
          <div className="legenda mb-2">{GRUPOS[grupo] || grupo}</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {lista.map((j) => {
              const def = PERICIAS.find((p) => p.id === j.pericia);
              const rolavel = !!def || !!j.pericias_compostas;
              if (escolhendo === j.id) {
                return (
                  <div key={j.id} className="cartao cartao-ativo">
                    <div className="mb-1 text-[14px] font-semibold">{j.nome} — atributo:</div>
                    <div className="flex gap-1">
                      {j.atributo_opcoes.map((a) => (
                        <button key={a} type="button" className="btn btn-mini" onClick={() => {
                          setEscolhendo(null);
                          executar({ nomeJogada: j.nome, valorAtributo: f.atributos[a] || 0, valorPericia: valorPericiaDaJogada(f, j), atributoNome: nomeAtributo(a), periciaNome: rotuloPericiaComposta(j) }, j);
                        }}>{nomeAtributo(a)}</button>
                      ))}
                    </div>
                  </div>
                );
              }
              const auto = rolavel ? modsParaJogada(f.efeitos, j) : null;
              const temAuto = auto && (auto.vantagens || auto.desvantagens || auto.bonus);
              return (
                <button key={j.id} type="button" className={`cartao ${temAuto ? 'cartao-ativo' : ''}`} disabled={!rolavel || !existe} onClick={() => clicar(j)} title={j.anormalidade}>
                  <div className="text-[15px] font-semibold">{j.nome}</div>
                  {temAuto ? (
                    <div className="mt-0.5 text-[13px] font-semibold text-ciano">
                      ⚡ {[auto.vantagens && `${auto.vantagens} vant.`, auto.desvantagens && `${auto.desvantagens} desv.`, auto.bonus && sinal(auto.bonus)].filter(Boolean).join(' · ')}
                    </div>
                  ) : null}
                  <div className="text-[13px] text-suave">{def ? def.nome : j.pericias_compostas ? rotuloPericiaComposta(j) : '—'} · <Termo id="dj">Dj</Termo> {j.dj ?? '—'}</div>
                  <div className="text-[12px] text-mudo">{j.acao}</div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <details className="mt-2">
        <summary className="cursor-pointer text-[14px] font-semibold uppercase tracking-[0.14em] text-ciano">Rolagem livre (atributo + perícia)</summary>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <label><span className="campo-label">Atributo</span>
            <select className="entrada" value={livreAtr} onChange={(e) => setLivreAtr(e.target.value)}>
              {ATRIBUTOS.map((a) => <option key={a.id} value={a.id}>{a.nome} ({sinal(f.atributos[a.id] || 0)})</option>)}
            </select></label>
          <label><span className="campo-label">Perícia</span>
            <select className="entrada" value={livrePer} onChange={(e) => setLivrePer(e.target.value)}>
              <option value="">— nenhuma —</option>
              {PERICIAS.map((p) => <option key={p.id} value={p.id}>{p.nome} ({f.pericias[p.id] || 0})</option>)}
            </select></label>
          <label><span className="campo-label">Nome da jogada</span><input className="entrada" value={livreNome} onChange={(e) => setLivreNome(e.target.value)} placeholder="ex: Chute curvo" /></label>
        </div>
        <button type="button" className="btn btn-primario mt-3" disabled={!existe} onClick={() => executar({
          nomeJogada: livreNome.trim() || 'Jogada', valorAtributo: f.atributos[livreAtr] || 0, valorPericia: livrePer ? (f.pericias[livrePer] || 0) : 0,
          atributoNome: nomeAtributo(livreAtr), periciaNome: livrePer ? PERICIAS.find((p) => p.id === livrePer)?.nome : null,
        })}>Rolar</button>
      </details>
    </Secao>
  );
}
