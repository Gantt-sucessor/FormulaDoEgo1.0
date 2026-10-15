import { useEffect, useMemo, useState, useCallback } from 'react';
import { ARMAS } from '../data/armas.js';
import { IconeArma, Contador, Titulo } from './ui.jsx';
import { FichaLeitura } from './FichaLeitura.jsx';
import { formatarDetalhe } from './Fita.jsx';
import { buscarFichasDaCampanha, buscarHistoricoRolagens, escutarFichas, escutarRolagens } from '../api/campanhas.js';
import { atualizarFicha } from '../api/fichas.js';
import { CATALOGO_EFEITOS, CATALOGO_EFEITOS_CLASSE, aplicarEfeito, buscarEfeito, removerEfeito } from '../regras/efeitos.js';
import { novaRodada, passarTurno, LIMITE_PDE } from '../regras/habilidades.js';
import { som } from '../lib/som.js';
import { resolverJogada } from '../regras/dados.js';
import { aplicarEstadoDoMotor, camposParaBanco, estadoDoMotor, fichaDoBanco, folegoMaximo, pdsMaximo } from '../lib/ficha.js';
import { useToast } from '../lib/toast.jsx';

const hora = (iso) => new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

function Pilula({ rotulo, valor, max, cor = 'text-texto' }) {
  return <span className="text-[13px] text-suave">{rotulo} <strong className={cor}>{valor}{max !== undefined ? `/${max}` : ''}</strong></span>;
}

