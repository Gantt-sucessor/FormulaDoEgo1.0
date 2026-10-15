import { CATALISADORES } from '../../data/catalisadores.js';
import { NIVEL_MINIMO_CATALISADOR, NIVEL_MINIMO_HABILIDADE_CATALISADOR } from '../../data/fluxo.js';
import { catalisadoresDaOtica } from '../../lib/ficha.js';
import { Secao } from '../ui.jsx';
import { Termo } from '../Termo.jsx';
import { TextoLivro } from '../Habilidade.jsx';

export function CatalisadorMesa({ f, atualizar, registrar, toast }) {
  const liberado = f.nivel >= NIVEL_MINIMO_CATALISADOR;
  const cat = CATALISADORES.find((c) => c.id === f.catalisador.id);
  const pot = f.catalisador.potencial;
  const disponiveis = catalisadoresDaOtica(f);
  const setCat = (patch) => atualizar({ catalisador: { ...f.catalisador, ...patch } });

  const ativar = () => {
    if (pot < 1) return;
    setCat({ potencial: 0 });
    atualizar({ acoes: { ...f.acoes, egoista: true } });
    toast(`Catalisador ativado por ${pot} turno(s)!`);
    registrar(`Ativou o catalisador: ${cat.nome} (${pot} turno${pot > 1 ? 's' : ''})`, cat.passiva.texto);
  };

  return (
    <Secao titulo="Catalisador" tag={liberado ? undefined : `libera no nível ${NIVEL_MINIMO_CATALISADOR}`}>
      {!liberado ? (
        <p className="text-[15px] text-mudo">Disponível a partir do nível {NIVEL_MINIMO_CATALISADOR}. A habilidade exclusiva libera no nível {NIVEL_MINIMO_HABILIDADE_CATALISADOR}.</p>
      ) : !cat ? (
        <p className="text-[15px] text-mudo">{disponiveis.length ? 'Escolha o seu catalisador na aba Personagem (seção Ótica).' : 'Escolha uma ótica na aba Personagem para ver os catalisadores possíveis.'}</p>
      ) : (
        <div>
          <div className="mb-2 flex items-center gap-2"><strong className="uppercase tracking-[0.16em]">{cat.nome}</strong></div>
          <p className="mb-2 text-[14px] text-suave">Passiva — <strong className="text-texto">{cat.passiva.nome}:</strong> {cat.passiva.texto}</p>
          <div className="mb-1 flex items-center justify-between">
            <span className="legenda"><Termo id="potencial">Potencial</Termo></span>
            <strong className="text-xl text-ciano">{pot}<span className="text-sm text-mudo">/10</span></strong>
          </div>
          <div className="barra mb-3"><i style={{ width: `${pot * 10}%` }} /></div>
          <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {cat.jogadas_potencial.map((j) => (
              <button key={j.acao} type="button" className="cartao" onClick={() => setCat({ potencial: Math.min(10, pot + j.potencial) })}>
                <div className="text-[15px] font-semibold">{j.acao}</div>
                <div className="text-[13px] text-suave">+{j.potencial} potencial</div>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" className="btn btn-primario flex-1" disabled={pot < 1} onClick={ativar}>Ativar ({pot} turno{pot === 1 ? '' : 's'}) · ação egoísta</button>
            <button type="button" className="btn btn-fantasma" disabled={pot < 1} onClick={() => setCat({ potencial: 0 })}>Zerar</button>
          </div>
          {f.nivel >= NIVEL_MINIMO_HABILIDADE_CATALISADOR
            ? <p className="mt-3 text-[14px] text-suave">Habilidade exclusiva <strong className="text-texto">{cat.habilidade.nome}</strong> está em “Habilidades ativas”.</p>
            : <p className="mt-3 text-[14px] text-mudo">A habilidade exclusiva ({cat.habilidade.nome}) libera no nível {NIVEL_MINIMO_HABILIDADE_CATALISADOR}.</p>}
          <details className="mt-2"><summary className="cursor-pointer text-[14px] text-ciano">tema do catalisador</summary><TextoLivro texto={cat.tema} /></details>
        </div>
      )}
    </Secao>
  );
}
