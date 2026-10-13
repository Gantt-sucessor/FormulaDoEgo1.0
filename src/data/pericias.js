// Fórmula do Ego — Perícias
// 10 pontos para distribuir na criação. Máximo de 5 pontos em uma única perícia.

export const PONTOS_PERICIA_CRIACAO = 10;
export const MAX_PONTOS_PERICIA = 5;

export const PERICIAS = [
  // Potência
  { id: 'precisao', nome: 'Precisão', atributo: 'potencia', descricao: 'Sua mira e capacidade em acertar chutes em locais específicos.' },
  { id: 'trajetoria', nome: 'Trajetória', atributo: 'potencia', descricao: 'Sua maestria em realizar chutes de diferentes locais e ângulos.' },
  { id: 'especializacao', nome: 'Especialização', atributo: 'potencia', descricao: 'A velocidade e força de seus chutes em geral.' },

  // Destreza
  { id: 'agilidade', nome: 'Agilidade', atributo: 'destreza', descricao: 'Sua agilidade e capacidade de reagir rapidamente a mudanças sem perder eficiência.' },
  { id: 'constancia', nome: 'Constância', atributo: 'destreza', descricao: 'Seu vigor e persistência em manter corridas longas ou esforços físicos.' },
  { id: 'instintos', nome: 'Instintos', atributo: 'destreza', descricao: 'Sua velocidade de pensamento mesmo quando nem você percebe a situação.' },

  // Robustez
  { id: 'musculos', nome: 'Músculos', atributo: 'robustez', descricao: 'Sua tenacidade e controle muscular do seu corpo.' },
  { id: 'agressividade', nome: 'Agressividade', atributo: 'robustez', descricao: 'Sua maestria em utilizar seu próprio corpo para esmagar alvos.' },
  { id: 'escudo', nome: 'Escudo', atributo: 'robustez', descricao: 'Sua maestria em utilizar seu corpo como uma defesa para com a bola.' },

  // Cognição
  { id: 'visao_de_jogo', nome: 'Visão de jogo', atributo: 'cognicao', descricao: 'Sua capacidade de analisar as melhores oportunidades em jogo.' },
  { id: 'momento', nome: 'Momento', atributo: 'cognicao', descricao: 'Sua velocidade de reação mental, não apenas instintiva.' },
  { id: 'posicionamento', nome: 'Posicionamento', atributo: 'cognicao', descricao: 'Sua noção sobre o campo, setores e locais para ficar ou evitar.' },

  // Drible
  { id: 'criatividade', nome: 'Criatividade', atributo: 'drible', descricao: 'Sua maneira de pensar em jeitos diferentes e criativos de driblar oponentes.' },
  { id: 'pressao', nome: 'Pressão', atributo: 'drible', descricao: 'Como você lida com a pressão de vários alvos.' },
  { id: 'posse', nome: 'Posse', atributo: 'drible', descricao: 'Seu domínio em manter a bola sempre em sua posse.' },

  // Ego
  { id: 'emocional', nome: 'Emocional', atributo: 'ego', descricao: 'Sua capacidade de quebrar o emocional e mental dos outros.' },
  { id: 'consumir', nome: 'Consumir', atributo: 'ego', descricao: 'A vontade imparável de ser o melhor do jogo e tomar os holofotes para si.' },
  { id: 'determinacao', nome: 'Determinação', atributo: 'ego', descricao: 'Sua força de vontade para seguir em frente independente do que aconteça.' },
];

export function periciasPorAtributo(atributoId) {
  return PERICIAS.filter((p) => p.atributo === atributoId);
}
