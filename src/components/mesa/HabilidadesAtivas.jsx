import { useMemo, useState } from 'react';
import { listarHabilidadesAtivas, ORIGENS } from '../../lib/habilidadesAtivas.js';
import { aplicarUso, condicaoDeBola, parseEsforco, parseGex, parseTdA, verificarUso } from '../../regras/habilidades.js';
import { aplicarEstadoDoMotor, estadoDoMotor } from '../../lib/ficha.js';
import { Secao } from '../ui.jsx';
import { SeloBola, SeloTipo, StatLinha, TextoLivro } from '../Habilidade.jsx';
import { descreverDuracao } from '../../regras/habilidades.js';

function CartaoUso({ item, f, atualizar, registrar, toast, existe }) {
  const { h, chave, rotuloOrigem } = item;
  const [extraEsf, setExtraEsf] = useState(false);
  const [reacaoExtra, setReacaoExtra] = useState(false);
  const [usarGex, setUsarGex] = useState(true);
  const esf = parseEsforco(h.esf);
  const tda = parseTdA(h.tda);
  const gex = parseGex(h.gex);
  const opcoes = { extraEsf, reacaoExtra, usarGex };
  const estado = estadoDoMotor(f);
  const { bloqueios, avisos } = verificarUso(estado, h, chave, opcoes);
  const usada = f.usadasFluxo.includes(chave);

  const usar = () => {
    const ctx = { pericias: f.pericias, atributos: f.atributos };
    const r = aplicarUso(estado, h, chave, ctx, opcoes);
    atualizar(aplicarEstadoDoMotor(f, r.estado));
    const dur = r.duracao.tipo === 'tempo' ? ` Duração: ${descreverDuracao(r.duracao)}.` : '';
    toast(`${h.nome} usada.${r.avisos.length ? ` ${r.avisos.join(' ')}` : ''}`);
    registrar(`Usou: ${h.nome}`, `${h.texto || ''}${dur}`.trim());
  };

  return (
    <article className={`rounded border bg-black/40 p-3 ${usada ? 'border-ouro/40 opacity-70' : 'border-linha'}`}>
      <header className="flex flex-wrap items-center gap-2">
        <h4 className="text-[13px] font-bold uppercase tracking-[0.16em]">{h.nome}</h4>
        <SeloTipo h={h} />
        <SeloBola h={h} />
        <span className="legenda ml-auto">{rotuloOrigem}</span>
      </header>
      {h.condicao && <p className="tag-condicao mt-1 text-[12px]">[{h.condicao}]</p>}
      <div className="mt-1"><StatLinha h={h} /></div>
      <details className="mt-2">
        <summary className="cursor-pointer text-[12px] text-ciano">ler habilidade</summary>
        {h.frase && <p className="my-2"><span className="frase">“{h.frase}”</span></p>}
        <div className="mt-2"><TextoLivro texto={h.texto} /></div>
      </details>
      {(esf.extra > 0 || tda.opcional.reacoes > 0 || gex.folegos > 0 || gex.pds > 0) && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-suave">
          {esf.extra > 0 && <label className="flex items-center gap-1.5"><input type="checkbox" checked={extraEsf} onChange={(e) => setExtraEsf(e.target.checked)} />+{esf.extra} PdE (versão melhorada)</label>}
          {tda.opcional.reacoes > 0 && <label className="flex items-center gap-1.5"><input type="checkbox" checked={reacaoExtra} onChange={(e) => setReacaoExtra(e.target.checked)} />+{tda.opcional.reacoes} reação</label>}
          {(gex.folegos > 0 || gex.pds > 0) && <label className="flex items-center gap-1.5"><input type="checkbox" checked={usarGex} onChange={(e) => setUsarGex(e.target.checked)} />pagar G.Ex.</label>}
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-primario btn-mini" disabled={!existe || bloqueios.length > 0} onClick={usar}>
          {usada ? 'Já usada no fluxo' : 'Usar'}
        </button>
        <ul className="text-[11px] text-laranja">
          {[...bloqueios, ...avisos].map((a, i) => <li key={i}>⚠ {a}</li>)}
        </ul>
      </div>
    </article>
  );
}

export function HabilidadesAtivas({ f, atualizar, registrar, toast, existe }) {
  const [origem, setOrigem] = useState('todas');
  const [soUsaveis, setSoUsaveis] = useState(false);
  const todas = useMemo(() => listarHabilidadesAtivas(f), [f.armaId, f.oticaId, f.visoes, f.catalisador?.id, f.nivel, f.habilidadesCategoria, f.talentos, f.talentosNiveis]);

  const visiveis = todas.filter(({ origem: o, h }) => {
    if (origem !== 'todas' && o !== origem) return false;
    if (soUsaveis) {
      const c = condicaoDeBola(h);
      if (c === 'com' && !f.comBola) return false;
      if (c === 'sem' && f.comBola) return false;
    }
    return true;
  });
  const presentes = ORIGENS.filter((o) => todas.some((t) => t.origem === o.id));

  return (
    <Secao titulo="Habilidades ativas" tag={`${visiveis.length} de ${todas.length}`}>
      {todas.length === 0 ? (
        <p className="py-4 text-[13px] text-mudo">Escolha a arma na aba <strong>Personagem</strong> (e ótica, catalisador, categoria e talentos) para ver aqui tudo que você usa ativamente.</p>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <button type="button" aria-pressed={origem === 'todas'} className={`btn btn-mini ${origem === 'todas' ? 'btn-primario' : 'btn-fantasma'}`} onClick={() => setOrigem('todas')}>Todas</button>
            {presentes.map((o) => (
              <button key={o.id} type="button" aria-pressed={origem === o.id} className={`btn btn-mini ${origem === o.id ? 'btn-primario' : 'btn-fantasma'}`} onClick={() => setOrigem(o.id)}>{o.rotulo}</button>
            ))}
            <label className="ml-auto flex items-center gap-2 text-[12px] text-suave">
              <input type="checkbox" checked={soUsaveis} onChange={(e) => setSoUsaveis(e.target.checked)} />
              só as usáveis {f.comBola ? 'com a bola' : 'sem a bola'}
            </label>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {visiveis.map((item) => <CartaoUso key={item.chave} item={item} f={f} atualizar={atualizar} registrar={registrar} toast={toast} existe={existe} />)}
          </div>
          {visiveis.length === 0 && <p className="py-4 text-center text-[13px] text-mudo">Nenhuma habilidade nesse filtro.</p>}
        </>
      )}
    </Secao>
  );
}
