import test from 'node:test';
import assert from 'node:assert/strict';
import { BOT_PADRAO, rolarJogadaBot, confrontoChute, facesPotencia, rolarPenalti, periciaErguerBase, djErguerBase } from '../src/regras/goleiroBot.js';

const fixo = (...v) => { let i = 0; return () => v[i++ % v.length]; };

test('defesa de goleiro usa Destreza + Agilidade', () => {
  const r = rolarJogadaBot('defesa_de_goleiro', { ...BOT_PADRAO, destreza: 0, agilidade: 4 }, { aleatorio: fixo(0.5) }); // d12 = 7
  assert.equal(r.resultado, 7 + 4);
  assert.equal(r.periciaNome, 'Agilidade');
});

test('espalmar usa Instintos e dados de atributo', () => {
  const r = rolarJogadaBot('espalmar', { ...BOT_PADRAO, destreza: 2, instintos: 1 }, { aleatorio: fixo(0.5) }); // d12=7, 2d6=4+4
  assert.equal(r.rolagensAtributo.length, 2);
  assert.equal(r.resultado, 7 + 8 + 1);
});

test('erguer base: Cognição e média arredondada para baixo; DJ sobe 2 por turno', () => {
  assert.equal(periciaErguerBase({ constancia: 3, posicionamento: 2 }), 3);
  assert.equal(djErguerBase(0), 10);
  assert.equal(djErguerBase(3), 16);
  const r = rolarJogadaBot('erguer_base', { ...BOT_PADRAO, cognicao: 0, constancia: 4, posicionamento: 4 }, { aleatorio: fixo(0.5) });
  assert.equal(r.resultado, 7 + 4);
});

test('confronto: empate é trave', () => {
  assert.equal(confrontoChute(15, 15).resultado, 'trave');
  assert.equal(confrontoChute(15, 16).resultado, 'defendeu');
  assert.equal(confrontoChute(15, 14).resultado, 'gol');
});

test('dados de Potência do pênalti', () => {
  assert.deepEqual([-1, 0, 1, 2, 3, 4].map(facesPotencia), [2, 2, 4, 6, 8, 10]);
});

test('pênalti: empate o goleiro defende; rebaixar vira espalmar', () => {
  const r = rolarPenalti({ potenciaChutador: 2, aleatorio: fixo(0.5) }); // d6 e d6: 4 e 4
  assert.equal(r.chute, r.defesa);
  assert.ok(r.defendeu);
  const e = rolarPenalti({ potenciaChutador: 3, rebaixar: true, aleatorio: fixo(0.1, 0.9) }); // chutador d8 tira 1; goleiro (d6, rebaixado) tira 6
  assert.equal(e.facesChute, 8);
  assert.equal(e.facesBot, 6);
  assert.ok(e.espalmou);
  const g = rolarPenalti({ potenciaChutador: 4, aleatorio: fixo(0.99, 0) });
  assert.equal(g.defendeu, false);
});

test('pênalti: os dois rolam o mesmo dado (Potência do chutador)', () => {
  const p = rolarPenalti({ potenciaChutador: 1, aleatorio: fixo(0.1) });
  assert.equal(p.facesChute, p.facesBot);
});

test('bot tem todos os atributos e perícias do livro', () => {
  for (const k of ['potencia', 'drible', 'destreza', 'robustez', 'cognicao', 'ego', 'agilidade', 'instintos', 'constancia', 'posicionamento', 'visao_de_jogo', 'determinacao']) assert.equal(BOT_PADRAO[k], 0, k);
});
