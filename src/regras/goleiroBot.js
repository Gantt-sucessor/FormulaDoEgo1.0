// Fórmula do Ego — Goleiro bot (NPC do mestre)
// Rola sozinho as jogadas de goleiro do livro: Defesa de goleiro (Agilidade, Destreza), Espalmar (Instintos,
// Destreza) e Erguer base (Constância + Posicionamento ÷ 2, DJ 10, +2 por turno seguido).
// O livro não define atributos para um goleiro NPC: começam zerados e o mestre preenche.

import { rolarJogada } from './dados.js';
import { ATRIBUTOS } from '../data/atributos.js';
import { PERICIAS } from '../data/pericias.js';

// Todos os atributos (−1 a +4, como na criação) e todas as perícias (0 a 5) do livro, zerados.
export const LIMITES_BOT = { atributo: [-1, 4], pericia: [0, 5] };
export const BOT_PADRAO = {
  nome: 'Goleiro bot',
  ...Object.fromEntries(ATRIBUTOS.map((a) => [a.id, 0])),
  ...Object.fromEntries(PERICIAS.map((p) => [p.id, 0])),
};

export const JOGADAS_BOT = {
  defesa_de_goleiro: { nome: 'Defesa de goleiro', atributo: 'destreza', pericia: 'agilidade', acao: '2 reações' },
  espalmar: { nome: 'Espalmar', atributo: 'destreza', pericia: 'instintos', acao: '1 reação' },
};

/** Perícia de Erguer base = (Constância + Posicionamento) ÷ 2; o livro manda arredondar para cima. */
export const periciaErguerBase = (bot) => Math.ceil(((bot.constancia || 0) + (bot.posicionamento || 0)) / 2);

/** DJ de Erguer base: 10, +2 por turno seguido já mantido. */
export const djErguerBase = (turnosSeguidos = 0) => 10 + 2 * Math.max(0, turnosSeguidos);

/** Rola uma jogada do bot. `tipo`: defesa_de_goleiro | espalmar | erguer_base. */
export function rolarJogadaBot(tipo, bot, { vantagens = 0, desvantagens = 0, bonus = 0, aleatorio = Math.random } = {}) {
  if (tipo === 'erguer_base') {
    const r = rolarJogada({ valorAtributo: bot.cognicao, valorPericia: periciaErguerBase(bot), vantagens, desvantagens, bonus, aleatorio });
    return { ...r, atributoNome: 'Cognição', periciaNome: 'Constância + Posicionamento ÷ 2' };
  }
  const j = JOGADAS_BOT[tipo];
  if (!j) throw new Error(`Jogada de goleiro desconhecida: ${tipo}`);
  const r = rolarJogada({ valorAtributo: bot[j.atributo], valorPericia: bot[j.pericia], vantagens, desvantagens, bonus, aleatorio });
  return { ...r, atributoNome: 'Destreza', periciaNome: j.nome === 'Espalmar' ? 'Instintos' : 'Agilidade' };
}

/**
 * Bola chutada contra o bot. Empate = trave (a bola volta metade do caminho).
 * Espalmar vencendo: a bola volta metade da trajetória e fica livre; Defesa vencendo: toma posse.
 */
export function confrontoChute(chute, defesa, tipo = 'defesa_de_goleiro') {
  if (defesa > chute) return { resultado: 'defendeu', texto: tipo === 'espalmar' ? 'Espalmou! A bola volta metade da trajetória e fica livre.' : 'Defendeu! Toma posse e é obrigado a passar logo em seguida.' };
  if (defesa === chute) return { resultado: 'trave', texto: 'Empate: bateu na trave! A bola volta metade do caminho.' };
  return { resultado: 'gol', texto: 'Gol! A defesa não alcançou o chute.' };
}

/** Dado de Potência no pênalti: Potência −1/0 = d2, +1 = d4, +2 = d6, +3 = d8, +4 ou mais = d10. */
export function facesPotencia(potencia) {
  if (potencia <= 0) return 2;
  return Math.min(2 + 2 * potencia, 10);
}

const dado = (faces, aleatorio) => Math.floor(aleatorio() * faces) + 1;

/**
 * Pênalti: o livro manda chutador e goleiro rolarem "dados iguais baseados em Potência" ao mesmo tempo, então os dois
 * usam o MESMO dado, o da Potência do chutador. Empate: o goleiro defende ("defesa de goleiro").
 * `rebaixar`: o goleiro baixa o próprio dado uma patente (espalmar); se ainda assim vencer, todos reagem gastando 1 reação em vez de 2.
 */
export function rolarPenalti({ potenciaChutador, rebaixar = false, aleatorio = Math.random }) {
  const facesChute = facesPotencia(potenciaChutador);
  let facesBot = facesChute;
  if (rebaixar) facesBot = Math.max(2, facesBot - 2);
  const chute = dado(facesChute, aleatorio);
  const defesa = dado(facesBot, aleatorio);
  const defendeu = defesa >= chute; // empate favorece o goleiro
  return {
    facesChute, facesBot, chute, defesa, defendeu,
    espalmou: defendeu && rebaixar,
    texto: defendeu
      ? (defesa === chute ? 'Empate: o goleiro defende. ' : '') + (rebaixar ? 'Espalmou — todos reagem gastando 1 reação.' : 'Defesa de goleiro — todos reagem gastando 2 reações.')
      : 'Gol!',
  };
}