function CartaoJogador({ row, mestre, aberto, aoAbrir, aoSalvar }) {
  const f = fichaDoBanco(row);
  const arma = ARMAS.find((a) => a.id === f.armaId);
  const fMax = folegoMaximo(f);
  const folego = Math.min(f.folego ?? fMax, fMax);
  const gastas = (f.acoes.tatica ? 1 : 0) + (f.acoes.egoista ? 1 : 0) + (f.acoes.movimento ? 1 : 0) + f.acoes.regulares.filter(Boolean).length;
  const [efeitoNovo, setEfeitoNovo] = useState('');
  const [aliviar, setAliviar] = useState(false);

  // Ajuste feito pelo mestre: grava direto na ficha do jogador (ele vê na hora, por tempo real).
  const salvar = (novo) => aoSalvar(row, novo);
  const ajustar = (campo, delta, max) => salvar({ ...f, [campo]: Math.max(0, max !== undefined ? Math.min(max, f[campo] + delta) : f[campo] + delta) });

  return (
    <article className={`rounded border bg-painel-2 p-3 ${f.fluxo.ativo ? 'border-ouro/60' : 'border-linha'}`}>
      <button type="button" className="flex w-full items-center gap-3 text-left" onClick={aoAbrir} aria-expanded={aberto}>
        <IconeArma id={arma?.id} nome={arma?.nome || f.nome} tamanho={44} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[16px] font-bold uppercase tracking-[0.1em]">{f.nome}</span>
          <span className="block truncate text-[13px] text-mudo">{row.nome_jogador} · nível {f.nivel}{arma ? ` · ${arma.nome}` : ''}</span>
        </span>
        <span className="text-ciano">{aberto ? '▾' : '▸'}</span>
      </button>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        <Pilula rotulo="Fôlego" valor={folego} max={fMax} />
        <Pilula rotulo="PdE" valor={f.pde} max={LIMITE_PDE} cor={f.pde >= LIMITE_PDE - 1 ? 'text-laranja' : 'text-texto'} />
        <Pilula rotulo="PdS" valor={f.pds} max={pdsMaximo()} />
        <Pilula rotulo="Ações" valor={`${gastas} usadas`} />
        <Pilula rotulo="Rodada" valor={f.rodada} />
        <span className="text-[13px] text-suave">{f.comBola ? '● com bola' : '○ sem bola'}</span>
        {f.fluxo.ativo && <span className="text-[13px] font-bold text-ouro">● FLUXO</span>}
      </div>
      <div className="barra mt-2"><i style={{ width: `${fMax ? (folego / fMax) * 100 : 0}%` }} /></div>
      {f.efeitos.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {f.efeitos.map((e) => (
            <span key={e.id} className="chip !border-laranja/60 !text-laranja">
              {e.nome || buscarEfeito(e.id)?.nome || e.id}{e.quantidade > 1 ? ` ×${e.quantidade}` : ''}
              {(e.turnos || e.rodadas) ? ` · ${e.rodadas ? `${e.rodadas}r ` : ''}${e.turnos ? `${e.turnos}t` : ''}` : ''}
              {mestre && <button type="button" aria-label="remover" className="ml-1 text-perigo" onClick={() => salvar({ ...f, efeitos: removerEfeito(f.efeitos, e.id) })}>✕</button>}
            </span>
          ))}
        </div>
      )}
      {mestre && aberto && (
        <div className="mt-3 space-y-3 rounded border border-ouro/30 bg-black/40 p-3">
          <div className="legenda text-ouro">Controle do mestre</div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
            <span className="flex items-center gap-2">Fôlego <Contador valor={folego} max={fMax} rotulo="Fôlego" onMenos={() => ajustar('folego', -1, fMax)} onMais={() => ajustar('folego', 1, fMax)} /></span>
            <span className="flex items-center gap-2">PdE <Contador valor={f.pde} rotulo="PdE" onMenos={() => ajustar('pde', -1)} onMais={() => ajustar('pde', 1)} /></span>
            <span className="flex items-center gap-2">PdS <Contador valor={f.pds} max={pdsMaximo()} rotulo="PdS" onMenos={() => ajustar('pds', -1, pdsMaximo())} onMais={() => ajustar('pds', 1, pdsMaximo())} /></span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-mini" onClick={() => { const r = passarTurno(estadoDoMotor(f)); salvar(aplicarEstadoDoMotor(f, r.estado)); }}>Passar turno</button>
            <label className="flex items-center gap-2 text-[14px] text-suave"><input type="checkbox" checked={aliviar} onChange={(e) => setAliviar(e.target.checked)} />−2 PdE</label>
            <button type="button" className="btn btn-mini" onClick={() => { const r = novaRodada(estadoDoMotor(f), { aliviarPdE: aliviar, folegoMax: fMax }); salvar(aplicarEstadoDoMotor(f, r.estado)); }}>Nova rodada</button>
          </div>
          <div className="flex gap-2">
            <select className="entrada !py-1.5 !text-[14px]" value={efeitoNovo} onChange={(e) => setEfeitoNovo(e.target.value)} aria-label="Aplicar efeito">
              <option value="">+ aplicar efeito…</option>
              {[...CATALOGO_EFEITOS, ...CATALOGO_EFEITOS_CLASSE].map((ef) => <option key={ef.id} value={ef.id}>{ef.nome}</option>)}
            </select>
            <button type="button" className="btn btn-mini" disabled={!efeitoNovo} onClick={() => { salvar({ ...f, efeitos: aplicarEfeito(f.efeitos, efeitoNovo) }); setEfeitoNovo(''); }}>Aplicar</button>
          </div>
        </div>
      )}
      {aberto && <div className="mt-4 border-t border-linha pt-4"><FichaLeitura row={row} /></div>}
    </article>
  );
}

