import { Contador } from '../ui.jsx';
import { Termo } from '../Termo.jsx';
import { PERICIAS as PERICIAS_OPCOES } from '../../data/pericias.js';
import { folegoMaximo, pdsMaximo, distanciaChute, distanciaPasse, iniciativa } from '../../lib/ficha.js';
import { LIMITE_PDE } from '../../regras/habilidades.js';
import { fontesDeDistancia } from '../../regras/modificadores.js';

export function BarraRecursos({ f, atualizar }) {
  const fMax = folegoMaximo(f);
  const folego = Math.min(f.folego ?? fMax, fMax);
  const pdsMax = pdsMaximo();
  const item = (rotulo, id, corpo, barra) => (
    <div className="min-w-0">
      <div className="legenda"><Termo id={id}>{rotulo}</Termo></div>
      {corpo}
      {barra !== undefined && <div className="barra mt-1"><i style={{ width: `${barra}%` }} /></div>}
    </div>
  );
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 py-2 sm:grid-cols-4">
      {item('Fôlego', 'folego', (
        <span className="flex items-center gap-2"><Contador valor={folego} max={fMax} rotulo="Fôlego" onMenos={() => atualizar({ folego: folego - 1 })} onMais={() => atualizar({ folego: folego + 1 })} /><span className="text-[13px] text-mudo">/{fMax}</span></span>
      ), fMax ? (folego / fMax) * 100 : 0)}
      {item('Esforço', 'pde', (
        <span className="flex items-center gap-2"><Contador valor={f.pde} rotulo="PdE" onMenos={() => atualizar({ pde: f.pde - 1 })} onMais={() => atualizar({ pde: f.pde + 1 })} /><span className={`text-[13px] ${f.pde >= LIMITE_PDE - 1 ? 'text-laranja' : 'text-mudo'}`}>/{LIMITE_PDE}</span></span>
      ), (f.pde / LIMITE_PDE) * 100)}
      {item('Sorte', 'pds', (
        <span className="flex items-center gap-2"><Contador valor={f.pds} max={pdsMax} rotulo="PdS" onMenos={() => atualizar({ pds: f.pds - 1 })} onMais={() => atualizar({ pds: f.pds + 1 })} /><span className="text-[13px] text-mudo">/{pdsMax}</span></span>
      ), (f.pds / pdsMax) * 100)}
      {item('Chama', 'chama', <Contador valor={f.chama} rotulo="Chama" onMenos={() => atualizar({ chama: f.chama - 1 })} onMais={() => atualizar({ chama: f.chama + 1 })} />)}
    </div>
  );
}

export function Distancias({ f, atualizar }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="cartao">
        <div className="legenda"><Termo id="ddc">Distância de chute</Termo></div>
        <div className="text-2xl font-bold">{distanciaChute(f)}<span className="text-sm text-mudo"> m</span></div>
        {fontesDeDistancia(f.efeitos, 'chute').map((t) => <div key={t} className="text-[13px] text-ciano">⚡ {t}</div>)}
        <select className="entrada mt-1 !py-1 !text-[14px]" value={f.periciaChute} onChange={(e) => atualizar({ periciaChute: e.target.value })} aria-label="Perícia do chute">
          {PERICIAS_OPCOES.map((p) => <option key={p.id} value={p.id}>{p.nome} ({f.pericias[p.id] || 0})</option>)}
        </select>
      </div>
      <div className="cartao">
        <div className="legenda"><Termo id="ddp">Distância de passe</Termo></div>
        <div className="text-2xl font-bold">{distanciaPasse(f)}<span className="text-sm text-mudo"> m</span></div>
        {fontesDeDistancia(f.efeitos, 'passe').map((t) => <div key={t} className="text-[13px] text-ciano">⚡ {t}</div>)}
        <select className="entrada mt-1 !py-1 !text-[14px]" value={f.periciaPasse} onChange={(e) => atualizar({ periciaPasse: e.target.value })} aria-label="Perícia do passe">
          {PERICIAS_OPCOES.map((p) => <option key={p.id} value={p.id}>{p.nome} ({f.pericias[p.id] || 0})</option>)}
        </select>
      </div>
      <div className="cartao">
        <div className="legenda"><Termo id="iniciativa">Iniciativa</Termo></div>
        <div className="text-2xl font-bold">{iniciativa(f)}</div>
        <div className="text-[13px] text-mudo">Momento + Destreza</div>
      </div>
    </div>
  );
}
