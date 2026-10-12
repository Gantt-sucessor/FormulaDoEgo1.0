// Fórmula do Ego — Automação de habilidades ativas
// Lê as siglas do livro (Esf./Dis./Dur./TdA/Prep./G.Ex.) e transforma em ações na ficha:
// PdE, fôlegos, PdS, ações da rodada, efeitos com contagem de turnos/rodadas, "uma vez em fluxo".
// Tudo aqui é função pura: recebe o estado da partida e devolve um estado novo.

import { aplicarEfeito, buscarEfeito } from './efeitos.js';

export const LIMITE_PDE = 8;

export function normalizar(texto) {
  return String(texto ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

// ---------------------------------------------------------------------------
// Leitura das siglas
// ---------------------------------------------------------------------------

/** TdA: quais ações a habilidade gasta. Trechos entre [] ou () são opcionais. */
export function parseTdA(tda) {
  const bruto = normalizar(tda);
  const vazio = { tatica: false, egoista: false, movimento: false, reacoes: 0, opcional: { reacoes: 0, tatica: false, egoista: false }, ou: false, livre: true };
  if (!bruto || bruto === '-') return vazio;

  const opcional = { reacoes: 0, tatica: false, egoista: false };
  let principal = bruto;
  for (const m of bruto.matchAll(/[\[(]([^\])]*)[\])]/g)) {
    const dentro = m[1];
    const n = dentro.match(/(\d+)\s*reacoes?/);
    if (n) opcional.reacoes += Number(n[1]);
    else if (/reacao|\+\s*$|^\s*\+\s*$/.test(dentro)) opcional.reacoes += 1;
    if (/acao tatica/.test(dentro)) opcional.tatica = true;
    if (/acao egoista/.test(dentro)) opcional.egoista = true;
    principal = principal.replace(m[0], ' ');
  }
  // "2 reações OU ação egoísta": usa a primeira alternativa e sinaliza
  const ou = /\bou\b/.test(principal);
  if (ou) principal = principal.split(/\bou\b/)[0];

  let reacoes = 0;
  const numeradas = [...principal.matchAll(/(\d+)\s*reacoes?/g)];
  if (numeradas.length) reacoes = numeradas.reduce((t, m) => t + Number(m[1]), 0);
  else if (/reacao/.test(principal)) reacoes = 1;

  return {
    tatica: /acao tatica/.test(principal),
    egoista: /acao egoista/.test(principal),
    movimento: /acao de movimento/.test(principal),
    reacoes,
    opcional,
    ou,
    livre: false,
  };
}

