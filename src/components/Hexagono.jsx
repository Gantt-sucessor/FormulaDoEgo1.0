import { ATRIBUTOS } from '../data/atributos.js';
import { Contador } from './ui.jsx';
import { sinal } from '../lib/ficha.js';

const MIN = -1;
const MAX = 4;
const ANGULOS = [-90, -30, 30, 90, 150, 210];
const CX = 150;
const CY = 150;
const RAIO = 108;

export function Hexagono({ atributos, onChange, somenteLeitura = false }) {
  const pontos = ATRIBUTOS.map((a, i) => {
    const r = (ANGULOS[i] * Math.PI) / 180;
    return { ...a, x: CX + RAIO * Math.cos(r), y: CY + RAIO * Math.sin(r) };
  });
  const val = (id) => atributos?.[id] ?? 0;
  // Polígono do valor: raio proporcional ao atributo (−1…4)
  const poligono = pontos.map((p, i) => {
    const r = (ANGULOS[i] * Math.PI) / 180;
    const rel = (val(p.id) - MIN + 0.5) / (MAX - MIN + 0.5);
    return `${CX + RAIO * rel * Math.cos(r)},${CY + RAIO * rel * Math.sin(r)}`;
  }).join(' ');

  return (
    <div>
      <svg viewBox="0 0 300 300" className="mx-auto block w-full max-w-[320px]" role="img" aria-label="Hexágono de atributos">
        <polygon className="hex-outline" points={pontos.map((p) => `${p.x},${p.y}`).join(' ')} />
        {pontos.map((p) => <line key={p.id} className="hex-spoke" x1={CX} y1={CY} x2={p.x} y2={p.y} />)}
        <polygon points={poligono} fill="rgba(34,225,255,0.18)" stroke="#22e1ff" strokeWidth="1.5" />
        {pontos.map((p) => (
          <g key={p.id} className={`hex-node ${val(p.id) !== 0 ? 'cheio' : ''}`}>
            <circle cx={p.x} cy={p.y} r="27" />
            <text className="v" x={p.x} y={p.y - 4} textAnchor="middle" dominantBaseline="central">{sinal(val(p.id))}</text>
            <text className="l" x={p.x} y={p.y + 12} textAnchor="middle" dominantBaseline="central">{p.nome.slice(0, 3).toUpperCase()}</text>
          </g>
        ))}
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {ATRIBUTOS.map((a) => (
          <div key={a.id} className="cartao flex flex-col items-center gap-1 !p-2 text-center" title={a.descricao}>
            <span className="legenda">{a.nome}</span>
            {somenteLeitura
              ? <strong className="text-lg">{sinal(val(a.id))}</strong>
              : (
                <Contador
                  valor={val(a.id)} min={MIN} max={MAX} rotulo={a.nome} formato={sinal}
                  onMenos={() => onChange({ ...atributos, [a.id]: val(a.id) - 1 })}
                  onMais={() => onChange({ ...atributos, [a.id]: val(a.id) + 1 })}
                />
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
