import { ATRIBUTOS } from '../data/atributos.js';
import { PERICIAS, MAX_PONTOS_PERICIA } from '../data/pericias.js';
import { Contador } from './ui.jsx';

/** Perícias agrupadas por atributo, com limite de pontos (nível + categoria + tendência). */
export function Pericias({ pericias, onChange, maximo, somenteLeitura = false }) {
  const usados = Object.values(pericias || {}).reduce((a, b) => a + (b || 0), 0);
  const excedeu = usados > maximo;
  const ajustar = (id, delta) => {
    const atual = pericias?.[id] || 0;
    const novo = atual + delta;
    if (novo < 0 || novo > MAX_PONTOS_PERICIA) return;
    if (delta > 0 && usados >= maximo) return;
    onChange({ ...pericias, [id]: novo });
  };
  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-4 @md:grid-cols-2">
        {ATRIBUTOS.map((a) => (
          <div key={a.id}>
            <div className="legenda mb-1 border-b border-linha pb-1">{a.nome}</div>
            <ul>
              {PERICIAS.filter((p) => p.atributo === a.id).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2 py-1" title={p.descricao}>
                  <span className="text-[13px]">{p.nome}</span>
                  {somenteLeitura
                    ? <strong>{pericias?.[p.id] || 0}</strong>
                    : <Contador valor={pericias?.[p.id] || 0} max={MAX_PONTOS_PERICIA} rotulo={p.nome} onMenos={() => ajustar(p.id, -1)} onMais={() => ajustar(p.id, 1)} />}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {!somenteLeitura && (
        <div className={`mt-4 border-t border-linha pt-3 text-[13px] ${excedeu ? 'text-perigo' : 'text-suave'}`}>
          <strong className="text-texto">{usados}</strong> / {maximo} pontos distribuídos
          {excedeu && ' — acima do limite do nível'}
          {!excedeu && usados < maximo && ` — ${maximo - usados} sobrando`}
        </div>
      )}
    </div>
  );
}