function ItemRolagem({ r, dj, destacar }) {
  const detalhe = r.detalhe || {};
  const acao = detalhe.tipo === 'acao';
  const avulso = detalhe.tipo === 'avulso';
  const abs = detalhe.execucaoAbsoluta?.tipo;
  const teste = !acao && !avulso && dj !== '' && !Number.isNaN(Number(dj)) ? resolverJogada(r.resultado, Number(dj)) : null;
  const cor = abs === 'positiva' ? 'text-ok' : abs === 'negativa' ? 'text-perigo' : acao ? 'text-ouro' : 'text-ciano';
  return (
    <li className={`flex gap-3 rounded border p-2.5 ${abs === 'positiva' ? 'border-ok bg-ok/10' : abs === 'negativa' ? 'border-perigo bg-perigo/10' : destacar ? 'border-ciano bg-ciano/5' : 'border-linha bg-black/40'} ${destacar && abs === 'positiva' ? 'fx-critico' : ''} ${destacar && abs === 'negativa' ? 'fx-falha' : ''}`}>
      <div className={`w-14 shrink-0 text-center text-2xl font-bold leading-tight ${cor}`}>{acao ? <span className="text-[13px] uppercase tracking-[0.14em]">Ação</span> : r.resultado}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <strong className="truncate text-[14px] uppercase tracking-[0.1em]">{r.nome_personagem}</strong>
          <span className="shrink-0 text-[13px] text-mudo">{hora(r.criada_em)}</span>
        </div>
        <div className="text-[15px]">{r.jogada}</div>
        {(acao || avulso) ? (detalhe.texto && <p className="line-clamp-2 text-[13px] text-suave">{detalhe.texto}</p>) : <p className="text-[13px] text-suave">{formatarDetalhe(detalhe)}</p>}
        {abs && <p className={`text-[13px] font-bold uppercase tracking-[0.14em] ${cor}`}>{abs === 'positiva' ? 'Execução absoluta! · crítico' : 'Falha absoluta · falha crítica'}</p>}
        {teste?.resolvida && (
          <p className={`text-[13px] font-bold uppercase tracking-[0.14em] ${teste.sucesso ? 'text-ok' : 'text-perigo'}`}>
            {teste.sucesso ? '✓ passou' : '✗ falhou'} (DJ {teste.dj}, {teste.margem >= 0 ? '+' : ''}{teste.margem})
          </p>
        )}
      </div>
    </li>
  );
}

