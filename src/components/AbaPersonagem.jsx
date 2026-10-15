import { ARMAS } from '../data/armas.js';
import { OTICAS } from '../data/oticas.js';
import { TENDENCIAS } from '../data/tendencias.js';
import { CATEGORIAS, HABILIDADES_DE_CATEGORIA } from '../data/categorias.js';
import { PERICIAS } from '../data/pericias.js';
import { Secao, Passo, Campo, Selecao, Contador, IconeArma } from './ui.jsx';
import { Hexagono } from './Hexagono.jsx';
import { Pericias } from './Pericias.jsx';
import { ArmaDetalhe } from './ArmaDetalhe.jsx';
import { HabilidadeLivro, TextoLivro } from './Habilidade.jsx';
import {
  NIVEL_MAXIMO, categoriaDe, catalisadoresDaOtica, limiteHabilidadesCategoria, nivelCategoria, oticaDe,
  pontosPericiaMaximos, pontosPericiaUsados, tendenciaPrincipalDe, tendenciaSecundariaDe,
} from '../lib/ficha.js';
import { NIVEL_MINIMO_CATALISADOR } from '../data/fluxo.js';

function Checklist({ f, existe }) {
  const usados = pontosPericiaUsados(f);
  const maximo = pontosPericiaMaximos(f);
  const itens = [
    ['sec-identidade', 'Nome', !!f.nome.trim()],
    ['sec-atributos', 'Atributos', Object.values(f.atributos).some((v) => v !== 0)],
    ['sec-pericias', usados >= maximo ? 'Perícias' : `Perícias (${maximo - usados} sobrando)`, usados >= maximo],
    ['sec-arma', 'Arma', !!f.armaId],
    ['sec-otica', 'Ótica', !!f.oticaId],
    ['sec-tendencias', 'Tendência', !!f.tendPrincipal],
    ['sec-categoria', 'Categoria', !!f.arquetipoId],
  ];
  const feitos = itens.filter((i) => i[2]).length;
  return (
    <div className={`painel ${feitos === itens.length ? 'border-ok/60' : ''}`}>
      <div className="mb-2 flex justify-between text-[14px] uppercase tracking-[0.16em]">
        <strong>{feitos === itens.length ? 'Ficha completa ✓' : 'Montando o personagem'}</strong>
        <span className="text-mudo">{feitos}/{itens.length}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {itens.map(([id, rotulo, ok]) => (
          <button key={id} type="button" className={`chip ${ok ? '!border-ok !text-ok' : ''}`} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
            {ok ? '✓' : '○'} {rotulo}
          </button>
        ))}
      </div>
      {!existe && <p className="mt-2 text-[13px] text-mudo">Tudo é salvo sozinho depois que a ficha é criada.</p>}
    </div>
  );
}

