// Fórmula do Ego — Bônus automáticos
//
// Um "mod" descreve o que um efeito ou uma habilidade usada dá nas jogadas:
//   { jogadas?: [ids], pericias?: [ids], atributosDasPericias?: [ids], todas?: true,
//     vantagens?, desvantagens?, bonus?, distancia?: { chute?, passe? }, consome?: 'jogada', rotulo? }
// Quem casa com a jogada soma vantagens/desvantagens/bônus automaticamente. Mods com consome: 'jogada'
// (ex.: "chute regular com 1 vantagem") valem só para a PRÓXIMA jogada que casar e depois somem.

import { JOGADAS } from '../data/jogadas.js';
import { PERICIAS } from '../data/pericias.js';
import { buscarEfeito } from './efeitos.js';

const TODAS_JOGADAS = Object.values(JOGADAS).flat();
export const jogadaPorId = (id) => TODAS_JOGADAS.find((j) => j.id === id) || null;
const nomeJogada = (id) => jogadaPorId(id)?.nome || id;
const nomePericia = (id) => PERICIAS.find((p) => p.id === id)?.nome || id;

/** Mods dos efeitos do catálogo do livro (valem enquanto o efeito estiver ativo). */
function modsDoCatalogo(e) {
  const q = e.quantidade || 1;
  switch (e.id) {
    case 'inspirado': return [{ todas: true, bonus: 2 * q, rotulo: 'Inspirado: +2 em todas as perícias' }];
    case 'exausto': return [{ todas: true, bonus: -5, rotulo: 'Exausto: −5 em todas as perícias' }];
    case 'ego_inflado': return [{ todas: true, bonus: 6, rotulo: 'Ego inflado: +6 em qualquer jogada' }];
    case 'ego_quebrado': return [{ todas: true, bonus: -6, rotulo: 'Ego quebrado: −6 em qualquer jogada' }];
    case 'no_ar': return [{ jogadas: ['dominio', 'interceptacao'], bonus: 4, rotulo: 'No ar: +4 em domínio e interceptação' }];
    case 'estressado': return [{ atributosDasPericias: ['cognicao'], bonus: -3, rotulo: 'Estressado: −3 em perícias de Cognição' }];
    case 'lesionado': return [{ todas: true, desvantagens: 1, rotulo: 'Lesionado: 1 desvantagem' }];
    default: return [];
  }
}

/** Todos os mods ativos agora, cada um com a fonte (nome do efeito/habilidade) e o id do efeito. */
export function modsAtivos(efeitos = []) {
  const lista = [];
  for (const e of efeitos) {
    const fonte = e.nome || buscarEfeito(e.id)?.nome || e.id;
    const mods = Array.isArray(e.mods) ? e.mods : modsDoCatalogo(e);
    mods.forEach((m) => lista.push({ ...m, fonte, efeitoId: e.id }));
  }
  return lista;
}

function casa(mod, jogada) {
  if (mod.todas) return !!jogada.pericia || !!jogada.pericias_compostas || !!jogada.atributo;
  if (mod.jogadas?.includes(jogada.id)) return true;
  const ids = jogada.pericias_compostas || (jogada.pericia ? [jogada.pericia] : []);
  if (mod.pericias && ids.some((p) => mod.pericias.includes(p))) return true;
  if (mod.atributosDasPericias && ids.some((p) => mod.atributosDasPericias.includes(PERICIAS.find((x) => x.id === p)?.atributo))) return true;
  return false;
}

/** O que se soma automaticamente nessa jogada. */
export function modsParaJogada(efeitos, jogada) {
  const r = { vantagens: 0, desvantagens: 0, bonus: 0, fontes: [], consumir: [] };
  modsAtivos(efeitos).filter((m) => casa(m, jogada)).forEach((m) => {
    r.vantagens += m.vantagens || 0;
    r.desvantagens += m.desvantagens || 0;
    r.bonus += m.bonus || 0;
    r.fontes.push({ fonte: m.fonte, texto: descreverMod(m), unica: m.consome === 'jogada' });
    if (m.consome === 'jogada' && !r.consumir.includes(m.efeitoId)) r.consumir.push(m.efeitoId);
  });
  return r;
}

/** Metros a mais na distância de chute/passe vindos de efeitos ativos. */
export function modDistancia(efeitos, tipo) {
  return modsAtivos(efeitos).reduce((s, m) => s + (m.distancia?.[tipo] || 0), 0);
}

export function fontesDeDistancia(efeitos, tipo) {
  return modsAtivos(efeitos).filter((m) => m.distancia?.[tipo]).map((m) => `${m.fonte} +${m.distancia[tipo]} m`);
}

/** Depois da jogada: os mods "só para a próxima jogada" saem; se o efeito não tiver mais nada, ele some. */
export function consumirEfeitos(efeitos, ids) {
  if (!ids?.length) return efeitos;
  return efeitos.flatMap((e) => {
    if (!ids.includes(e.id) || !Array.isArray(e.mods)) return [e];
    const restantes = e.mods.filter((m) => m.consome !== 'jogada');
    return restantes.length ? [{ ...e, mods: restantes }] : [];
  });
}

const sinal = (n) => (n > 0 ? `+${n}` : `${n}`);

/** "1 vantagem e +3 em Chute regular, +2 m na distância de chute" */
export function descreverMod(m) {
  const efeito = [];
  if (m.vantagens) efeito.push(`${m.vantagens} vantagem${m.vantagens > 1 ? 's' : ''}`);
  if (m.desvantagens) efeito.push(`${m.desvantagens} desvantagem${m.desvantagens > 1 ? 's' : ''}`);
  if (m.bonus) efeito.push(`${sinal(m.bonus)} de bônus`);
  let onde = '';
  if (m.todas) onde = ' em qualquer jogada';
  else if (m.jogadas?.length) onde = ` em ${m.jogadas.map(nomeJogada).join(' / ')}`;
  else if (m.pericias?.length) onde = ` em ${m.pericias.map(nomePericia).join(' / ')}`;
  else if (m.atributosDasPericias?.length) onde = ` nas perícias de ${m.atributosDasPericias.join(' / ')}`;
  const partes = [];
  if (efeito.length) partes.push(`${efeito.join(' e ')}${onde}`);
  if (m.distancia?.chute) partes.push(`${sinal(m.distancia.chute)} m na distância de chute`);
  if (m.distancia?.passe) partes.push(`${sinal(m.distancia.passe)} m na distância de passe`);
  return partes.join(', ') + (m.consome === 'jogada' ? ' (próxima jogada)' : '');
}
