import { useEffect, useState } from 'react';

export function formatarDetalhe(d) {
  if (!d) return '';
  if (d.tipo === 'avulso' || d.tipo === 'acao') return d.texto || '';
  const cabecalho = [d.atributoNome, d.periciaNome].filter(Boolean).join(' · ');
  let dados = d.detalheBase || '';
  if (d.rolagensAtributo?.length) dados += ` + ${d.rolagensAtributo.length}d6 [${d.rolagensAtributo.join(', ')}]`;
  if (d.rolagensVantagem?.length) dados += ` + ${d.rolagensVantagem.length}d6 vantagem [${d.rolagensVantagem.join(', ')}]`;
  if (d.rolagensDesvantagem?.length) dados += ` − ${d.rolagensDesvantagem.length}d6 desvantagem [${d.rolagensDesvantagem.join(', ')}]`;
  if (d.valorPericia) dados += ` + perícia ${d.valorPericia}`;
  if (d.bonus) dados += d.bonus > 0 ? ` + ${d.bonus} bônus` : ` − ${Math.abs(d.bonus)} bônus`;
  return cabecalho ? `${cabecalho} — ${dados}` : dados;
}

function ItemFita({ r, destaque }) {
  const hora = new Date(r.hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const acao = r.detalhe?.tipo === 'acao';
  const abs = r.detalhe?.execucaoAbsoluta?.tipo;
  const corTotal = abs === 'positiva' ? 'text-ok' : abs === 'negativa' ? 'text-perigo' : 'text-ciano';
  return (
    <li className={`rounded border p-3 ${destaque ? 'border-ciano bg-ciano/5' : 'border-linha bg-black/40'}`}>
      <div className="flex items-center gap-2 text-[11px] text-mudo">
        <span>{hora}</span>
        <span className="font-semibold uppercase tracking-[0.14em] text-texto">{r.jogada}</span>
        {acao && <span className="chip ml-auto">Ação</span>}
      </div>
      {acao ? (
        r.detalhe.texto && <p className="mt-1 line-clamp-4 text-[12px] text-suave">{r.detalhe.texto}</p>
      ) : (
        <div className="mt-1 flex items-end justify-between gap-3">
          <span className="text-[12px] text-suave">{formatarDetalhe(r.detalhe)}</span>
          <span className={`text-3xl font-bold leading-none ${corTotal}`}>{r.resultado}</span>
        </div>
      )}
      {abs && <p className={`mt-1 text-[11px] font-bold uppercase tracking-[0.16em] ${corTotal}`}>{abs === 'positiva' ? 'Execução absoluta!' : 'Falha absoluta'}</p>}
    </li>
  );
}

/** Botão flutuante + painel lateral com a fita de rolagens e dados avulsos. */
export function Fita({ historico, aoRolarAvulso, abrirSinal }) {
  const [aberta, setAberta] = useState(false);
  const [qtd, setQtd] = useState(1);
  const [faces, setFaces] = useState('6');
  const [outro, setOutro] = useState(6);
  const [mod, setMod] = useState(0);

  useEffect(() => { if (abrirSinal) setAberta(true); }, [abrirSinal]);
  useEffect(() => {
    const aoTecla = (e) => { if (e.key === 'Escape') setAberta(false); };
    window.addEventListener('keydown', aoTecla);
    return () => window.removeEventListener('keydown', aoTecla);
  }, []);

  const rolarAvulso = () => {
    const nf = faces === 'outro' ? Math.max(2, Number(outro) || 6) : Number(faces);
    const q = Math.max(1, Number(qtd) || 1);
    const m = Number(mod) || 0;
    const dados = Array.from({ length: q }, () => Math.floor(Math.random() * nf) + 1);
    const soma = dados.reduce((a, b) => a + b, 0) + m;
    const texto = `${q}d${nf}: [${dados.join(', ')}]${m ? (m > 0 ? ` + ${m}` : ` − ${Math.abs(m)}`) : ''}`;
    aoRolarAvulso({ nome: `Dado avulso (${q}d${nf}${m ? (m > 0 ? `+${m}` : m) : ''})`, soma, texto });
  };

  return (
    <>
      <button type="button" onClick={() => setAberta((a) => !a)} aria-expanded={aberta} aria-controls="painel-fita"
        className="btn btn-primario fixed bottom-[calc(env(safe-area-inset-bottom)+72px)] right-3 z-40 sm:bottom-4 sm:right-4 shadow-[0_0_30px_rgba(47,107,255,0.5)]">
        🎲 Rolagens{historico.length > 0 && <span className="rounded bg-black/40 px-1.5">{historico.length}</span>}
      </button>
      {aberta && (
        <aside id="painel-fita" aria-label="Rolagens" className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] pt-seguro flex-col border-l border-linha-forte bg-painel shadow-2xl">
          <div className="flex items-center justify-between border-b border-linha p-3">
            <span className="titulo-caixa">Rolagens</span>
            <button type="button" className="btn btn-mini btn-fantasma" onClick={() => setAberta(false)} aria-label="Fechar">✕</button>
          </div>
          <ol className="flex-1 space-y-2 overflow-y-auto p-3" aria-live="polite">
            {historico.length === 0
              ? <li className="py-8 text-center text-[13px] text-mudo">A fita sai aqui. Clique numa jogada na aba <strong>Na mesa</strong> para rolar.</li>
              : historico.map((r, i) => <ItemFita key={`${r.hora}-${i}`} r={r} destaque={i === 0} />)}
          </ol>
          <details className="border-t border-linha p-3">
            <summary className="legenda cursor-pointer">Dados avulsos (d4, d6, d100…)</summary>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <label><span className="campo-label">Quantidade</span><input className="entrada" type="number" min="1" value={qtd} onChange={(e) => setQtd(e.target.value)} /></label>
              <label><span className="campo-label">Dado</span>
                <select className="entrada" value={faces} onChange={(e) => setFaces(e.target.value)}>
                  {[2, 4, 6, 8, 10, 12, 20, 100].map((n) => <option key={n} value={n}>d{n}</option>)}
                  <option value="outro">Outro…</option>
                </select>
              </label>
              {faces === 'outro' && <label><span className="campo-label">Faces</span><input className="entrada" type="number" min="2" value={outro} onChange={(e) => setOutro(e.target.value)} /></label>}
              <label><span className="campo-label">Modificador</span><input className="entrada" type="number" value={mod} onChange={(e) => setMod(e.target.value)} /></label>
            </div>
            <button type="button" className="btn btn-primario mt-3 w-full" onClick={rolarAvulso}>Rolar</button>
          </details>
        </aside>
      )}
    </>
  );
}
