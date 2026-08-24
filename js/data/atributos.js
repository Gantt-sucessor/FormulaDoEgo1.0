// Fórmula do Ego — Atributos
// 6 atributos, divididos em 3 pares: ofensivo / defensivo / mental
// Na criação de personagem: 6 valores pré-definidos, cada um usado uma única vez.

export const VALORES_ATRIBUTO = [4, 3, 2, 1, 0, -1];

export const ATRIBUTOS = [
  {
    id: 'potencia',
    nome: 'Potência',
    grupo: 'ofensivo',
    descricao: 'Reflete sua força e precisão em chutes, definindo tanto sua distância quanto sua velocidade.',
    pericias: ['precisao', 'trajetoria', 'especializacao'],
  },
  {
    id: 'drible',
    nome: 'Drible',
    grupo: 'ofensivo',
    descricao: 'Reflete sua criatividade e velocidade em driblar e esquivar de seus oponentes.',
    pericias: ['criatividade', 'pressao', 'posse'],
  },
  {
    id: 'destreza',
    nome: 'Destreza',
    grupo: 'defensivo',
    descricao: 'Reflete sua velocidade em geral, definindo tanto agilidade em roubos e fôlego.',
    pericias: ['agilidade', 'constancia', 'instintos'],
  },
  {
    id: 'robustez',
    nome: 'Robustez',
    grupo: 'defensivo',
    descricao: 'Reflete a sua tenacidade física, como músculos resistentes ou vigor constante.',
    pericias: ['musculos', 'agressividade', 'escudo'],
  },
  {
    id: 'cognicao',
    nome: 'Cognição',
    grupo: 'mental',
    descricao: 'Reflete seu intelecto em jogo e estratégias visionárias criadas pelo seu intelecto.',
    pericias: ['visao_de_jogo', 'momento', 'posicionamento'],
  },
  {
    id: 'ego',
    nome: 'Ego',
    grupo: 'mental',
    descricao: 'Reflete seu instinto individualista, o desejo de se destacar acima dos outros.',
    pericias: ['emocional', 'consumir', 'determinacao'],
  },
];

// Tamanho da zona dourada de acordo com o valor final de Ego
export function tamanhoZonaDourada(valorEgo) {
  if (valorEgo >= 4) return '3x3';
  if (valorEgo === 3) return '2x2';
  if (valorEgo >= 1) return '1x1';
  return null; // Ego 0 ou -1 não libera zona dourada
}
