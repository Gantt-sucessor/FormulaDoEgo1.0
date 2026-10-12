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

/**
 * Efeitos que só existem por causa de uma arma (texto do livro). `tipo` diz se aparece como
 * benefício ou malefício na lista de condições; `origem` é o nome da arma que o libera.
 */
export const EFEITOS_DE_CLASSE = {
  adaptado: {
    nome: 'Adaptado', tipo: 'positivo', acumulativo: true, origem: 'Indômito Mutável',
    texto: 'Sempre que acumular x1, escolha uma jogada de J vs J: oponentes recebem -1 em executá-la contra você (acumulável, máx. -5 por jogada). Dura até o fim da partida.',
  },
  subjugado: {
    nome: 'Subjugado', tipo: 'negativo', acumulativo: false, origem: 'Tirano Atroz',
    texto: 'Alvo devorado pelo Tirano. Dura d4+1 turnos (1ª vez), d6+1 rodadas (2ª) ou até o fim da partida (3ª em diante). Falha automaticamente nos testes contra as habilidades do Tirano.',
  },
  orbitando: {
    nome: 'Orbitando', tipo: 'positivo', acumulativo: false, origem: 'Esqualo Sideral',
    texto: 'Só vale para o alvo do passe curto/antecipado. Quando o receptor se mover 1 m, você se move na mesma direção. Ao receber um passe, pode passar em vez de dominar/voleio. Dura até o aliado perder a posse.',
  },
  enaltecido: {
    nome: 'Enaltecido', tipo: 'positivo', acumulativo: false, origem: 'Graça Ascendente',
    texto: 'Você: pode usar cabeceios [defensivos] em passes altos, fica no ar e ignora bônus negativos. Aliado: ignora bônus negativos e recebe -1 PdE ao usar habilidades (exceto se já ganharia +1 PdE).',
  },
  destruido: {
    nome: 'Destruído', tipo: 'negativo', acumulativo: true, origem: 'Amálgamo Lúgubre',
    texto: 'Cada acúmulo: -1 na perícia usada no teste em que foi causado. Dura até o fim da partida (máx. igual ao consumir de quem causou, numa única perícia).',
  },
  travesso: {
    nome: 'Travesso', tipo: 'positivo', acumulativo: false, origem: 'Diabrete Arruaceiro',
    texto: 'Seus passes são passes altos para alvos estressados. Alvos que perderem em testes contra você ficam estressados até o fim do efeito. Trash talks causam +1x estressado.',
  },
};

export function buscarEfeito(id) {
  return EFEITOS_NEGATIVOS[id] || EFEITOS_POSITIVOS[id] || EFEITOS_DE_CLASSE[id] || null;
}

/** Catálogo único (negativos + positivos) pra popular a lista clicável do painel de partida. */
export const CATALOGO_EFEITOS_CLASSE = Object.entries(EFEITOS_DE_CLASSE).map(([id, def]) => ({ id, ...def }));

export const CATALOGO_EFEITOS = [
  ...Object.entries(EFEITOS_NEGATIVOS).map(([id, def]) => ({ id, tipo: 'negativo', ...def })),
  ...Object.entries(EFEITOS_POSITIVOS).map(([id, def]) => ({ id, tipo: 'positivo', ...def })),
];

/**
 * Ativa um efeito numa lista de efeitos ativos de um personagem, respeitando a regra
 * de acumulação (soma quantidade se acumulativo). Duração é texto livre anotado pelo
 * jogador (ex: "2 turnos", "3 rodadas") — não é controlado automaticamente.
 */
export function aplicarEfeito(efeitosAtivos, idEfeito, duracao = '') {
  const existente = efeitosAtivos.find((e) => e.id === idEfeito);
  const def = buscarEfeito(idEfeito);
  if (!def) return efeitosAtivos;

  // duracao pode ser texto livre ou { texto, turnos, rodadas } (contagem automática)
  const dados = typeof duracao === 'object' && duracao !== null ? duracao : { texto: duracao };
  const extra = { duracao: dados.texto || '' };
  if (typeof dados.turnos === 'number') extra.turnos = dados.turnos;
  if (typeof dados.rodadas === 'number') extra.rodadas = dados.rodadas;

  if (existente && def.acumulativo) {
    return efeitosAtivos.map((e) => (e.id === idEfeito ? { ...e, quantidade: e.quantidade + 1, ...extra } : e));
  }
  if (existente && !def.acumulativo) {
    // Reaplicar renova a contagem (a mais longa vale), sem empilhar
    return efeitosAtivos.map((e) => (e.id === idEfeito ? { ...e, ...extra } : e));
  }
  return [...efeitosAtivos, { id: idEfeito, quantidade: 1, ...extra }];
}

/** Remove um efeito inteiro da lista (independente da quantidade acumulada). */
export function removerEfeito(efeitosAtivos, idEfeito) {
  return efeitosAtivos.filter((e) => e.id !== idEfeito);
}

/**
 * Resumo curto de status de partida de uma ficha, pra mostrar no painel do mestre/sala
 * embaixo do nome: PdE atual, quantas das 6 ações já foram gastas na rodada e condições ativas.
 */
export function formatarResumoPartida(ficha) {
  const partes = [];
  if (typeof ficha.pde_atual === 'number') partes.push(`${ficha.pde_atual} PdE`);
  if (typeof ficha.pontos_sorte === 'number' && ficha.pontos_sorte > 0) partes.push(`${ficha.pontos_sorte} PdS`);

  const ag = ficha.acoes_gastas;
  if (ag) {
    const regularesGastas = (ag.regulares || []).filter(Boolean).length;
    const totalGasto = (ag.tatica ? 1 : 0) + (ag.egoista ? 1 : 0) + regularesGastas;
    if (totalGasto > 0) partes.push(`${totalGasto}/6 ações usadas`);
  }

  const efeitos = ficha.efeitos_ativos || [];
  if (efeitos.length > 0) {
    const nomes = efeitos.map((e) => {
      const def = buscarEfeito(e.id);
      const nome = def ? def.nome : e.id;
      return e.quantidade > 1 ? `${nome} x${e.quantidade}` : nome;
    });
    partes.push(nomes.join(', '));
  }

  return partes.join(' · ');
}
