import { useMemo, useState } from 'react';
import { listarHabilidadesAtivas, ORIGENS } from '../../lib/habilidadesAtivas.js';
import { condicaoDeBola } from '../../regras/habilidades.js';
import { Secao } from '../ui.jsx';
import { CartaoUso } from './CartaoUso.jsx';
import { BotaoRetrair, useTextosAbertos } from '../Retratil.jsx';

export function HabilidadesAtivas({ f, atualizar, registrar, toast, existe }) {
  const [origem, setOrigem] = useState('todas');
  const [soUsaveis, setSoUsaveis] = useState(false);
  const [textosAbertos, setTextosAbertos] = useTextosAbertos('hab');
  const todas = useMemo(() => listarHabilidadesAtivas(f).filter((t) => t.origem !== 'talento'), [f.armaId, f.oticaId, f.visoes, f.catalisador?.id, f.nivel, f.habilidadesCategoria, f.talentos, f.talentosNiveis]);

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
        <p className="py-4 text-[15px] text-mudo">Escolha a arma na aba <strong>Personagem</strong> (e ótica, catalisador, categoria e talentos) para ver aqui tudo que você usa ativamente.</p>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <button type="button" aria-pressed={origem === 'todas'} className={`btn btn-mini ${origem === 'todas' ? 'btn-primario' : 'btn-fantasma'}`} onClick={() => setOrigem('todas')}>Todas</button>
            {presentes.map((o) => (
              <button key={o.id} type="button" aria-pressed={origem === o.id} className={`btn btn-mini ${origem === o.id ? 'btn-primario' : 'btn-fantasma'}`} onClick={() => setOrigem(o.id)}>{o.rotulo}</button>
            ))}
            <BotaoRetrair aberto={textosAbertos} onChange={setTextosAbertos} className="ml-auto" />
            <label className="flex items-center gap-2 text-[14px] text-suave">
              <input type="checkbox" checked={soUsaveis} onChange={(e) => setSoUsaveis(e.target.checked)} />
              só as usáveis {f.comBola ? 'com a bola' : 'sem a bola'}
            </label>
          </div>
          <div className="grid gap-4 lg:grid-cols-2 min-[1500px]:grid-cols-3">
            {visiveis.map((item) => <CartaoUso key={item.chave} item={item} f={f} atualizar={atualizar} registrar={registrar} toast={toast} existe={existe} aberto={textosAbertos} />)}
          </div>
          {visiveis.length === 0 && <p className="py-4 text-center text-[15px] text-mudo">Nenhuma habilidade nesse filtro.</p>}
        </>
      )}
    </Secao>
  );
}
