import { useMemo, useState } from 'react';
import { Titulo } from './ui.jsx';
import { supabase } from '../lib/supabase.js';
import { som } from '../lib/som.js';
import { useToast } from '../lib/toast.jsx';
import { getBotGoleiro, setBotGoleiro } from '../lib/local.js';
import { BOT_PADRAO, JOGADAS_BOT, confrontoChute, djErguerBase, facesPotencia, periciaErguerBase, rolarJogadaBot, rolarPenalti } from '../regras/goleiroBot.js';

const CAMPOS = [
  ['destreza', 'Destreza'], ['cognicao', 'Cognição'], ['potencia', 'Potência'],
  ['agilidade', 'Agilidade'], ['instintos', 'Instintos'], ['constancia', 'Constância'], ['posicionamento', 'Posicionamento'],
];

const COR = { defendeu: 'text-ok', trave: 'text-ouro', gol: 'text-perigo' };

/** Goleiro bot do mestre: rola as jogadas de goleiro sozinho e compara com o chute escolhido. */
export function GoleiroBot({ campanha, rolagens, aoRolar }) {
  const toast = useToast();
  const [bot, setBot] = useState(() => ({ ...BOT_PADRAO, ...getBotGoleiro(campanha.id) }));
  const [aberto, setAberto] = useState(true);
  const [ajustes, setAjustes] = useState(false);
  const [vant, setVant] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [chuteId, setChuteId] = useState('');
  const [turnos, setTurnos] = useState(0);
  const [potChute, setPotChute] = useState(1);
  const [ultimo, setUltimo] = useState(null);

  const chutes = useMemo(() => rolagens.filter((r) => !r.detalhe?.tipo && !r.detalhe?.bot).slice(0, 12), [rolagens]);
  const chute = chutes.find((r) => r.id === chuteId) || chutes[0] || null;

  const mudar = (campo, valor) => {
    const novo = { ...bot, [campo]: campo === 'nome' ? valor : Math.max(-1, Math.min(8, Number(valor) || 0)) };
    setBot(novo); setBotGoleiro(campanha.id, novo);
  };

  const publicar = async (jogada, resultado, detalhe) => {
    const linha = { campanha_id: campanha.id, ficha_id: null, nome_personagem: bot.nome || 'Goleiro bot', jogada, resultado, detalhe: { ...detalhe, bot: true } };
    const { data, error } = await supabase.from('rolagens').insert(linha).select().single();
    if (error || !data) {
      // O banco só aceita rolagens de fichas de jogador: mostra só para o mestre.
      aoRolar({ ...linha, id: `bot-${Date.now()}`, criada_em: new Date().toISOString() });
      toast('Rolagem do bot só aparece para você (o banco não deixa o mestre publicar).');
    } else aoRolar(data);
  };

  const rolar = async (tipo) => {
    const r = rolarJogadaBot(tipo, bot, { vantagens: vant, desvantagens: 0, bonus });
    const nome = tipo === 'erguer_base' ? 'Erguer base' : JOGADAS_BOT[tipo].nome;
    let veredito = null;
    if (tipo === 'erguer_base') {
      const dj = djErguerBase(turnos);
      veredito = { resultado: r.resultado >= dj ? 'defendeu' : 'gol', texto: r.resultado >= dj ? `Base firme (DJ ${dj}): defesa de goleiro/espalmar gastam 1 reação a menos.` : `Base falhou (DJ ${dj}).` };
    } else if (chute) {
      veredito = confrontoChute(chute.resultado, r.resultado, tipo);
      veredito.texto += ` (chute ${chute.resultado} de ${chute.nome_personagem} × ${r.resultado})`;
    }
    som.rolagem(r);
    setUltimo({ nome, r, veredito });
    try { await publicar(nome, r.resultado, { ...r, ...(veredito ? { notas: [veredito.texto] } : {}) }); } catch { toast('Não deu pra publicar a rolagem.', 'erro'); }
  };

  const penalti = async (rebaixar) => {
    const p = rolarPenalti({ potenciaChutador: potChute, potenciaBot: bot.potencia, rebaixar });
    som.tocar(p.defendeu ? 'turno' : 'rodada');
    setUltimo({ nome: rebaixar ? 'Pênalti (espalmar)' : 'Pênalti', penalti: p, veredito: { resultado: p.defendeu ? 'defendeu' : 'gol', texto: p.texto } });
    try {
      await publicar(rebaixar ? 'Pênalti — espalmar' : 'Pênalti — defesa', p.defesa, { tipo: 'acao', texto: `Chutador d${p.facesChute}: ${p.chute} × Goleiro d${p.facesBot}: ${p.defesa}. ${p.texto}` });
    } catch { toast('Não deu pra publicar a rolagem.', 'erro'); }
  };

  return (
    <section className="painel">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <Titulo>{bot.nome || 'Goleiro bot'}</Titulo>
        <div className="flex gap-2">
          <button type="button" className="btn btn-mini" onClick={() => setAjustes(!ajustes)}>{ajustes ? 'Fechar ajustes' : 'Ajustar atributos'}</button>
          <button type="button" className="btn btn-mini" aria-expanded={aberto} onClick={() => setAberto(!aberto)}>{aberto ? 'Recolher' : 'Expandir'}</button>
        </div>
      </div>
      {aberto && (
        <div className="space-y-3">
          {ajustes && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <label className="col-span-2 sm:col-span-4"><span className="campo-label">Nome</span><input className="entrada !py-1.5" value={bot.nome} onChange={(e) => mudar('nome', e.target.value)} /></label>
              {CAMPOS.map(([c, rot]) => (
                <label key={c}><span className="campo-label">{rot}</span><input className="entrada !py-1.5" type="number" min="-1" max="8" value={bot[c]} onChange={(e) => mudar(c, e.target.value)} /></label>
              ))}
            </div>
          )}
          <p className="text-[13px] text-mudo">O livro não traz atributos para um goleiro NPC: preencha em “Ajustar atributos”.</p>
          <p className="text-[13px] text-suave">Destreza {bot.destreza} · Cognição {bot.cognicao} · Agilidade {bot.agilidade} · Instintos {bot.instintos} · Erguer base {periciaErguerBase(bot)}</p>

          <div className="grid grid-cols-2 gap-2">
            <label><span className="campo-label">Vantagens do bot</span><input className="entrada !py-1.5" type="number" min="0" max="5" value={vant} onChange={(e) => setVant(Math.max(0, Number(e.target.value) || 0))} /></label>
            <label><span className="campo-label">Bônus fixo</span><input className="entrada !py-1.5" type="number" value={bonus} onChange={(e) => setBonus(Number(e.target.value) || 0)} /></label>
          </div>

          <label><span className="campo-label">Chute a defender</span>
            <select className="entrada !py-1.5 !text-[14px]" value={chute?.id || ''} onChange={(e) => setChuteId(e.target.value)}>
              {chutes.length === 0 && <option value="">Nenhum chute na fita ainda</option>}
              {chutes.map((r) => <option key={r.id} value={r.id}>{r.nome_personagem} · {r.jogada} · {r.resultado}</option>)}
            </select></label>

          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-ouro" onClick={() => rolar('defesa_de_goleiro')}>Defesa de goleiro</button>
            <button type="button" className="btn" onClick={() => rolar('espalmar')}>Espalmar</button>
            <button type="button" className="btn" onClick={() => rolar('erguer_base')}>Erguer base (DJ {djErguerBase(turnos)})</button>
          </div>
          <label className="flex items-center gap-2 text-[14px] text-suave">Turnos seguidos de base:
            <input className="entrada !w-20 !py-1" type="number" min="0" value={turnos} onChange={(e) => setTurnos(Math.max(0, Number(e.target.value) || 0))} />
          </label>

          <div className="rounded border border-linha p-2">
            <div className="legenda text-ouro">Pênalti (dados de Potência)</div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[14px] text-suave">
              <label className="flex items-center gap-2">Potência do chutador
                <input className="entrada !w-20 !py-1" type="number" min="-1" max="8" value={potChute} onChange={(e) => setPotChute(Number(e.target.value) || 0)} /></label>
              <span>d{facesPotencia(potChute)} × d{facesPotencia(bot.potencia)}</span>
              <button type="button" className="btn btn-mini" onClick={() => penalti(false)}>Rolar pênalti</button>
              <button type="button" className="btn btn-mini" onClick={() => penalti(true)}>Rebaixar dado (espalmar)</button>
            </div>
          </div>

          {ultimo && (
            <div className="rounded border border-ciano bg-ciano/5 p-2" aria-live="polite">
              <div className="flex items-baseline justify-between">
                <strong className="uppercase tracking-[0.1em]">{ultimo.nome}</strong>
                <span className="text-2xl font-bold text-ciano">{ultimo.penalti ? `${ultimo.penalti.chute} × ${ultimo.penalti.defesa}` : ultimo.r.resultado}</span>
              </div>
              {ultimo.r && <p className="text-[13px] text-suave">{ultimo.r.detalheBase}{ultimo.r.rolagensAtributo.length ? ` + ${ultimo.r.rolagensAtributo.length}d6 [${ultimo.r.rolagensAtributo.join(', ')}]` : ''}{ultimo.r.rolagensVantagem.length ? ` + vantagem [${ultimo.r.rolagensVantagem.join(', ')}]` : ''} + perícia {ultimo.r.valorPericia}{ultimo.r.bonus ? ` ${ultimo.r.bonus > 0 ? '+' : '−'} ${Math.abs(ultimo.r.bonus)}` : ''}</p>}
              {ultimo.r?.execucaoAbsoluta && <p className={`text-[13px] font-bold uppercase ${ultimo.r.execucaoAbsoluta.tipo === 'positiva' ? 'text-ok' : 'text-perigo'}`}>{ultimo.r.execucaoAbsoluta.tipo === 'positiva' ? 'Execução absoluta! · crítico' : 'Falha absoluta · falha crítica'}</p>}
              {ultimo.veredito && <p className={`font-bold ${COR[ultimo.veredito.resultado]}`}>{ultimo.veredito.texto}</p>}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
