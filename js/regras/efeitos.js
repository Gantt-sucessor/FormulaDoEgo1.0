// Fórmula do Ego — Catálogo de efeitos
// Efeitos com "acumulativo: true" empilham em quantidade (símbolo ߷ no livro original).

export const EFEITOS_NEGATIVOS = {
  exausto: { nome: 'Exausto', texto: '-5 em todas as perícias, -2 fôlegos máximos, -1 reação até o fim.', acumulativo: false },
  caido: { nome: 'Caído / Imóvel', texto: 'Não pode se mover nem usar ações até o fim.', acumulativo: false },
  lesionado: {
    nome: 'Lesionado', acumulativo: true,
    texto: '1ª vez: 1 desvantagem em todos os atributos. 2ª vez: caído por 2 turnos + 1 desvantagem em todos. 3ª vez: retirado de jogo (temp. ou permanente).',
  },
  ego_ferido: {
    nome: 'Ego ferido', acumulativo: true,
    texto: '1ª vez: -3 em Ego. 2ª vez: -3 em resistir a qualquer teste + 1 desvantagem em Ego. 3ª vez: vira "ego quebrado" por 3 rodadas.',
  },
  ego_quebrado: { nome: 'Ego quebrado', texto: '-6 em qualquer jogada, -4 fôlegos máximos, -1 reação máxima, +3 PdE.', acumulativo: false },
  estressado: { nome: 'Estressado', texto: '1 desvantagem em testes de resistência, -3 em perícias de Cognição.', acumulativo: true },
  confuso: { nome: 'Confuso', texto: 'Jogadas de Destreza/Cognição/Potência são roladas 2x, pega o menor.', acumulativo: false },
};

export const EFEITOS_POSITIVOS = {
  inspirado: { nome: 'Inspirado', texto: '+2 em todas as perícias, anula 1 desvantagem, +1 fôlego máximo.', acumulativo: true },
  adrenalina: { nome: 'Adrenalina', texto: '+4 fôlegos máximos, +1 reação adicional.', acumulativo: false },
  furtivo: { nome: 'Furtivo', texto: 'Inimigos têm 2 desvantagens em jogadas com reação contra você e não podem usar Análise contra você.', acumulativo: false },
  no_ar: { nome: 'No ar', texto: 'Domínios/interceptações recebem +4 de bônus.', acumulativo: false },
  ego_alto: {
    nome: 'Ego alto', acumulativo: true,
    texto: '1ª vez: 1 vantagem em Ego. 2ª vez: 1 vantagem em resistir a qualquer teste + 1 vantagem em Ego. 3ª vez: vira "ego inflado" por 3 rodadas.',
  },
  ego_inflado: { nome: 'Ego inflado', texto: '+6 em qualquer jogada, +4 fôlegos máximos, +1 reação máxima, -3 PdE.', acumulativo: false },
};

export function buscarEfeito(id) {
  return EFEITOS_NEGATIVOS[id] || EFEITOS_POSITIVOS[id] || null;
}

/**
 * Aplica um efeito a uma lista de efeitos ativos de um personagem,
 * respeitando a regra de acumulação (soma quantidade x se acumulativo).
 */
export function aplicarEfeito(efeitosAtivos, idEfeito, duracaoTurnos) {
  const existente = efeitosAtivos.find((e) => e.id === idEfeito);
  const def = buscarEfeito(idEfeito);
  if (!def) return efeitosAtivos;

  if (existente && def.acumulativo) {
    existente.quantidade += 1;
    existente.duracaoTurnos = duracaoTurnos;
    return [...efeitosAtivos];
  }
  if (existente && !def.acumulativo) {
    existente.duracaoTurnos = duracaoTurnos;
    return [...efeitosAtivos];
  }
  return [...efeitosAtivos, { id: idEfeito, quantidade: 1, duracaoTurnos }];
}
