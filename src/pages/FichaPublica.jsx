import { useEffect, useState } from 'react';
import { buscarFichaPublica } from '../api/fichas.js';
import { Pagina } from '../components/Layout.jsx';
import { FichaLeitura } from '../components/FichaLeitura.jsx';

export default function FichaPublica({ id }) {
  const [row, setRow] = useState(null);
  const [erro, setErro] = useState(false);
  useEffect(() => {
    buscarFichaPublica(id).then((r) => { setRow(r); document.title = `${r.nome_personagem} — Fórmula do Ego`; }).catch(() => setErro(true));
  }, [id]);
  return (
    <Pagina larga publica>
      {erro ? (
        <div className="painel text-center"><h1 className="titulo-pagina mb-2">Não achei essa ficha</h1><p className="text-suave">O link pode estar errado, ou a ficha foi apagada.</p></div>
      ) : !row ? <p className="py-16 text-center text-mudo">Carregando ficha…</p> : (
        <>
          <p className="mb-4 text-[12px] text-mudo">Visualização compartilhada — somente leitura.</p>
          <FichaLeitura row={row} />
        </>
      )}
    </Pagina>
  );
}
