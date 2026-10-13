import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseTdA, parseEsforco, parseGex, parsePrep, condicaoDeBola, resolverDuracao, descreverDuracao,
  verificarUso, aplicarUso, passarTurno, novaRodada, acoesVazias, normalizarAcoes,
  modificadorFolegoMaximo, reacoesMaximas, chaveHabilidade,
} from '../src/regras/habilidades.js';
import { ARMAS } from '../src/data/armas.js';

const estadoBase = (extra = {}) => ({
  pde: 0, folego: 8, folegoMax: 8, pds: 1, pdsMax: 3, nivel: 1, comBola: false, fluxoAtivo: false,
  acoes: acoesVazias(), efeitos: [], usadasFluxo: [], ...extra,
});

test('TdA: ação + reações + opcionais', () => {
  assert.deepEqual(
    { ...parseTdA('Ação egoísta + 2 reações'), opcional: undefined },
    { tatica: false, egoista: true, movimento: false, reacoes: 2, opcional: undefined, ou: false, livre: false },
  );
  const t = parseTdA('Ação egoísta + 2 reações [+1 reação]');
  assert.equal(t.reacoes, 2);
  assert.equal(t.opcional.reacoes, 1);
  const m = parseTdA('2 reações + ação de movimento');
  assert.equal(m.reacoes, 2);
  assert.equal(m.movimento, true);
  assert.equal(parseTdA('Reação').reacoes, 1);
  assert.equal(parseTdA('-').livre, true);
  const ou = parseTdA('2 reações OU Ação egoísta');
  assert.equal(ou.ou, true);
  assert.equal(ou.reacoes, 2);
  assert.equal(ou.egoista, false);
});

test('Esf. e G.Ex.', () => {
  assert.deepEqual(parseEsforco('+4 PdE'), { base: 4, extra: 0 });
  assert.deepEqual(parseEsforco('+2 PdE [+2 PdE]'), { base: 2, extra: 2 });
  assert.deepEqual(parseEsforco('+2 PdE (+1)'), { base: 2, extra: 1 });
  assert.deepEqual(parseGex('4 fôlegos'), { folegos: 4, pds: 0 });
  assert.deepEqual(parseGex('[1 PdS]'), { folegos: 0, pds: 1 });
  assert.deepEqual(parsePrep('P/2 turnos'), { tipo: 'P', turnos: 2 });
  assert.equal(parsePrep(undefined), null);
});

test('condição de bola vem do livro', () => {
  assert.equal(condicaoDeBola({ condicao: 'Apenas pode ser utilizada sem a bola' }), 'sem');
  assert.equal(condicaoDeBola({ condicao: 'Apenas pode ser utilizada com a bola' }), 'com');
  assert.equal(condicaoDeBola({ condicao: 'Variante', texto: 'Ao estar com a bola, pode ativar' }), 'com');
  assert.equal(condicaoDeBola({ condicao: 'Variante', texto: 'Ao estar com ou sem a bola, pode' }), 'qualquer');
});

test('duração: turnos, rodadas, perícia e dados', () => {
  const ctx = { pericias: { agilidade: 3, musculos: 4, determinacao: 2 }, atributos: { cognicao: 2 }, aleatorio: () => 0.5 };
  assert.deepEqual(resolverDuracao('instantâneo').tipo, 'instantaneo');
  assert.deepEqual(resolverDuracao('-').tipo, 'instantaneo');
  assert.equal(resolverDuracao('variável').tipo, 'manual');
  assert.equal(resolverDuracao('até sair do setor').tipo, 'evento');
  assert.equal(resolverDuracao('4 turnos').turnos, 4);
  assert.equal(resolverDuracao('1 rodada').rodadas, 1);
  assert.equal(resolverDuracao('2 rodadas + 4 turnos', ctx).turnos, 4);
  assert.equal(resolverDuracao('2 rodadas + 4 turnos', ctx).rodadas, 2);
  assert.equal(resolverDuracao('agilidade + 1 turnos', ctx).turnos, 4);
  assert.equal(resolverDuracao('músculos x 2 turnos', ctx).turnos, 8);
  assert.equal(resolverDuracao('determin. + 3 turnos', ctx).turnos, 5);
  assert.equal(resolverDuracao('músculos rodadas', ctx).rodadas, 4);
  assert.equal(resolverDuracao('Cognição x 2 turnos', ctx).turnos, 4);
  const d = resolverDuracao('d6+1 turnos', ctx); // d6 com aleatorio 0.5 = 4
  assert.equal(d.turnos, 5);
  assert.equal(d.rolagens.length, 1);
  assert.equal(resolverDuracao('2d2 rodadas', ctx).rodadas, 4); // 2 dados de 2 faces, aleatorio 0.5 -> 2 cada
  assert.equal(resolverDuracao('turno').turnos, 1);
  assert.equal(resolverDuracao('3 turnos/2 turnos').turnos, 3);
  assert.equal(resolverDuracao('algo estranho').tipo, 'manual');
  assert.equal(descreverDuracao(resolverDuracao('2 rodadas + 4 turnos')), '2 rodadas + 4 turnos');
});

