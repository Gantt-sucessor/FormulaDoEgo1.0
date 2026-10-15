import { useMemo, useState } from 'react';
import { listarHabilidadesAtivas, TODOS_TALENTOS } from '../../lib/habilidadesAtivas.js';
import { MAX_SLOTS_TALENTOS } from '../../data/talentos.js';
import { Secao } from '../ui.jsx';
import { CartaoUso } from './CartaoUso.jsx';

/** Os talentos guardados, prontos para usar. Ao usar, o bônus entra sozinho nas jogadas e na distância. */
export function TalentosMesa({ f, atualizar, registrar, toast, existe }) {
  const [textosAbertos, setTextosAbertos] = useState(true);
  const itens = useMemo(() => listarHabilidadesAtivas(f).filter((t) => t.origem === 'talento'), [f.talentos, f.talentosNiveis, f.nivel]);

  const mudarNivel = (id, nivel) => atualizar({ talentosNiveis: { ...f.talentosNiveis, [id]: nivel } });

  return (
    <Secao titulo="Talentos" tag={`${f.talentos.length}/${MAX_SLOTS_TALENTOS} guardados`}>
      {itens.length === 0 ? (
        <p className="py-4 text-[15px] text-mudo">Você ainda não guardou nenhum talento. Escolha até {MAX_SLOTS_TALENTOS} na aba <strong>Talentos &amp; Fluxo</strong> e eles aparecem aqui, prontos para usar.</p>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <p className="text-[14px] text-suave">Ao usar um talento, o bônus dele entra sozinho nas jogadas (⚡) e a duração é contada pelos turnos.</p>
            <button type="button" className="btn btn-mini btn-fantasma ml-auto" onClick={() => setTextosAbertos((v) => !v)}>{textosAbertos ? 'Recolher textos' : 'Mostrar textos'}</button>
          </div>
          <div className="grid gap-4 lg:grid-cols-2 min-[1500px]:grid-cols-3">
            {itens.map((item) => {
              const t = TODOS_TALENTOS.find((x) => x.id === item.h.id);
              const nivel = f.talentosNiveis?.[item.h.id] || 1;
              const evolutivo = !!t?.niveis;
              const itemNivel = evolutivo ? { ...item, h: { ...item.h }, rotuloOrigem: `Talento · nível ${nivel}` } : item;
              const depois = evolutivo ? (
                <div className="mt-4 border-t border-linha pt-3">
                  <label className="flex items-center gap-2 text-[14px] text-suave">Nível do talento
                    <select className="entrada !w-auto !py-1" value={nivel} onChange={(e) => mudarNivel(item.h.id, Number(e.target.value))}>
                      {t.niveis.map((_, i) => <option key={i} value={i + 1}>Nível {i + 1}</option>)}
                    </select>
                  </label>
                  <details className="mt-3">
                    <summary className="cursor-pointer text-[14px] text-ciano">ver todos os níveis</summary>
                    <ul className="mt-2 space-y-2 text-[14px] text-suave">
                      {t.niveis.map((n, i) => <li key={i} className={i + 1 === nivel ? 'text-texto' : ''}><strong>Nível {i + 1}:</strong> {n}</li>)}
                    </ul>
                  </details>
                </div>
              ) : null;
              return (
                <CartaoUso key={item.chave} item={itemNivel} f={f} atualizar={atualizar} registrar={registrar} toast={toast} existe={existe} aberto={textosAbertos}
                  texto={evolutivo ? t.niveis[nivel - 1] : null} depois={depois}
                  nota="Este talento não tem número fixo para somar nas jogadas — siga o texto acima." />
              );
            })}
          </div>
        </>
      )}
    </Secao>
  );
}
