// Fórmula do Ego — Motor de dados
// Fórmula base: d12 + [atributo x d6] + perícia
// +1 no atributo = +1D6 na jogada. Atributo -1 = rola 2D12, pega o menor.
// Vantagens: +1D6 cada. Desvantagens: -1D6 cada. Bônus: soma/subtrai direto do resultado.
// Execução absoluta positiva: tirou 12 no d12 = +5 na jogada + 1 PdS.
// Execução absoluta negativa: tirou 1 no d12 = -5 na jogada, +1 PdE, -1 PdS.

function rolarDado(faces, aleatorio = Math.random) {
  return Math.floor(aleatorio() * faces) + 1;
}

function rolarD12ComAtributo(valorAtributo, aleatorio) {
  if (valorAtributo === -1) {
    const a = rolarDado(12, aleatorio);
    const b = rolarDado(12, aleatorio);
    return { valor: Math.min(a, b), detalhe: `2d12 (pega o menor): [${a}, ${b}]` };
  }
  const d = rolarDado(12, aleatorio);
  return { valor: d, detalhe: `d12: ${d}` };
}

/**
 * Rola uma jogada completa.
 * @param {Object} params
 * @param {number} params.valorAtributo - valor do atributo (-1 a +4)
 * @param {number} params.valorPericia - pontos na perícia (0 a 5)
 * @param {number} [params.vantagens=0] - vantagens acumuladas (cada = +1d6)
 * @param {number} [params.desvantagens=0] - desvantagens acumuladas (cada = -1d6)
 * @param {number} [params.bonus=0] - bônus fixo somado/subtraído do resultado final
 */
export function rolarJogada({ valorAtributo, valorPericia = 0, vantagens = 0, desvantagens = 0, bonus = 0, aleatorio = Math.random }) {
  const base = rolarD12ComAtributo(valorAtributo, aleatorio);

  const dadosAtributo = Math.max(valorAtributo, 0);
  const rolagensAtributo = Array.from({ length: dadosAtributo }, () => rolarDado(6, aleatorio));

  const dadosVantagem = Math.max(vantagens - desvantagens, 0);
  const dadosDesvantagem = Math.max(desvantagens - vantagens, 0);
  const rolagensExtra = Array.from({ length: dadosVantagem }, () => rolarDado(6, aleatorio));
  const rolagensDesvantagem = Array.from({ length: dadosDesvantagem }, () => rolarDado(6, aleatorio));

  const somaD6 = [...rolagensAtributo, ...rolagensExtra].reduce((a, b) => a + b, 0);
  const somaDesvantagem = rolagensDesvantagem.reduce((a, b) => a + b, 0);

  let resultado = base.valor + somaD6 - somaDesvantagem + valorPericia + bonus;

  let execucaoAbsoluta = null;
  if (base.valor === 12) {
    resultado += 5;
    execucaoAbsoluta = { tipo: 'positiva', texto: '+5 na jogada, +1 PdS' };
  } else if (base.valor === 1) {
    resultado -= 5;
    execucaoAbsoluta = { tipo: 'negativa', texto: '-5 na jogada, +1 PdE, -1 PdS' };
  }

  return {
    resultado,
    detalheBase: base.detalhe,
    rolagensAtributo,
    rolagensVantagem: rolagensExtra,
    rolagensDesvantagem,
    desvantagensLiquidas: dadosDesvantagem,
    valorPericia,
    bonus,
    execucaoAbsoluta,
  };
}

/**
 * Compara um resultado de jogada contra uma DJ (número, ou usado externamente para J vs J).
 */
export function contraDj(resultado, dj) {
  return resultado >= dj;
}

/**
 * Resolve uma jogada contra uma DJ numérica. DJs textuais ficam pendentes
 * porque precisam do resultado ou estado de outro personagem.
 */
export function resolverJogada(resultado, dj) {
  if (!Number.isFinite(dj)) {
    return { resolvida: false, sucesso: null, margem: null, dj };
  }
  const sucesso = contraDj(resultado, dj);
  return { resolvida: true, sucesso, margem: resultado - dj, dj };
}
