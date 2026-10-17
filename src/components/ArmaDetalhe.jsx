import { IconeArma, Estrelas } from './ui.jsx';
import { HabilidadeLivro, TextoLivro } from './Habilidade.jsx';
import { Retratil } from './Retratil.jsx';
import { nomePericia } from '../lib/ficha.js';

function Bloco({ titulo, nome, children }) {
  return (
    <div className="rounded border border-linha bg-black/40 p-3">
      <div className="titulo-caixa mb-2">{titulo}</div>
      {nome && <h4 className="mb-1 text-[15px] font-bold uppercase tracking-[0.14em]">{nome}</h4>}
      {children}
    </div>
  );
}

/** Página da arma como no livro: capacidade, efeito, recurso, jogada exclusiva e as 4 habilidades. */
export function ArmaDetalhe({ arma }) {
  if (!arma) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <IconeArma id={arma.id} nome={arma.nome} tamanho={72} />
        <div>
          <h3 className="text-xl font-bold uppercase tracking-[0.2em] glow-azul">{arma.nome}</h3>
          <Estrelas n={arma.dificuldade} />
          <p className="mt-1 text-[14px] italic text-suave">{arma.tema}</p>
        </div>
      </div>
      {arma.desbloqueia && <p className="text-[14px] text-suave"><span className="legenda mr-2">Desbloqueia</span>{arma.desbloqueia}</p>}
      <div className="grid gap-3 md:grid-cols-2">
        <Bloco titulo="Capacidade" nome={arma.mecanica_especial?.nome}><TextoLivro texto={arma.mecanica_especial?.texto} /></Bloco>
        {arma.efeito && <Bloco titulo={arma.efeito.acumulativo ? 'Efeito · acumula' : 'Efeito'} nome={arma.efeito.nome}><TextoLivro texto={arma.efeito.texto} /></Bloco>}
        {arma.recurso && <Bloco titulo="Recurso" nome={arma.recurso.nome}><TextoLivro texto={arma.recurso.texto} /></Bloco>}
        {arma.jogada && (
          <Bloco titulo="Jogada exclusiva" nome={arma.jogada.nome}>
            <p className="text-[14px] text-suave">
              {arma.jogada.pericia && <>Perícia {nomePericia(arma.jogada.pericia)} · </>}
              {arma.jogada.dj != null && <>Dj {arma.jogada.dj} · </>}
              {arma.jogada.distancia && <>{arma.jogada.distancia} · </>}
              {arma.jogada.acao}
            </p>
            {arma.jogada.anormalidade && <TextoLivro texto={arma.jogada.anormalidade} />}
          </Bloco>
        )}
      </div>
      <Retratil lista="arma">
        {(aberto) => (
          <div className="grid gap-4 lg:grid-cols-2">
            {arma.habilidades.map((h) => <HabilidadeLivro key={`${h.nome}-${aberto}`} h={h} aberto={aberto} />)}
          </div>
        )}
      </Retratil>
    </div>
  );
}
