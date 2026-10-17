import { useMemo, useState } from 'react';
import { listarPassivas, GRUPOS_PASSIVAS } from '../../lib/passivas.js';
import { Secao } from '../ui.jsx';
import { TextoLivro } from '../Habilidade.jsx';
import { BotaoRetrair, useTextosAbertos } from '../Retratil.jsx';

/** Passivas e características sempre ligadas, agrupadas — fica na mesa para ninguém caçar na aba Personagem. */
export function PassivasMesa({ f }) {
  const itens = useMemo(() => listarPassivas(f), [f.armaId, f.oticaId, f.visoes, f.tendPrincipal, f.tendSecundaria, f.tendPericia, f.catalisador?.id, f.nivel, f.categoriaId, f.arquetipoId, f.recompensa6]);
  const [fechado, setFechado] = useState({});
  const [textos, setTextos] = useTextosAbertos('pas');
  const alternar = (g) => setFechado((s) => ({ ...s, [g]: !s[g] }));

  return (
    <Secao titulo="Passivas e características" tag={`${itens.length} sempre ligadas`}>
      {itens.length === 0 ? (
        <p className="py-4 text-[15px] text-mudo">Escolha arma, ótica e tendências na aba <strong>Personagem</strong> para ver aqui o que funciona sem gastar ação.</p>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end"><BotaoRetrair aberto={textos} onChange={setTextos} /></div>
          {GRUPOS_PASSIVAS.map((g) => {
            const doGrupo = itens.filter((i) => i.grupo === g.id);
            if (!doGrupo.length) return null;
            const aberto = !fechado[g.id];
            return (
              <div key={g.id}>
                <button type="button" className="mb-3 flex w-full items-center gap-2 text-left" aria-expanded={aberto} onClick={() => alternar(g.id)}>
                  <span className="legenda !text-ciano">{aberto ? '▾' : '▸'} {g.rotulo}</span>
                  <span className="h-px flex-1 bg-linha" />
                  <span className="legenda">{doGrupo.length}</span>
                </button>
                {aberto && (
                  <div className="grid gap-4 lg:grid-cols-2 min-[1500px]:grid-cols-3">
                    {doGrupo.map((i) => (
                      <article key={i.chave} className="rounded border border-linha bg-black/40 p-4">
                        <details key={String(textos)} open={textos} className="retratil">
                          <summary className="cursor-pointer list-none">
                            <div className="legenda mb-1">{i.rotulo}</div>
                            {i.nome && <h4 className="text-[16px] font-bold uppercase tracking-[0.14em]">{i.nome}</h4>}
                          </summary>
                          <div className="mt-3"><TextoLivro texto={i.texto} /></div>
                        </details>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Secao>
  );
}