/** Esf.: PdE ganhos. Valor entre [] ou () é o extra opcional. */
export function parseEsforco(esf) {
  const texto = String(esf ?? '');
  const base = Number((texto.match(/^\s*\+?\s*(\d+)/) || [])[1] || 0);
  const extra = Number((texto.match(/[\[(]\s*\+?\s*(\d+)/) || [])[1] || 0);
  return { base, extra };
}

/** G.Ex.: gasto extra de fôlegos e/ou PdS. */
export function parseGex(gex) {
  const t = normalizar(gex);
  return {
    folegos: Number((t.match(/(\d+)\s*folego/) || [])[1] || 0),
    pds: Number((t.match(/(\d+)\s*pds/) || [])[1] || 0),
  };
}

/** Prep.: "P/2 turnos" (preparo de 2 turnos). */
export function parsePrep(prep) {
  const m = normalizar(prep).match(/([a-z])\s*\/\s*(\d+)\s*turno/);
  return m ? { tipo: m[1].toUpperCase(), turnos: Number(m[2]) } : null;
}

/** Exige estar com a bola, sem a bola, ou tanto faz. */
export function condicaoDeBola(h) {
  const cond = normalizar(h?.condicao);
  if (/sem a bola/.test(cond)) return 'sem';
  if (/com a bola/.test(cond)) return 'com';
  const texto = normalizar(h?.texto);
  if (/ao estar com ou sem a bola|com ou sem a bola/.test(texto)) return 'qualquer';
  if (/ao estar sem a bola/.test(texto)) return 'sem';
  if (/ao estar com a bola/.test(texto)) return 'com';
  return 'qualquer';
}

export function somenteUmaVezEmFluxo(h) {
  return /uma vez em fluxo/.test(normalizar(h?.condicao)) || h?.tipo === 'fluxo';
}

// ---------------------------------------------------------------------------
// Duração
// ---------------------------------------------------------------------------

const PERICIA_POR_PREFIXO = [
  ['precis', 'precisao'], ['trajet', 'trajetoria'], ['especial', 'especializacao'],
  ['agilid', 'agilidade'], ['constanc', 'constancia'], ['instint', 'instintos'],
  ['muscul', 'musculos'], ['agressiv', 'agressividade'], ['escud', 'escudo'],
  ['visao', 'visao_de_jogo'], ['moment', 'momento'], ['posicion', 'posicionamento'],
  ['criativ', 'criatividade'], ['pressao', 'pressao'], ['posse', 'posse'],
  ['emocion', 'emocional'], ['consum', 'consumir'], ['determin', 'determinacao'],
];
const ATRIBUTO_POR_PREFIXO = [
  ['cognic', 'cognicao'], ['drible', 'drible'], ['potenc', 'potencia'],
  ['robust', 'robustez'], ['destre', 'destreza'],
];

function valorDeNome(nome, ctx) {
  const t = normalizar(nome).replace(/\.$/, '').trim();
  const per = PERICIA_POR_PREFIXO.find(([p]) => t.startsWith(p));
  if (per) return ctx.pericias?.[per[1]] ?? 0;
  if (t === 'ego') return ctx.atributos?.ego ?? 0;
  const atr = ATRIBUTO_POR_PREFIXO.find(([p]) => t.startsWith(p));
  if (atr) return ctx.atributos?.[atr[1]] ?? 0;
  return NaN;
}

function avaliarFator(fator, ctx, rolagens) {
  const f = fator.trim();
  if (!f) return NaN;
  if (/^\d+$/.test(f)) return Number(f);
  const dado = f.match(/^(\d*)d(\d+)$/);
  if (dado) {
    const qtd = Number(dado[1] || 1);
    const faces = Number(dado[2]);
    const aleatorio = ctx.aleatorio || Math.random;
    let soma = 0;
    for (let i = 0; i < qtd; i += 1) soma += Math.floor(aleatorio() * faces) + 1;
    rolagens.push(`${qtd > 1 ? qtd : ''}d${faces} = ${soma}`);
    return soma;
  }
  return valorDeNome(f, ctx);
}

function avaliarExpressao(expr, ctx, rolagens) {
  const termos = expr.split('+').map((t) => t.trim()).filter(Boolean);
  if (!termos.length) return NaN;
  let total = 0;
  for (const termo of termos) {
    const fatores = termo.split(/\s+x\s+|×/);
    let produto = 1;
    for (const fator of fatores) {
      const v = avaliarFator(fator, ctx, rolagens);
      if (Number.isNaN(v)) return NaN;
      produto *= v;
    }
    total += produto;
  }
  return total;
}

/**
 * Converte o texto de duração do livro em contagem.
 * Retorna { tipo: 'instantaneo' | 'tempo' | 'evento' | 'manual', turnos, rodadas, texto, rolagens }.
 * 'tempo' tem contagem automática; 'evento' (até sair do setor, até marcar gol…) e 'manual' (variável) não.
 */
export function resolverDuracao(dur, ctx = {}) {
  const texto = String(dur ?? '').trim();
  const n = normalizar(texto).replace(/\[[^\]]*\]/g, '');
  if (!n || n === '-' || /^instantane/.test(n)) return { tipo: 'instantaneo', turnos: 0, rodadas: 0, texto, rolagens: [] };
  if (/^variavel/.test(n)) return { tipo: 'manual', turnos: null, rodadas: null, texto, rolagens: [] };
  if (/^(ate|enquanto)\b/.test(n)) return { tipo: 'evento', turnos: null, rodadas: null, texto, rolagens: [] };
  if (n === 'turno') return { tipo: 'tempo', turnos: 1, rodadas: 0, texto: '1 turno', rolagens: [] };

  // "3 turnos/2 turnos", "d4+2/d6+1 turnos": vale a primeira alternativa
  let corpo = n;
  if (corpo.includes('/')) {
    const partes = corpo.split('/');
    const unidade = (corpo.match(/(turnos?|rodadas?)\s*$/) || [])[1];
    corpo = /(turnos?|rodadas?)/.test(partes[0]) || !unidade ? partes[0] : `${partes[0]} ${unidade}`;
  }

  const rolagens = [];
  let turnos = 0;
  let rodadas = 0;
  let achou = false;
  let resto = corpo;
  const regex = /^\s*\+?\s*(.+?)\s*(turnos?|rodadas?)\b/;
  let m = regex.exec(resto);
  while (m) {
    const valor = avaliarExpressao(m[1], ctx, rolagens);
    if (Number.isNaN(valor)) return { tipo: 'manual', turnos: null, rodadas: null, texto, rolagens: [] };
    if (m[2].startsWith('turno')) turnos += valor; else rodadas += valor;
    achou = true;
    resto = resto.slice(m[0].length);
    m = regex.exec(resto);
  }
  if (!achou) return { tipo: 'manual', turnos: null, rodadas: null, texto, rolagens: [] };
  return { tipo: 'tempo', turnos, rodadas, texto, rolagens };
}

export function descreverDuracao(d) {
  if (!d || d.tipo !== 'tempo') return d?.texto || '';
  const partes = [];
  if (d.rodadas) partes.push(`${d.rodadas} rodada${d.rodadas > 1 ? 's' : ''}`);
  if (d.turnos) partes.push(`${d.turnos} turno${d.turnos > 1 ? 's' : ''}`);
  return partes.join(' + ');
}

// ---------------------------------------------------------------------------
// Máximos que dependem de efeitos
// ---------------------------------------------------------------------------

const temEfeito = (efeitos, id) => (efeitos || []).some((e) => e.id === id);

export function modificadorFolegoMaximo(efeitos) {
  let mod = 0;
  if (temEfeito(efeitos, 'adrenalina')) mod += 4;
  if (temEfeito(efeitos, 'ego_inflado')) mod += 4;
  if (temEfeito(efeitos, 'exausto')) mod -= 2;
  if (temEfeito(efeitos, 'ego_quebrado')) mod -= 4;
  const inspirado = (efeitos || []).find((e) => e.id === 'inspirado');
  if (inspirado) mod += inspirado.quantidade || 1;
  return mod;
}

export function reacoesMaximas(efeitos) {
  let n = 4;
  if (temEfeito(efeitos, 'adrenalina')) n += 1;
  if (temEfeito(efeitos, 'ego_inflado')) n += 1;
  if (temEfeito(efeitos, 'exausto')) n -= 1;
  if (temEfeito(efeitos, 'ego_quebrado')) n -= 1;
  return Math.max(0, n);
}

export function acoesVazias() {
  return { tatica: false, egoista: false, egoistaExtra: false, movimento: false, regulares: [false, false, false, false, false, false] };
}

/** Normaliza o que veio do banco (fichas antigas só têm 4 reações e nenhuma ação de movimento). */
export function normalizarAcoes(acoes) {
  const base = acoesVazias();
  if (!acoes) return base;
  return {
    tatica: !!acoes.tatica,
    egoista: !!acoes.egoista,
    egoistaExtra: !!acoes.egoistaExtra,
    movimento: !!acoes.movimento,
    regulares: base.regulares.map((_, i) => !!acoes.regulares?.[i]),
  };
}

export function reacoesLivres(acoes, efeitos) {
  const max = reacoesMaximas(efeitos);
  return acoes.regulares.slice(0, max).filter((g) => !g).length;
}

// ---------------------------------------------------------------------------
// Conferir e aplicar o uso de uma habilidade
// ---------------------------------------------------------------------------

export function chaveHabilidade(origem, h) {
  return `${origem}:${normalizar(h.nome).replace(/[^a-z0-9]+/g, '_')}`;
}

/**
 * Antes de gastar: o que impede (bloqueios) e o que só merece atenção (avisos).
 * Bloqueio = regra dura do livro (ex.: "apenas utilizável uma vez em fluxo" já usada).
 */
export function verificarUso(estado, h, chave, opcoes = {}) {
  const bloqueios = [];
  const avisos = [];
  const tda = parseTdA(h.tda);
  const esf = parseEsforco(h.esf);
  const gex = parseGex(h.gex);

  if (somenteUmaVezEmFluxo(h) && estado.usadasFluxo?.includes(chave)) {
    bloqueios.push('Já foi usada neste fluxo (apenas utilizável uma vez em fluxo).');
  }
  if (h.tipo === 'fluxo' && !estado.fluxoAtivo) avisos.push('O fluxo não está ativo.');

  const bola = condicaoDeBola(h);
  if (bola === 'com' && !estado.comBola) avisos.push('Precisa estar com a bola.');
  if (bola === 'sem' && estado.comBola) avisos.push('Precisa estar sem a bola.');

  if (tda.tatica && estado.acoes.tatica) avisos.push('Ação tática já gasta.');
  if (tda.egoista) {
    const temExtra = (estado.nivel ?? 1) >= 8;
    const semEgoista = estado.acoes.egoista && (!temExtra || estado.acoes.egoistaExtra);
    if (semEgoista) avisos.push('Ação egoísta já gasta.');
  }
  if (tda.movimento && estado.acoes.movimento) avisos.push('Ação de movimento já gasta.');
  const reacoesPedidas = tda.reacoes + (opcoes.reacaoExtra ? tda.opcional.reacoes : 0);
  if (reacoesPedidas > reacoesLivres(estado.acoes, estado.efeitos)) avisos.push(`Faltam reações (precisa de ${reacoesPedidas}).`);

  const pdeFinal = estado.pde + esf.base + (opcoes.extraEsf ? esf.extra : 0);
  if (pdeFinal >= LIMITE_PDE) avisos.push(`Vai chegar a ${pdeFinal} PdE: dispara o limite de exaustão.`);
  if (gex.folegos && opcoes.usarGex !== false && gex.folegos > estado.folego) avisos.push('Fôlegos insuficientes para o G.Ex.');
  if (gex.pds && opcoes.usarGex !== false && gex.pds > estado.pds) avisos.push('PdS insuficiente para o G.Ex.');
  if (h.requisito) avisos.push(`Pré-requisito: ${h.requisito}.`);

  return { bloqueios, avisos };
}

function rolarLimitePdE(ctx, estado) {
  const aleatorio = ctx.aleatorio || Math.random;
  const dado = Math.floor(aleatorio() * 4) + 1;
  const tabela = { 1: 'd2+1 turnos', 2: 'd4+2 turnos', 3: 'd8+3 turnos' };
  let efeitos = estado.efeitos;
  let texto;
  if (dado === 4) {
    efeitos = aplicarEfeito(efeitos, 'caido', { texto: '2 rodadas + 4 turnos', turnos: 4, rodadas: 2 });
    texto = 'Limite de PdE (d4 = 4): você cede ao cansaço e fica caído por 2 rodadas + 4 turnos.';
  } else {
    const d = resolverDuracao(tabela[dado], ctx);
    efeitos = aplicarEfeito(efeitos, 'exausto', { texto: `${d.turnos} turnos`, turnos: d.turnos, rodadas: 0 });
    texto = `Limite de PdE (d4 = ${dado}): exausto por ${d.turnos} turnos.`;
  }
  return { efeitos, texto };
}

function consumirReacoes(acoes, quantidade, maximo) {
  const regulares = [...acoes.regulares];
  let faltou = quantidade;
  for (let i = 0; i < maximo && faltou > 0; i += 1) {
    if (!regulares[i]) { regulares[i] = true; faltou -= 1; }
  }
  return { regulares, faltou };
}

function colocarEfeitoLivre(efeitos, entrada) {
  return [...efeitos.filter((e) => e.id !== entrada.id), entrada];
}

/**
 * Gasta a habilidade: PdE, fôlego, PdS, ações, efeitos e marcação de "uma vez em fluxo".
 * opcoes: { extraEsf, reacaoExtra, usarGex }.
 * Devolve { estado, avisos, duracao, efeitosAplicados }.
 */
export function aplicarUso(estado, h, chave, ctx = {}, opcoes = {}) {
  const avisos = [];
  const tda = parseTdA(h.tda);
  const esf = parseEsforco(h.esf);
  const gex = parseGex(h.gex);
  const prep = parsePrep(h.prep);

  let { pde, folego, pds, efeitos } = estado;
  let acoes = { ...estado.acoes, regulares: [...estado.acoes.regulares] };
  const usadasFluxo = [...(estado.usadasFluxo || [])];

  // Esforço
  pde += esf.base + (opcoes.extraEsf ? esf.extra : 0);

  // Gasto extra (opcional no livro: gasta o que tiver, sem ficar negativo)
  if (opcoes.usarGex !== false) {
    if (gex.folegos) {
      if (gex.folegos > folego) avisos.push('Sem fôlego suficiente para o G.Ex. completo.');
      folego = Math.max(0, folego - gex.folegos);
    }
    if (gex.pds) {
      if (gex.pds > pds) avisos.push('Sem PdS suficiente para o G.Ex. completo.');
      pds = Math.max(0, pds - gex.pds);
    }
  }

  // Ações
  if (tda.tatica) acoes.tatica = true;
  if (tda.egoista) {
    if (acoes.egoista && (estado.nivel ?? 1) >= 8 && !acoes.egoistaExtra) acoes.egoistaExtra = true;
    else acoes.egoista = true;
  }
  if (tda.movimento) acoes.movimento = true;
  const reacoesPedidas = tda.reacoes + (opcoes.reacaoExtra ? tda.opcional.reacoes : 0);
  if (reacoesPedidas) {
    const r = consumirReacoes(acoes, reacoesPedidas, reacoesMaximas(efeitos));
    acoes.regulares = r.regulares;
    if (r.faltou) avisos.push(`Faltaram ${r.faltou} reação(ões).`);
  }
  if (tda.ou) avisos.push('A habilidade aceita ação alternativa (OU): conferi só a primeira opção.');

  // Duração e efeitos
  const duracao = resolverDuracao(h.dur, ctx);
  const efeitosAplicados = [];
  for (const item of h.aplica || []) {
    const d = item.duracao ? (normalizar(item.duracao) === 'turno' ? resolverDuracao('turno') : resolverDuracao(item.duracao, ctx)) : duracao;
    const dados = d.tipo === 'tempo'
      ? { texto: descreverDuracao(d), turnos: d.turnos, rodadas: d.rodadas }
      : { texto: d.texto };
    if (!buscarEfeito(item.efeito)) continue;
    efeitos = aplicarEfeito(efeitos, item.efeito, dados);
    efeitosAplicados.push(item.efeito);
  }
  if (!efeitosAplicados.length && (duracao.tipo === 'tempo' || duracao.tipo === 'evento')) {
    efeitos = colocarEfeitoLivre(efeitos, {
      id: `hab:${chave}`, nome: h.nome, quantidade: 1, origem: 'habilidade', texto: h.texto,
      duracao: duracao.tipo === 'tempo' ? descreverDuracao(duracao) : duracao.texto,
      ...(duracao.tipo === 'tempo' ? { turnos: duracao.turnos, rodadas: duracao.rodadas } : {}),
    });
  }
  if (prep) {
    efeitos = colocarEfeitoLivre(efeitos, {
      id: `prep:${chave}`, nome: `Preparando: ${h.nome}`, quantidade: 1, origem: 'preparo',
      duracao: `${prep.turnos} turnos de preparo`, turnos: prep.turnos, rodadas: 0,
    });
  }
  if (duracao.rolagens?.length) avisos.push(`Duração rolada: ${duracao.rolagens.join(', ')}.`);

  if (somenteUmaVezEmFluxo(h) && !usadasFluxo.includes(chave)) usadasFluxo.push(chave);

  // Limite de exaustão
  const parcial = { ...estado, pde, efeitos };
  if (pde >= LIMITE_PDE) {
    const r = rolarLimitePdE(ctx, parcial);
    efeitos = r.efeitos;
    pde = LIMITE_PDE - 1;
    avisos.push(r.texto);
  }

  return {
    estado: { ...estado, pde, folego, pds, acoes, efeitos, usadasFluxo },
    avisos,
    duracao,
    efeitosAplicados,
  };
}

// ---------------------------------------------------------------------------
// Passagem de tempo
// ---------------------------------------------------------------------------

function descontar(efeitos, campo) {
  const expirados = [];
  const restantes = [];
  for (const e of efeitos) {
    const contavel = typeof e[campo] === 'number' && e[campo] > 0;
    if (!contavel) { restantes.push(e); continue; }
    const novo = { ...e, [campo]: e[campo] - 1 };
    const turnos = novo.turnos || 0;
    const rodadas = novo.rodadas || 0;
    if (turnos <= 0 && rodadas <= 0) expirados.push(e);
    else restantes.push(novo);
  }
  return { efeitos: restantes, expirados };
}

/** Passa um turno: efeitos com contagem em turnos perdem 1. */
export function passarTurno(estado) {
  const r = descontar(estado.efeitos, 'turnos');
  return { estado: { ...estado, efeitos: r.efeitos, turno: (estado.turno || 0) + 1 }, expirados: r.expirados };
}

/**
 * Nova rodada: libera ações, devolve os fôlegos, desconta 1 rodada dos efeitos e,
 * se pedido, tira 2 PdE (regra do livro: ao fim da rodada pode retirar -2 PdE).
 */
export function novaRodada(estado, { aliviarPdE = false, folegoMax } = {}) {
  const r = descontar(estado.efeitos, 'rodadas');
  return {
    estado: {
      ...estado,
      efeitos: r.efeitos,
      acoes: acoesVazias(),
      folego: typeof folegoMax === 'number' ? folegoMax : estado.folego,
      pde: aliviarPdE ? Math.max(0, estado.pde - 2) : estado.pde,
      rodada: (estado.rodada || 1) + 1,
    },
    expirados: r.expirados,
  };
}
