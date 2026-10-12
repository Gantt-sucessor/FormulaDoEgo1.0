// Compatibilidade: fichas criadas no site antigo precisam abrir no novo SEM perder nada
// e sem serem reescritas só por serem abertas.
import test from 'node:test';
import assert from 'node:assert/strict';
import { fichaDoBanco, camposParaBanco, folegoMaximo } from '../src/lib/ficha.js';
import { listarHabilidadesAtivas } from '../src/lib/habilidadesAtivas.js';
import { ARMAS } from '../src/data/armas.js';

// Linha como o site antigo gravava (4 reações, efeitos com duração em texto, sem rodada/turno/comBola).
const antiga = {
  id: 'x', campanha_id: 'c', jogador_id: 'u', nome_jogador: 'Ana', nome_personagem: 'Isagi',
  atributos: { potencia: 3, drible: 2, destreza: 1, robustez: 0, cognicao: 4, ego: -1 },
  pericias: { precisao: 4, constancia: 2, momento: 3, pericia_desconhecida: 1 },
  arma_id: 'indomito_mutavel', otica_id: 'neutra', tendencia_principal_id: 'x', tendencia_secundaria_id: null,
  categoria_id: 'genio', arquetipo_id: 'genes_abencoados', nivel: 6, folego_atual: 5, pde_atual: 3, pontos_chama: 2, pontos_sorte: 1,
  talentos: ['oneshot'], talentos_niveis: { oneshot: 2 }, habilidades_categoria: ['Forçando destino'], visoes_desbloqueadas: [1, 2],
  recompensa_nivel_6: 'folego', recompensa_nivel_8: null, posicao: 'meio', perna_dominante: 'direita', tendencia_pericia_escolhida: 'precisao',
  efeitos_ativos: [{ id: 'adrenalina', quantidade: 1, duracao: '2 turnos' }, { id: 'personalizado_1', nome: 'Adaptado', quantidade: 1, duracao: '' }],
  acoes_gastas: { tatica: true, egoista: false, regulares: [true, false, false, false] },
  fluxo: { tipo: 'basico', auraTipo: 'primitiva', pontosApice: { potencia: 2 }, apiceComplexo: {}, jogadasBonus: ['chute_regular'], efeitosAuraSelecionados: ['sniper'], marcasConhecidas: ['x'], marcasUsos: { x: 2 }, ativo: false },
  catalisador: { id: 'metavisao', potencial: 4 },
};

test('ficha antiga: nenhum dado se perde ao converter para o novo formato e voltar', () => {
  const f = fichaDoBanco(antiga);
  const volta = camposParaBanco(f);
  const esperado = {
    nome_personagem: antiga.nome_personagem, atributos: antiga.atributos, pericias: antiga.pericias, arma_id: antiga.arma_id,
    otica_id: antiga.otica_id, tendencia_principal_id: antiga.tendencia_principal_id, tendencia_secundaria_id: null,
    categoria_id: antiga.categoria_id, arquetipo_id: antiga.arquetipo_id, nivel: 6, folego_atual: 5, pde_atual: 3, pontos_chama: 2, pontos_sorte: 1,
    talentos: antiga.talentos, talentos_niveis: antiga.talentos_niveis, habilidades_categoria: antiga.habilidades_categoria,
    visoes_desbloqueadas: antiga.visoes_desbloqueadas, recompensa_nivel_6: 'folego', recompensa_nivel_8: null, posicao: 'meio', perna_dominante: 'direita',
    tendencia_pericia_escolhida: 'precisao', efeitos_ativos: antiga.efeitos_ativos,
  };
  for (const [campo, valor] of Object.entries(esperado)) assert.deepEqual(volta[campo], valor, campo);
  assert.deepEqual(volta.fluxo, antiga.fluxo);
  assert.equal(volta.catalisador.id, 'metavisao');
  assert.equal(volta.catalisador.potencial, 4);
  // ação gasta continua gasta; reações extras novas entram vazias
  assert.equal(volta.acoes_gastas.tatica, true);
  assert.deepEqual(volta.acoes_gastas.regulares.slice(0, 4), [true, false, false, false]);
});

test('abrir e converter duas vezes dá o mesmo resultado (não "suja" a ficha)', () => {
  const a = camposParaBanco(fichaDoBanco(antiga));
  const b = camposParaBanco(fichaDoBanco({ ...antiga, ...a, id: 'x' }));
  assert.deepEqual(a, b);
});

test('colunas ausentes/nulas (ficha bem antiga) viram padrões sem quebrar', () => {
  const minima = { id: 'y', nome_personagem: 'Novo', atributos: null, pericias: null, efeitos_ativos: null, acoes_gastas: null, fluxo: null, catalisador: null, talentos: null };
  const f = fichaDoBanco(minima);
  assert.equal(f.nivel, 1);
  assert.equal(f.folego, folegoMaximo(f));
  assert.deepEqual(f.efeitos, []);
  assert.equal(f.acoes.regulares.length, 6);
});

test('habilidades guardadas por nome/id continuam resolvendo', () => {
  const f = fichaDoBanco(antiga);
  const lista = listarHabilidadesAtivas(f);
  assert.equal(lista.filter((x) => x.origem === 'arma').length, ARMAS.find((a) => a.id === 'indomito_mutavel').habilidades.length);
  assert.ok(lista.some((x) => x.origem === 'categoria' && x.h.nome === 'Forçando destino'));
  assert.ok(lista.some((x) => x.origem === 'talento'));
});
