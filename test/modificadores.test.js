import test from 'node:test';
import assert from 'node:assert/strict';
import { aplicarUso, passarTurno } from '../src/regras/habilidades.js';
import { modsParaJogada, modDistancia, consumirEfeitos, modsAtivos } from '../src/regras/modificadores.js';
import { jogadaPorId } from '../src/regras/modificadores.js';
import { listarHabilidadesAtivas } from '../src/lib/habilidadesAtivas.js';
import { fichaVazia, estadoDoMotor } from '../src/lib/ficha.js';

const ficha = (extra = {}) => ({ ...fichaVazia(), nivel: 5, ...extra });
const usar = (f, item, opcoes = {}) => aplicarUso(estadoDoMotor(f), item.h, item.chave, { pericias: f.pericias, atributos: f.atributos }, opcoes).estado;

test('Oneshot nível 1: 1 vantagem e +2 m no chute regular, só na próxima jogada', () => {
  const f = ficha({ talentos: ['oneshot'] });
  const item = listarHabilidadesAtivas(f).find((i) => i.h.id === 'oneshot');
  const e = usar(f, item);
  const r = modsParaJogada(e.efeitos, jogadaPorId('chute_regular'));
  assert.equal(r.vantagens, 1);
  assert.equal(modDistancia(e.efeitos, 'chute'), 2);
  assert.equal(modsParaJogada(e.efeitos, jogadaPorId('passe_longo')).vantagens, 0);
  const depois = consumirEfeitos(e.efeitos, r.consumir);
  assert.equal(modsParaJogada(depois, jogadaPorId('chute_regular')).vantagens, 0);
  assert.equal(modDistancia(depois, 'chute'), 0);
});

test('Oneshot nível 3 cobre chute de poder com 2 vantagens e +3', () => {
  const f = ficha({ talentos: ['oneshot'], talentosNiveis: { oneshot: 3 } });
  const e = usar(f, listarHabilidadesAtivas(f).find((i) => i.h.id === 'oneshot'));
  const r = modsParaJogada(e.efeitos, jogadaPorId('chute_de_poder'));
  assert.deepEqual([r.vantagens, r.bonus], [2, 3]);
});

test('Ala Messi: vale só nas perícias de Drible escolhidas e dura por turnos', () => {
  const f = ficha({ talentos: ['ala_messi'], atributos: { drible: 2 } });
  const item = listarHabilidadesAtivas(f).find((i) => i.h.id === 'ala_messi');
  const e = usar(f, item, { escolha: ['criatividade'] });
  assert.equal(modsParaJogada(e.efeitos, jogadaPorId('elastico')).vantagens, 1); // Elástico usa Criatividade
  assert.equal(modsParaJogada(e.efeitos, jogadaPorId('chapeu')).vantagens, 0); // Chapéu usa Posse
  const ef = e.efeitos.find((x) => x.id === 'hab:talento:ala_messi');
  assert.equal(ef.turnos, 2); // Drible 2
  let est = e;
  for (let i = 0; i < 2; i += 1) est = passarTurno(est).estado;
  assert.equal(modsAtivos(est.efeitos).length, 0);
});

test('Efeitos do livro entram sozinhos: exausto −5 e inspirado +2', () => {
  const j = jogadaPorId('chute_regular');
  assert.equal(modsParaJogada([{ id: 'exausto', quantidade: 1 }], j).bonus, -5);
  assert.equal(modsParaJogada([{ id: 'inspirado', quantidade: 2 }], j).bonus, 4);
  assert.equal(modsParaJogada([{ id: 'no_ar', quantidade: 1 }], jogadaPorId('dominio')).bonus, 4);
  assert.equal(modsParaJogada([{ id: 'no_ar', quantidade: 1 }], j).bonus, 0);
});

test('talento sem número fixo não cria efeito de bônus', () => {
  const f = ficha({ talentos: ['cabeca_dura'] });
  const e = usar(f, listarHabilidadesAtivas(f).find((i) => i.h.id === 'cabeca_dura'));
  assert.equal(modsAtivos(e.efeitos).length, 0);
});

test('dica da perícia lista as jogadas que a usam', async () => {
  const { dicaDaPericia } = await import('../src/data/usosPericias.js');
  const d = dicaDaPericia('precisao');
  assert.match(d, /Chute regular/);
  assert.match(d, /Voleio/);
  assert.match(d, /DdC/);
  assert.match(dicaDaPericia('elastico_inexistente'), /^$/);
});
