import { useState } from 'react';

export const SECOES_MESA = [
  { id: 'turno', rotulo: 'Turno e ações' },
  { id: 'habilidades', rotulo: 'Habilidades' },
  { id: 'talentos', rotulo: 'Talentos' },
  { id: 'passivas', rotulo: 'Passivas' },
  { id: 'efeitos', rotulo: 'Efeitos' },
  { id: 'jogadas', rotulo: 'Jogadas' },
  { id: 'distancias', rotulo: 'Distâncias' },
  { id: 'fluxo', rotulo: 'Fluxo' },
  { id: 'catalisador', rotulo: 'Catalisador' },
];

export const PRESETS_MESA = [
  { id: 'combate', rotulo: 'Combate', secoes: ['turno', 'habilidades', 'talentos', 'efeitos', 'jogadas'] },
  { id: 'consulta', rotulo: 'Consulta', secoes: ['habilidades', 'talentos', 'passivas'] },
  { id: 'tudo', rotulo: 'Tudo', secoes: SECOES_MESA.map((s) => s.id) },
];

export const SECOES_PADRAO = PRESETS_MESA[0].secoes;

/** "O que mostrar na mesa": o jogador liga e desliga cada seção na hora e a escolha fica salva. */
export function FiltroMesa({ visiveis, onChange }) {
  const [aberto, setAberto] = useState(false);
  const alternar = (id) => onChange(visiveis.includes(id) ? visiveis.filter((x) => x !== id) : SECOES_MESA.map((s) => s.id).filter((x) => x === id || visiveis.includes(x)));
  const preset = PRESETS_MESA.find((p) => p.secoes.length === visiveis.length && p.secoes.every((s) => visiveis.includes(s)));
  return (
    <div className="rounded border border-linha bg-painel/60 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="legenda !text-ciano" aria-expanded={aberto} onClick={() => setAberto((v) => !v)}>
          {aberto ? '▾' : '▸'} O que mostrar na mesa <span className="text-mudo">· {visiveis.length} de {SECOES_MESA.length}</span>
        </button>
        <span className="ml-auto flex flex-wrap gap-1.5" role="group" aria-label="Atalhos">
          {PRESETS_MESA.map((p) => (
            <button key={p.id} type="button" aria-pressed={preset?.id === p.id} className={`btn btn-mini ${preset?.id === p.id ? 'btn-primario' : 'btn-fantasma'}`} onClick={() => onChange(p.secoes)}>{p.rotulo}</button>
          ))}
        </span>
      </div>
      {aberto && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SECOES_MESA.map((s) => {
            const on = visiveis.includes(s.id);
            return (
              <button key={s.id} type="button" aria-pressed={on} className={`chip cursor-pointer ${on ? '!border-ciano !text-ciano' : ''}`} onClick={() => alternar(s.id)}>
                {on ? '●' : '○'} {s.rotulo}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
