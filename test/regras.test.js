import test from 'node:test';
import assert from 'node:assert/strict';
import { contraDj, rolarJogada, resolverJogada } from '../js/regras/dados.js';

test('aplica a desvantagem líquida como dados subtraídos', () => {
  const resultado = rolarJogada({
    valorAtributo: 2,
    valorPericia: 0,
    desvantagens: 1,
    aleatorio: () => 0.5,
  });

  assert.equal(resultado.rolagensDesvantagem.length, 1);
  assert.equal(resultado.resultado, 11);
});

test('vantagem e desvantagem se cancelam', () => {
  const resultado = rolarJogada({
    valorAtributo: 0,
    vantagens: 2,
    desvantagens: 1,
    aleatorio: () => 0.5,
  });

  assert.equal(resultado.rolagensVantagem.length, 1);
  assert.equal(resultado.rolagensDesvantagem.length, 0);
});

test('registra execução absoluta positiva no 12 natural', () => {
  const resultado = rolarJogada({ valorAtributo: 0, aleatorio: () => 0.999 });

  assert.equal(resultado.resultado, 17);
  assert.equal(resultado.execucaoAbsoluta?.tipo, 'positiva');
});

test('compara resultado com DJ', () => {
  assert.equal(contraDj(14, 14), true);
  assert.equal(contraDj(13, 14), false);
});

test('resolve sucesso e margem contra DJ numérica', () => {
  assert.deepEqual(resolverJogada(17, 14), { resolvida: true, sucesso: true, margem: 3, dj: 14 });
  assert.deepEqual(resolverJogada(9, 14), { resolvida: true, sucesso: false, margem: -5, dj: 14 });
});

test('mantém J vs J pendente sem alvo', () => {
  assert.deepEqual(resolverJogada(15, 'J vs J'), { resolvida: false, sucesso: null, margem: null, dj: 'J vs J' });
});
