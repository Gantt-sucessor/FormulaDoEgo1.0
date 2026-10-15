import { JOGADAS } from './jogadas.js';
import { PERICIAS } from './pericias.js';

const GRUPOS = { chutes: 'Chute', passes: 'Passe', dribles: 'Drible', defesa: 'Defesa', goleiro: 'Goleiro', outras: 'Outra' };

// Usos que não são "jogadas" da tabela, mas saem direto das regras do livro.
const EXTRAS = {
  precisao: ['Define a distância de chute (DdC = 6 + Precisão).'],
  visao_de_jogo: ['Define a distância de passe (DdP = 6 + Visão de jogo).'],
  constancia: ['Define seus fôlegos máximos (6 + Constância).'],
  momento: ['Entra na iniciativa (Momento + Destreza).'],
  agilidade: ['Define a distância da Investida (Agilidade + 1 m).'],
  posicionamento: ['Dá o alcance e a duração de muitas habilidades (“posicionamento + 1 m”, “posicionamento + 1 turnos”).'],
  consumir: ['Dá a duração e o poder de habilidades de Ego (“Consumir + 4 turnos”).'],
  emocional: ['Quebra o emocional dos outros: Trash talk e resistência a ele (“Emocional vs Determinação”).'],
  determinacao: ['Resiste ao Trash talk e a efeitos de Ego (Emocional vs Determinação).'],
};

/** O que dá para fazer com a perícia: descrição do livro + jogadas que a usam + regras que dependem dela. */
export function dicaDaPericia(id) {
  const def = PERICIAS.find((p) => p.id === id);
  if (!def) return '';
  const jogadas = Object.entries(JOGADAS).flatMap(([grupo, lista]) => lista
    .filter((j) => j.pericia === id || j.pericias_compostas?.includes(id))
    .map((j) => `• ${j.nome} (${GRUPOS[grupo] || grupo.toLowerCase()} · ${j.acao || '—'})${j.pericias_compostas ? ' — soma com outra perícia, dividido por 2' : ''}`));
  const extras = (EXTRAS[id] || []).map((t) => `• ${t}`);
  const usos = [...jogadas, ...extras];
  return [def.descricao, usos.length ? `\n\nO que dá para fazer:\n${usos.join('\n')}` : ''].join('');
}