test('usar habilidade gasta PdE, fôlego, ações e marca uma vez em fluxo', () => {
  const h = { nome: 'Teste', tipo: 'fluxo', condicao: 'Apenas utilizável uma vez em fluxo', esf: '+5 PdE', gex: '3 fôlegos', tda: 'Ação egoísta + 2 reações', dur: '2 rodadas', texto: 'Ao estar sem a bola, pode' };
  const chave = chaveHabilidade('arma', h);
  const antes = estadoBase({ fluxoAtivo: true });
  assert.deepEqual(verificarUso(antes, h, chave).bloqueios, []);
  const r = aplicarUso(antes, h, chave);
  assert.equal(r.estado.pde, 5);
  assert.equal(r.estado.folego, 5);
  assert.equal(r.estado.acoes.egoista, true);
  assert.deepEqual(r.estado.acoes.regulares.slice(0, 3), [true, true, false]);
  assert.deepEqual(r.estado.usadasFluxo, [chave]);
  const ef = r.estado.efeitos.find((e) => e.id === `hab:${chave}`);
  assert.equal(ef.rodadas, 2);
  assert.equal(verificarUso(r.estado, h, chave).bloqueios.length, 1);
});

test('avisos: bola errada, ação gasta, reações faltando', () => {
  const h = { nome: 'X', tipo: 'com bola', condicao: 'Apenas pode ser utilizada com a bola', esf: '+1 PdE', tda: 'Ação tática + 2 reações', dur: 'instantâneo', texto: '' };
  const acoes = { ...acoesVazias(), tatica: true, regulares: [true, true, true, false, false, false] };
  const { avisos } = verificarUso(estadoBase({ acoes }), h, 'k');
  assert.ok(avisos.some((a) => /com a bola/.test(a)));
  assert.ok(avisos.some((a) => /tática/.test(a)));
  assert.ok(avisos.some((a) => /reações/.test(a)));
});

test('opcionais: PdE extra e reação extra', () => {
  const h = { nome: 'Y', tipo: 'sem bola', esf: '+2 PdE [+2 PdE]', tda: 'Reação [+ reação]', dur: 'instantâneo', texto: '' };
  const r = aplicarUso(estadoBase(), h, 'k', {}, { extraEsf: true, reacaoExtra: true });
  assert.equal(r.estado.pde, 4);
  assert.deepEqual(r.estado.acoes.regulares.slice(0, 3), [true, true, false]);
});

test('G.Ex. desligado não gasta nada', () => {
  const h = { nome: 'Z', tipo: 'sem bola', esf: '+1 PdE', gex: '4 fôlegos', tda: 'Reação', dur: 'instantâneo', texto: '' };
  const r = aplicarUso(estadoBase(), h, 'k', {}, { usarGex: false });
  assert.equal(r.estado.folego, 8);
});

test('limite de 8 PdE rola o d4 e volta a 7', () => {
  const h = { nome: 'W', tipo: 'sem bola', esf: '+3 PdE', tda: 'Reação', dur: 'instantâneo', texto: '' };
  const r = aplicarUso(estadoBase({ pde: 6 }), h, 'k', { aleatorio: () => 0.1 }); // d4 = 1 -> exausto d2+1
  assert.equal(r.estado.pde, 7);
  const ex = r.estado.efeitos.find((e) => e.id === 'exausto');
  assert.ok(ex && ex.turnos >= 2 && ex.turnos <= 3);
  const r4 = aplicarUso(estadoBase({ pde: 6 }), h, 'k', { aleatorio: () => 0.99 });
  assert.ok(r4.estado.efeitos.find((e) => e.id === 'caido'));
});

