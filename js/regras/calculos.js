// Fórmula do Ego — Cálculos derivados

/** Fôlegos = 6 + Constância */
export function calcularFolegos(constancia) {
  return 6 + constancia;
}

/** Iniciativa = 5 + Momento (passiva) */
export function calcularIniciativa(momento) {
  return 5 + momento;
}

/** Distância de chute (DdC) = 6 + Precisão */
export function calcularDdC(precisao) {
  return 6 + precisao;
}

/** Distância de passe (DdP) = 6 + Visão de jogo */
export function calcularDdP(visaoDeJogo) {
  return 6 + visaoDeJogo;
}

/** Tamanho da zona dourada de acordo com o valor final de Ego */
export function tamanhoZonaDourada(valorEgo) {
  if (valorEgo >= 4) return { tamanho: '3x3', ativa: true };
  if (valorEgo === 3) return { tamanho: '2x2', ativa: true };
  if (valorEgo >= 1) return { tamanho: '1x1', ativa: true };
  return { tamanho: null, ativa: false };
}

/**
 * Pontos de exaustão: ao chegar em 8 PdE, rola d4.
 * Retorna o efeito correspondente.
 */
export function resolverLimitePdE() {
  const resultado = Math.floor(Math.random() * 4) + 1;
  const efeitos = {
    1: { nome: 'Exausto', duracao: 'd2+1 turnos' },
    2: { nome: 'Exausto', duracao: 'd4+2 turnos' },
    3: { nome: 'Exausto', duracao: 'd8+3 turnos' },
    4: { nome: 'Caído', duracao: '2 rodadas + 4 turnos' },
  };
  return { rolagem: resultado, efeito: efeitos[resultado], pdeRestante: 7 };
}

/** Verifica se um personagem está em flanqueamento (2+ oponentes adjacentes) */
export function estaFlanqueado(quantidadeOponentesAdjacentes) {
  return quantidadeOponentesAdjacentes >= 2;
}

/** Custo de PdS e seus efeitos disponíveis */
export const CUSTOS_PDS = {
  1: ['+1 vantagem adicional na jogada', '+3 fôlegos na rodada', '+1 reação adicional'],
  2: ['+2 vantagens adicionais na jogada', '+5 fôlegos na rodada', '+1 reação e +1 ação egoísta adicional'],
  3: ['Vitória garantida em uma jogada J vs J', '+8 fôlegos na rodada', '+1 reação, +1 ação egoísta e +1 ação tática adicionais'],
};

export const MAX_PDS_PADRAO = 3;