/** Painel ao vivo da campanha: fichas, rolagens e (para o mestre) controles e teste de DJ. */
export function PainelAoVivo({ campanha, mestre = false }) {
  const toast = useToast();
  const [fichas, setFichas] = useState([]);
  const [rolagens, setRolagens] = useState([]);
  const [aberta, setAberta] = useState(null);
  const [aliviarTodos, setAliviarTodos] = useState(false);
  const [dj, setDj] = useState('');
  const [filtro, setFiltro] = useState('');
  const [novas, setNovas] = useState(new Set());

  const carregar = useCallback(async () => {
    const [fs, rs] = await Promise.all([buscarFichasDaCampanha(campanha.id), buscarHistoricoRolagens(campanha.id, 60)]);
    setFichas(fs); setRolagens(rs);
  }, [campanha.id]);

  useEffect(() => {
    carregar().catch(() => toast('Não deu pra carregar a campanha.', 'erro'));
    const parar1 = escutarRolagens(campanha.id, (r) => {
      if (r?.detalhe?.execucaoAbsoluta?.tipo) som.rolagem(r.detalhe);
      setRolagens((l) => (l.some((x) => x.id === r.id) ? l : [r, ...l].slice(0, 120)));
      setNovas((s) => new Set(s).add(r.id));
      setTimeout(() => setNovas((s) => { const n = new Set(s); n.delete(r.id); return n; }), 4000);
    });
    const parar2 = escutarFichas(campanha.id, (nova) => {
      if (!nova?.id) return;
      setFichas((l) => (l.some((x) => x.id === nova.id) ? l.map((x) => (x.id === nova.id ? { ...x, ...nova } : x)) : [...l, nova]));
    });
    return () => { parar1(); parar2(); };
  }, [campanha.id]);

  const salvarComoMestre = async (row, novo) => {
    const campos = camposParaBanco(novo);
    const parcial = {
      folego_atual: campos.folego_atual, pde_atual: campos.pde_atual, pontos_sorte: campos.pontos_sorte,
      efeitos_ativos: campos.efeitos_ativos, acoes_gastas: campos.acoes_gastas,
    };
    setFichas((l) => l.map((x) => (x.id === row.id ? { ...x, ...parcial } : x))); // otimista
    try { await atualizarFicha(row.id, parcial); } catch { toast('Não deu pra salvar a mudança.', 'erro'); carregar(); }
  };

  const paraTodos = async (tipo) => {
    await Promise.all(fichas.map((row) => {
      const f = fichaDoBanco(row);
      const r = tipo === 'rodada' ? novaRodada(estadoDoMotor(f), { aliviarPdE: aliviarTodos, folegoMax: folegoMaximo(f) }) : passarTurno(estadoDoMotor(f));
      return salvarComoMestre(row, aplicarEstadoDoMotor(f, r.estado));
    }));
    som.tocar(tipo === 'rodada' ? 'rodada' : 'turno');
    toast(tipo === 'rodada' ? 'Nova rodada para todos.' : 'Turno passado para todos.');
  };

  const nomes = useMemo(() => [...new Set(fichas.map((f) => f.nome_personagem))], [fichas]);
  const lista = filtro ? rolagens.filter((r) => r.nome_personagem === filtro) : rolagens;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <Titulo>Fichas · {fichas.length}</Titulo>
          {mestre && fichas.length > 0 && (
            <div className="flex gap-2">
              <label className="flex items-center gap-2 text-[14px] text-suave"><input type="checkbox" checked={aliviarTodos} onChange={(e) => setAliviarTodos(e.target.checked)} />−2 PdE na rodada</label>
              <button type="button" className="btn btn-mini" onClick={() => paraTodos('turno')}>Passar turno (todos)</button>
              <button type="button" className="btn btn-mini btn-ouro" onClick={() => paraTodos('rodada')}>Nova rodada (todos)</button>
            </div>
          )}
        </div>
        {fichas.length === 0 ? <p className="painel text-center text-mudo">Ninguém entrou ainda. Passe o código da sala.</p> : (
          <div className="space-y-3">
            {fichas.map((row) => (
              <CartaoJogador key={row.id} row={row} mestre={mestre} aberto={aberta === row.id} aoAbrir={() => setAberta(aberta === row.id ? null : row.id)} aoSalvar={salvarComoMestre} />
            ))}
          </div>
        )}
      </section>

      <section className="lg:sticky lg:top-16 lg:self-start">
        <div className="mb-3 flex items-center justify-between"><Titulo>Rolagens ao vivo</Titulo><span className="legenda">{lista.length}</span></div>
        <div className="mb-3 grid grid-cols-2 gap-2">
          <label><span className="campo-label">Filtrar jogador</span>
            <select className="entrada !py-1.5 !text-[14px]" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
              <option value="">Todos</option>{nomes.map((n) => <option key={n}>{n}</option>)}
            </select></label>
          <label><span className="campo-label">{mestre ? 'Teste: DJ' : 'DJ de referência'}</span>
            <input className="entrada !py-1.5 !text-[14px]" type="number" inputMode="numeric" placeholder="ex: 14" value={dj} onChange={(e) => setDj(e.target.value)} /></label>
        </div>
        {dj !== '' && <p className="mb-2 text-[13px] text-suave">Cada rolagem abaixo mostra se passou ou falhou contra a DJ {dj}.</p>}
        <ul className="max-h-[70vh] space-y-2 overflow-y-auto pr-1" aria-live="polite">
          {lista.length === 0 ? <li className="py-6 text-center text-[15px] text-mudo">Aguardando a primeira rolagem…</li>
            : lista.map((r) => <ItemRolagem key={r.id} r={r} dj={dj} destacar={novas.has(r.id)} />)}
        </ul>
      </section>
    </div>
  );
}
