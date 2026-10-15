import { MARCAS_DESPERTAR, TIPOS_AURA, calcularPercentualFluxoComUsos } from '../../data/fluxo.js';
import { Secao } from '../ui.jsx';
import { Termo } from '../Termo.jsx';

export function FluxoMesa({ f, atualizar, registrar, toast }) {
  const fl = f.fluxo;
  const aura = TIPOS_AURA.find((t) => t.id === fl.auraTipo);
  const todas = Object.values(MARCAS_DESPERTAR).flat();
  const atual = calcularPercentualFluxoComUsos(fl.marcasConhecidas, fl.marcasUsos);
  const necessario = aura ? aura.percentual_necessario : null;
  const pronto = aura && atual >= necessario;

  const usarMarca = (id) => atualizar({ fluxo: { ...fl, marcasUsos: { ...fl.marcasUsos, [id]: (fl.marcasUsos[id] || 0) + 1 } } });
  const desfazer = (id) => atualizar({ fluxo: { ...fl, marcasUsos: { ...fl.marcasUsos, [id]: Math.max(0, (fl.marcasUsos[id] || 0) - 1) } } });

  const alternarFluxo = () => {
    const ligando = !fl.ativo;
    // Ao ligar: usos de marca zeram e as habilidades "uma vez em fluxo" ficam disponíveis de novo.
    atualizar({ fluxo: { ...fl, ativo: ligando, marcasUsos: ligando ? {} : fl.marcasUsos }, usadasFluxo: [] });
    toast(ligando ? 'Fluxo ativado!' : 'Fluxo desativado.');
    registrar(ligando ? 'Entrou em fluxo' : 'Saiu do fluxo', ligando ? `Aura ${aura?.nome || ''}: ${atual}% (precisava de ${necessario}%).` : '');
  };

  return (
    <Secao titulo="Fluxo" tag={fl.ativo ? '● ativo' : 'inativo'} className={fl.ativo ? 'painel-neon' : ''}>
      {!aura ? (
        <p className="text-[15px] text-mudo">Escolha o tipo de Aura na aba <strong>Talentos &amp; Fluxo</strong> para definir a % necessária.</p>
      ) : (
        <>
          <div className="mb-2 flex items-end justify-between">
            <div><span className="legenda">% atual</span><div className={`text-3xl font-bold ${pronto ? 'text-ok glow-ciano' : 'text-texto'}`}>{atual}%</div></div>
            <div className="text-right"><span className="legenda"><Termo id="aura">Aura</Termo> {aura.nome}</span><div className="text-xl text-suave">precisa de {necessario}%</div></div>
          </div>
          <div className="barra mb-4"><i style={{ width: `${Math.min(100, (atual / necessario) * 100)}%` }} /></div>
        </>
      )}
      {fl.marcasConhecidas.length === 0 ? (
        <p className="mb-3 text-[15px] text-mudo">Marque as marcas de despertar que você conhece na aba Talentos &amp; Fluxo.</p>
      ) : (
        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {fl.marcasConhecidas.map((id) => {
            const m = todas.find((x) => x.id === id);
            if (!m) return null;
            const usos = fl.marcasUsos[id] || 0;
            return (
              <div key={id} className="cartao !p-2">
                <button type="button" className="w-full text-left" onClick={() => usarMarca(id)}>
                  <div className="text-[15px] font-semibold">{m.nome}</div>
                  <div className="text-[13px] text-suave">+{m.recompensa}% · usada {usos}×</div>
                </button>
                {usos > 0 && <button type="button" className="btn btn-mini btn-fantasma mt-1" onClick={() => desfazer(id)}>desfazer 1</button>}
              </div>
            );
          })}
        </div>
      )}
      <button type="button" className={`btn w-full ${fl.ativo ? 'btn-perigo' : 'btn-primario'}`} disabled={!fl.ativo && !pronto} onClick={alternarFluxo}>
        {fl.ativo ? 'Desativar fluxo' : 'Ativar fluxo'}
      </button>
    </Secao>
  );
}