export function AbaPersonagem({ ficha, toast, criarFicha }) {
  const { f, atualizar, existe } = ficha;
  const arma = ARMAS.find((a) => a.id === f.armaId);
  const otica = oticaDe(f);
  const principal = tendenciaPrincipalDe(f);
  const secundaria = tendenciaSecundariaDe(f);
  const cat = categoriaDe(f);
  const nc = nivelCategoria(f.nivel);
  const limiteCat = limiteHabilidadesCategoria(f);
  const habilidadesCat = HABILIDADES_DE_CATEGORIA.filter((h) => h.arquetipos.includes(f.arquetipoId));
  const catalisadores = catalisadoresDaOtica(f);

  const mudarNivel = (n) => {
    const nivel = Math.min(NIVEL_MAXIMO, Math.max(1, n));
    atualizar({ nivel, recompensa8: nivel >= 8 ? 'egoista' : f.recompensa8 });
  };
  const alternarCat = (nome) => {
    if (f.habilidadesCategoria.includes(nome)) return atualizar({ habilidadesCategoria: f.habilidadesCategoria.filter((x) => x !== nome) });
    if (f.habilidadesCategoria.length >= limiteCat) return toast(`Você só desbloqueou ${limiteCat} habilidade(s) de categoria até o nível ${f.nivel}.`, 'erro');
    return atualizar({ habilidadesCategoria: [...f.habilidadesCategoria, nome] });
  };

  return (
    <div className="space-y-4">
      <Checklist f={f} existe={existe} />

      <Secao id="sec-identidade" titulo="Identidade">
        <div className="grid gap-3 sm:grid-cols-2">
          <Campo rotulo="Nome do personagem"><input className="entrada" value={f.nome} onChange={(e) => atualizar({ nome: e.target.value })} /></Campo>
          <div>
            <span className="campo-label">Nível</span>
            <Contador valor={f.nivel} min={1} max={NIVEL_MAXIMO} rotulo="Nível" onMenos={() => mudarNivel(f.nivel - 1)} onMais={() => mudarNivel(f.nivel + 1)} />
          </div>
          <Campo rotulo="Posição principal">
            <Selecao valor={f.posicao} onChange={(v) => atualizar({ posicao: v })} vazio="— não definida —" opcoes={[
              { id: 'goleiro', nome: 'Goleiro' }, { id: 'zaga', nome: 'Zaga' }, { id: 'lateral', nome: 'Lateral' }, { id: 'meio', nome: 'Meio-campo' }, { id: 'ataque', nome: 'Ataque' },
            ]} />
          </Campo>
          <Campo rotulo="Perna dominante">
            <Selecao valor={f.perna} onChange={(v) => atualizar({ perna: v })} vazio="— não definida —" opcoes={[{ id: 'direita', nome: 'Direita' }, { id: 'esquerda', nome: 'Esquerda' }]} />
          </Campo>
        </div>
        {!existe && <button type="button" className="btn btn-ouro mt-4 w-full" onClick={criarFicha}>Criar ficha</button>}
      </Secao>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_1fr]">
        <Secao id="sec-atributos" titulo="Atributos">
          <Hexagono atributos={f.atributos} onChange={(atributos) => atualizar({ atributos })} />
        </Secao>
        <Secao id="sec-pericias" titulo="Perícias" tag="máx. 5 por perícia">
          <Passo>O livro recomenda 10 pontos na criação; o limite sobe com o nível, a categoria e a tendência — mas a mesa decide.</Passo>
          {f.tendPericia && <p className="mb-3 rounded border border-ciano/40 bg-ciano/5 p-2 text-[14px]"><strong className="text-ciano">+2 de bônus</strong> em {PERICIAS.find((p) => p.id === f.tendPericia)?.nome} pela sua Tendência — já incluído no total.</p>}
          <Pericias pericias={f.pericias} onChange={(pericias) => atualizar({ pericias })} maximo={pontosPericiaMaximos(f)} />
        </Secao>
      </div>

      <Secao id="sec-arma" titulo="Arma">
        <Selecao valor={f.armaId} onChange={(v) => atualizar({ armaId: v })} vazio="— nenhuma escolhida —" opcoes={ARMAS} />
        {arma && <div className="mt-4"><ArmaDetalhe arma={arma} /></div>}
      </Secao>

      <Secao id="sec-otica" titulo="Ótica e visões">
        <Selecao valor={f.oticaId} onChange={(v) => atualizar({ oticaId: v, visoes: [], catalisador: { id: '', potencial: 0 } })} vazio="— nenhuma escolhida —" opcoes={OTICAS} />
        {otica && (
          <div className="mt-4 space-y-3">
            <p className="text-[14px] italic text-suave">{otica.tema}</p>
            <div className="grid gap-2 md:grid-cols-3">
              {otica.niveis.map((texto, i) => {
                const n = i + 1;
                const marcado = f.visoes.includes(n);
                return (
                  <label key={n} className={`cartao cursor-pointer ${marcado ? 'cartao-ativo' : ''}`}>
                    <input type="checkbox" className="mr-2" checked={marcado}
                      onChange={() => atualizar({ visoes: marcado ? f.visoes.filter((x) => x !== n) : [...f.visoes, n] })} />
                    <strong className="text-[14px] uppercase tracking-[0.14em]">Nível {n}</strong>
                    <p className="mt-1 text-[14px] text-suave">{texto}</p>
                  </label>
                );
              })}
            </div>
            {otica.habilidade_nv3 && <HabilidadeLivro h={{ ...otica.habilidade_nv3, tipo: 'variante' }} />}
            <p className="text-[14px] text-suave"><span className="legenda mr-2">Catalisadores</span>{otica.catalisadores}</p>
            {f.nivel >= NIVEL_MINIMO_CATALISADOR && (
              <Campo rotulo="Seu catalisador">
                <Selecao valor={f.catalisador.id} onChange={(v) => atualizar({ catalisador: { ...f.catalisador, id: v, potencial: 0 } })} vazio="— nenhum —" opcoes={catalisadores} />
              </Campo>
            )}
          </div>
        )}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Campo rotulo="Recompensa do nível 6">
            <Selecao valor={f.recompensa6} onChange={(v) => atualizar({ recompensa6: v })} vazio="— escolher depois —" opcoes={[
              { id: 'distancia_chute', nome: '+1m de distância de chute' }, { id: 'distancia_passe', nome: '+1m de distância de passe' }, { id: 'folego', nome: '+1 fôlego' },
            ]} />
          </Campo>
          <div><span className="campo-label">Recompensa do nível 8</span><div className="entrada !text-suave">+1 ação egoísta (automático no nível 8)</div></div>
        </div>
      </Secao>

      <Secao id="sec-tendencias" titulo="Tendências">
        <div className="grid gap-3 sm:grid-cols-2">
          <Campo rotulo="Principal"><Selecao valor={f.tendPrincipal} onChange={(v) => atualizar({ tendPrincipal: v, tendPericia: '' })} vazio="— nenhuma —" opcoes={TENDENCIAS} /></Campo>
          <Campo rotulo="Secundária"><Selecao valor={f.tendSecundaria} onChange={(v) => atualizar({ tendSecundaria: v })} vazio="— nenhuma —" opcoes={TENDENCIAS} /></Campo>
        </div>
        {principal && (
          <div className="mt-4 rounded border border-linha bg-black/40 p-3">
            {principal.dom
              ? <><div className="legenda mb-1">Dom — {principal.nome}</div><h4 className="mb-1 font-bold uppercase tracking-[0.12em]">{principal.dom.nome}</h4><TextoLivro texto={principal.dom.texto} /></>
              : <p className="text-[14px] text-suave"><strong className="text-texto">{principal.nome}</strong> não tem Dom próprio — só dá a Passiva quando usada como secundária.</p>}
            {principal.pericia_adicional?.length > 0 && (
              <div className="mt-3">
                <div className="legenda mb-2">Escolha a perícia adicional (+2)</div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {principal.pericia_adicional.map((id) => (
                    <button key={id} type="button" className={`cartao ${f.tendPericia === id ? 'cartao-ativo' : ''}`} onClick={() => atualizar({ tendPericia: id })}>
                      {PERICIAS.find((p) => p.id === id)?.nome || id}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {secundaria?.passiva_secundaria && (
          <div className="mt-3 rounded border border-linha bg-black/40 p-3">
            <div className="legenda mb-1">Passiva — {secundaria.nome}</div>
            <h4 className="mb-1 font-bold uppercase tracking-[0.12em]">{secundaria.passiva_secundaria.nome}</h4>
            <TextoLivro texto={secundaria.passiva_secundaria.texto} />
          </div>
        )}
      </Secao>

      <Secao id="sec-categoria" titulo="Categoria">
        <div className="grid gap-3 sm:grid-cols-2">
          <Campo rotulo="Gênio ou Aprendiz"><Selecao valor={f.categoriaId} onChange={(v) => atualizar({ categoriaId: v, arquetipoId: '', habilidadesCategoria: [] })} vazio="— nenhuma —" opcoes={CATEGORIAS} /></Campo>
          <Campo rotulo="Arquétipo"><Selecao valor={f.arquetipoId} onChange={(v) => atualizar({ arquetipoId: v, habilidadesCategoria: [] })} vazio={cat ? '— nenhum —' : '— escolha a categoria primeiro —'} opcoes={cat?.arquetipos || []} /></Campo>
        </div>
        {cat && (
          <div className="mt-4">
            <Passo>O nível de categoria sobe sozinho com o nível do personagem (níveis 4, 5, 6 e 8). Em destaque: o atual.</Passo>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {cat.evolucao.map((e) => (
                <div key={e.nivel} className={`cartao ${nc === e.nivel ? 'cartao-ativo' : nc > e.nivel ? '!border-ok/40' : ''}`}>
                  <div className="legenda">Nível de categoria {e.nivel}{nc === e.nivel ? ' · atual' : nc > e.nivel ? ' · concluído' : ''}</div>
                  <p className="mt-1 text-[14px] text-suave">{e.ganhos}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {f.arquetipoId && (
          <div className="mt-4">
            <div className="legenda mb-2">Habilidades de categoria · {f.habilidadesCategoria.length}/{limiteCat} desbloqueadas</div>
            <div className="grid gap-3 lg:grid-cols-2">
              {habilidadesCat.map((h) => {
                const marcada = f.habilidadesCategoria.includes(h.nome);
                return (
                  <HabilidadeLivro key={h.nome} h={h} acoes={(
                    <button type="button" className={`btn btn-mini ${marcada ? 'btn-primario' : ''}`} onClick={() => alternarCat(h.nome)} aria-pressed={marcada}>
                      {marcada ? '✓ Desbloqueada' : 'Desbloquear'}
                    </button>
                  )} />
                );
              })}
            </div>
          </div>
        )}
      </Secao>
    </div>
  );
}