test('aplica efeito da arma com contagem (Pose glam!)', () => {
  const arma = ARMAS.find((a) => a.id === 'astro_ascendente');
  const h = arma.habilidades.find((x) => x.nome === 'Pose glam!');
  const r = aplicarUso(estadoBase({ comBola: true }), h, 'k');
  const ef = r.estado.efeitos.find((e) => e.id === 'enaltecido');
  assert.equal(ef.rodadas, 1);
});

test('turno e rodada descontam e expiram efeitos', () => {
  let estado = estadoBase({
    pde: 4, folego: 1,
    efeitos: [
      { id: 'inspirado', quantidade: 1, turnos: 2, rodadas: 0 },
      { id: 'ego_alto', quantidade: 1, turnos: 0, rodadas: 2 },
      { id: 'caido', quantidade: 1, duracao: 'livre' },
    ],
    acoes: { ...acoesVazias(), tatica: true },
  });
  let r = passarTurno(estado);
  assert.equal(r.estado.efeitos.find((e) => e.id === 'inspirado').turnos, 1);
  r = passarTurno(r.estado);
  assert.equal(r.expirados.length, 1);
  assert.ok(!r.estado.efeitos.some((e) => e.id === 'inspirado'));
  r = novaRodada(r.estado, { aliviarPdE: true, folegoMax: 8 });
  assert.equal(r.estado.efeitos.find((e) => e.id === 'ego_alto').rodadas, 1);
  assert.equal(r.estado.pde, 2);
  assert.equal(r.estado.folego, 8);
  assert.equal(r.estado.acoes.tatica, false);
  r = novaRodada(r.estado);
  assert.ok(!r.estado.efeitos.some((e) => e.id === 'ego_alto'));
  assert.ok(r.estado.efeitos.some((e) => e.id === 'caido'));
});

test('máximos dependem dos efeitos', () => {
  assert.equal(modificadorFolegoMaximo([{ id: 'adrenalina' }, { id: 'exausto' }]), 2);
  assert.equal(reacoesMaximas([{ id: 'adrenalina' }]), 5);
  assert.equal(normalizarAcoes({ tatica: true, regulares: [true, false, false, false] }).regulares.length, 6);
});

test('todas as habilidades das armas são legíveis pelo motor', () => {
  for (const arma of ARMAS) {
    for (const h of arma.habilidades) {
      const tda = parseTdA(h.tda);
      assert.ok(tda.livre || tda.tatica || tda.egoista || tda.movimento || tda.reacoes > 0, `${arma.id}/${h.nome}: TdA ilegível (${h.tda})`);
      const esf = parseEsforco(h.esf);
      assert.ok(esf.base > 0, `${arma.id}/${h.nome}: Esf. ilegível (${h.esf})`);
      const d = resolverDuracao(h.dur, { pericias: {}, atributos: {}, aleatorio: () => 0.5 });
      assert.ok(['instantaneo', 'tempo', 'evento', 'manual'].includes(d.tipo));
    }
  }
});

test('durações que o motor não entende (devem ser poucas e conhecidas)', () => {
  const manuais = [];
  for (const arma of ARMAS) {
    for (const h of arma.habilidades) {
      const d = resolverDuracao(h.dur, { pericias: { musculos: 1 }, atributos: {}, aleatorio: () => 0.5 });
      if (d.tipo === 'manual' && !/vari/i.test(h.dur)) manuais.push(`${arma.id}/${h.nome}: "${h.dur}"`);
    }
  }
  // Textos do livro que dependem de leitura da mesa: o app mostra o texto e o jogador conta à mão.
  assert.deepEqual(manuais, [
    'abelha_anarquica/1001 possibilidades: "Controle x d2 turnos"',
    'regente_inefavel/Elevar o nível: "posiciona. x 2"',
  ]);
});
