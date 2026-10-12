import { ARMAS } from '../data/armas.js';
import { CATEGORIAS } from '../data/categorias.js';
import { TIPOS_AURA, EFEITOS_AURA } from '../data/fluxo.js';
import { CATALISADORES } from '../data/catalisadores.js';
import { Secao, IconeArma } from './ui.jsx';
import { Hexagono } from './Hexagono.jsx';
import { Pericias } from './Pericias.jsx';
import { ArmaDetalhe } from './ArmaDetalhe.jsx';
import { HabilidadeLivro, TextoLivro } from './Habilidade.jsx';
import { buscarEfeito } from '../regras/efeitos.js';
import { listarHabilidadesAtivas } from '../lib/habilidadesAtivas.js';
import {
  fichaDoBanco, folegoMaximo, pdsMaximo, iniciativa, distanciaChute, distanciaPasse, oticaDe, tendenciaPrincipalDe, tendenciaSecundariaDe, categoriaDe, nivelCategoria,
} from '../lib/ficha.js';

function Stat({ rotulo, valor, max }) {
  return (
    <div className="cartao !p-2 text-center">
      <div className="legenda">{rotulo}</div>
      <div className="text-xl font-bold">{valor}{max !== undefined && <span className="text-sm text-mudo">/{max}</span>}</div>
    </div>
  );
}

/** Ficha completa, somente leitura (link público e painel do mestre). */
export function FichaLeitura({ row }) {
  const f = fichaDoBanco(row);
  const arma = ARMAS.find((a) => a.id === f.armaId);
  const otica = oticaDe(f);
  const tp = tendenciaPrincipalDe(f);
  const ts = tendenciaSecundariaDe(f);
  const cat = categoriaDe(f);
  const arq = cat?.arquetipos.find((a) => a.id === f.arquetipoId);
  const aura = TIPOS_AURA.find((t) => t.id === f.fluxo.auraTipo);
  const catalisador = CATALISADORES.find((c) => c.id === f.catalisador.id);
  const ativas = listarHabilidadesAtivas(f);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <IconeArma id={arma?.id} nome={arma?.nome || f.nome} tamanho={56} />
        <div>
          <h2 className="titulo-pagina !text-[clamp(18px,4.5vw,28px)]">{f.nome}</h2>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <span className="chip">Nível {f.nivel}</span>{arma && <span className="chip">{arma.nome}</span>}{otica && <span className="chip">{otica.nome}</span>}
            {cat && <span className="chip">{cat.nome}{arq ? ` — ${arq.nome}` : ''}</span>}
            {f.fluxo.ativo && <span className="chip !border-ouro !text-ouro">● em fluxo</span>}
          </div>
        </div>
      </div>

      <Secao titulo="Status">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          <Stat rotulo="Fôlego" valor={Math.min(f.folego ?? 0, folegoMaximo(f))} max={folegoMaximo(f)} />
          <Stat rotulo="PdE" valor={f.pde} max={8} />
          <Stat rotulo="PdS" valor={f.pds} max={pdsMaximo()} />
          <Stat rotulo="Chama" valor={f.chama} />
          <Stat rotulo="Iniciativa" valor={iniciativa(f)} />
          <Stat rotulo="DdC / DdP" valor={`${distanciaChute(f)} / ${distanciaPasse(f)}`} />
        </div>
        {f.efeitos.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {f.efeitos.map((e) => (
              <span key={e.id} className="chip !border-laranja !text-laranja" title={buscarEfeito(e.id)?.texto || e.texto}>
                {e.nome || buscarEfeito(e.id)?.nome || e.id}{e.quantidade > 1 ? ` ×${e.quantidade}` : ''}
                {(e.turnos || e.rodadas) ? ` · ${e.rodadas ? `${e.rodadas}r ` : ''}${e.turnos ? `${e.turnos}t` : ''}` : e.duracao ? ` · ${e.duracao}` : ''}
              </span>
            ))}
          </div>
        )}
      </Secao>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_1fr]">
        <Secao titulo="Atributos"><Hexagono atributos={f.atributos} somenteLeitura /></Secao>
        <Secao titulo="Perícias"><Pericias pericias={f.pericias} somenteLeitura /></Secao>
      </div>

      {arma && <Secao titulo="Arma"><ArmaDetalhe arma={arma} /></Secao>}

      {otica && (
        <Secao titulo="Ótica">
          <p className="mb-2 text-[12px] italic text-suave">{otica.tema}</p>
          <div className="grid gap-2 md:grid-cols-3">
            {otica.niveis.map((t, i) => (
              <div key={i} className={`cartao ${f.visoes.includes(i + 1) ? 'cartao-ativo' : 'opacity-60'}`}>
                <div className="legenda">Nível {i + 1}{f.visoes.includes(i + 1) ? ' · desbloqueado' : ''}</div><p className="text-[12px] text-suave">{t}</p>
              </div>
            ))}
          </div>
          {catalisador && <p className="mt-3 text-[12px]"><span className="legenda mr-2">Catalisador</span><strong>{catalisador.nome}</strong> — potencial {f.catalisador.potencial}/10</p>}
        </Secao>
      )}

      {(tp || ts) && (
        <Secao titulo="Tendências">
          {tp && <p className="text-[13px]"><span className="legenda mr-2">Principal</span><strong>{tp.nome}</strong>{tp.dom ? ` — ${tp.dom.nome}` : ''}</p>}
          {tp?.dom && <TextoLivro texto={tp.dom.texto} />}
          {ts && <p className="mt-2 text-[13px]"><span className="legenda mr-2">Secundária</span><strong>{ts.nome}</strong>{ts.passiva_secundaria ? ` — ${ts.passiva_secundaria.nome}` : ''}</p>}
          {ts?.passiva_secundaria && <TextoLivro texto={ts.passiva_secundaria.texto} />}
        </Secao>
      )}

      {aura && (
        <Secao titulo="Fluxo">
          <p className="text-[13px]">Aura <strong>{aura.nome}</strong> ({aura.percentual_necessario}%) · fluxo {f.fluxo.tipo}</p>
          {f.fluxo.efeitosAuraSelecionados.length > 0 && <p className="mt-1 text-[12px] text-suave">Efeitos de Aura: {f.fluxo.efeitosAuraSelecionados.map((id) => EFEITOS_AURA.find((e) => e.id === id)?.nome || id).join(', ')}</p>}
        </Secao>
      )}

      {ativas.filter((a) => a.origem !== 'arma').length > 0 && (
        <Secao titulo="Outras habilidades ativas">
          <div className="grid gap-3 lg:grid-cols-2">
            {ativas.filter((a) => a.origem !== 'arma').map((a) => <HabilidadeLivro key={a.chave} h={a.h} />)}
          </div>
        </Secao>
      )}
      {f.nivel > 0 && cat && <p className="text-center text-[11px] text-mudo">Nível de categoria {nivelCategoria(f.nivel)}</p>}
    </div>
  );
}
