import { ARMAS } from '../data/armas.js';
import { IconeArma } from './ui.jsx';
import { Link } from '../lib/router.jsx';

export function ListaFichas({ fichas, aoApagar, aoAdicionar, mostrarCampanha = true }) {
  if (!fichas.length) return <p className="py-4 text-[15px] text-mudo">Nenhuma ficha aqui ainda.</p>;
  return (
    <ul className="space-y-2">
      {fichas.map((f) => {
        const arma = ARMAS.find((a) => a.id === f.arma_id);
        return (
          <li key={f.id} className="flex items-stretch gap-2">
            <Link para={`/ficha/${f.id}`} className="cartao flex min-w-0 flex-1 items-center gap-3 no-underline">
              <IconeArma id={arma?.id} nome={arma?.nome || f.nome_personagem} tamanho={40} />
              <span className="min-w-0 flex-1">
                <span className="block break-words text-[16px] font-bold uppercase tracking-[0.1em]">{f.nome_personagem}</span>
                <span className="block break-words text-[13px] text-suave">
                  Nível {f.nivel ?? 1}{arma ? ` · ${arma.nome}` : ''}{mostrarCampanha ? ` · ${f.campanhas ? f.campanhas.nome : 'sem campanha'}` : ''}
                </span>
              </span>
            </Link>
            {aoAdicionar && <button type="button" className="btn btn-mini shrink-0" onClick={() => aoAdicionar(f)}>Adicionar</button>}
            {aoApagar && <button type="button" className="btn btn-mini btn-perigo shrink-0" aria-label={`Apagar ${f.nome_personagem}`} onClick={() => aoApagar(f)}>✕</button>}
          </li>
        );
      })}
    </ul>
  );
}
