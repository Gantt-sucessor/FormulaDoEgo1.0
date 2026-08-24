// Fórmula do Ego — Tendências
// Escolhe 1 tendência principal (dá o Dom + escolha de perícia) e 1 secundária (dá uma passiva).
// A secundária pode ser igual ou diferente da principal.

export const TENDENCIAS = [
  {
    id: 'ambidestro',
    nome: 'Ambidestro',
    tema: 'Controla ambas as pernas de maneira dominante.',
    dom: {
      nome: 'Controle simultâneo',
      texto: '+1 PdE no turno para trocar sua perna dominante pela oposta pelo resto da partida (repetível). Com ângulo cortado, pode usar a perna boa mesmo assim.',
    },
    pericia_adicional: ['posse', 'momento', 'trajetoria'],
    passiva_secundaria: {
      nome: 'Semi-balanceado',
      texto: 'Chutar com a perna ruim não reduz mais distâncias de passe e chute.',
    },
  },
  {
    id: 'acrobatico',
    nome: 'Acrobático',
    tema: 'Mobilidade anormal, corpo flexível como um ginasta.',
    dom: {
      nome: 'Proporções aéreas',
      texto: 'Gasta 3 fôlegos para "saltar": fica Constância+1 turnos com efeito no ar, +1m em interceptações sem gastar PdE.',
    },
    pericia_adicional: ['agilidade', 'pressao', 'precisao'],
    passiva_secundaria: {
      nome: 'Propulsão calculada',
      texto: 'Gastar todos os fôlegos em um turno faz você ficar no ar por 2 turnos.',
    },
  },
  {
    id: 'corpulento',
    nome: 'Corpulento',
    tema: 'Corpo robusto, forte, potente.',
    dom: {
      nome: 'Pivô de pura fibra',
      texto: '+1 PdE e 2 fôlegos num teste de Drible troca o atributo por Robustez (mais 1 fôlego troca também a perícia).',
    },
    pericia_adicional: ['musculos', 'escudo', 'agressividade'],
    passiva_secundaria: {
      nome: 'Tanque de guerra',
      texto: 'Jogo de corpo retira -6 fôlegos do alvo (em vez de -5); +1 bônus para segurar em marcação.',
    },
  },
  {
    id: 'incansavel',
    nome: 'Incansável',
    tema: 'Músculos que não cansam, mente acelerada.',
    dom: {
      nome: 'Corpo adaptado',
      texto: '+2 PdE troca ação tática por ação de movimento + metade dos fôlegos máximos (ou o inverso).',
    },
    pericia_adicional: ['constancia', 'musculos', 'especializacao'],
    passiva_secundaria: {
      nome: 'Katchau!',
      texto: '+1 fôlego adicional quando na lateral ou meio-campo.',
    },
  },
  {
    id: 'trombadinha',
    nome: 'Trombadinha',
    tema: 'Joga pra irritar e se divertir vendo os outros estressados.',
    dom: {
      nome: 'Ragebait',
      texto: 'Ao ganhar J vs J, +1 PdE pra fazer trash talk sem gastar ação; +1 bônus por estressado em campo (dobra contra aliados).',
    },
    pericia_adicional: ['criatividade', 'emocional', 'posse'],
    passiva_secundaria: {
      nome: 'Faz careta!',
      texto: '+2 bônus em qualquer teste contra alvos já estressados.',
    },
  },
  {
    id: 'algoz',
    nome: 'Algoz',
    tema: 'Um executor cruel que chega sem ser percebido.',
    dom: {
      nome: 'Jack, o estripador',
      texto: 'Ação egoísta + 2 PdE fica furtivo por Agilidade+1 turnos; enquanto furtivo, +2 bônus em roubos e +2 fôlegos.',
    },
    pericia_adicional: ['agilidade', 'instintos', 'momento'],
    passiva_secundaria: {
      nome: 'Última medida',
      texto: '+1 bônus em roubar/interceptar o alvo por cada aliado que ele venceu em J vs J na última rodada.',
    },
  },
  {
    id: 'antagonista',
    nome: 'Antagonista',
    tema: 'Se eles querem ser heróis, você é o vilão.',
    dom: {
      nome: 'Incendiando Roma',
      texto: 'Ao devorar aliado, +2 PdE pra escolher: inspirado, +1 ação egoísta, +3 fôlegos ou +2m DdC.',
    },
    pericia_adicional: ['consumir', 'especializacao', 'agressividade'],
    passiva_secundaria: {
      nome: 'AINDA TÁ POUCO?!',
      texto: '1 vantagem no próximo devorar se o alvo já marcou gol ou já te devorou antes.',
    },
  },
  {
    id: 'hedonista',
    nome: 'Hedonista',
    tema: 'Futebol é só um meio de atingir seus prazeres.',
    dom: {
      nome: 'Fiz um banquete!',
      texto: 'Ao vencer J vs J, +2 PdE pra "prazer" = inspirado por Emocional+2 turnos (vitórias seguidas dão mais).',
    },
    pericia_adicional: ['determinacao', 'criatividade', 'emocional'],
    passiva_secundaria: {
      nome: 'Insaciável',
      texto: '+1 turno de adrenalina por cada jogada bem-sucedida em seguida.',
    },
  },
  {
    id: 'maestro',
    nome: 'Maestro',
    tema: 'O campo é um tabuleiro e você move as peças.',
    dom: {
      nome: 'Roque',
      texto: 'Análise bem-sucedida + 1 PdE faz aliados em 8x8m se moverem 3m; pode gastar 2 reações pra passe +5 pro que se moveu.',
    },
    pericia_adicional: ['visao_de_jogo', 'posicionamento', 'pressao'],
    passiva_secundaria: {
      nome: 'En Passant',
      texto: 'Ao analisar aliado adjacente, ele avança 2m e +2 bônus no próximo teste (só nessa rodada).',
    },
  },
  {
    id: 'apatico',
    nome: 'Apático',
    tema: 'O sentimento dos outros pouco importa.',
    dom: {
      nome: 'Você é deplorável...',
      texto: 'Ação egoísta+2 reações testa Emocional vs Determinação de alvo adjacente; ganha = +2 PdE e ego ferido+confuso pro alvo.',
    },
    pericia_adicional: ['emocional', 'visao_de_jogo', 'agilidade'],
    passiva_secundaria: {
      nome: "P#rra nenhuma",
      texto: 'Alvos com ego ferido/quebrado têm -2 bônus em J vs J contra você.',
    },
  },
  {
    id: 'idealista',
    nome: 'Idealista',
    tema: 'Motivos nobres movem seu futebol.',
    dom: {
      nome: 'Fardo de Deus',
      texto: 'Ao falhar teste com perícia própria, +2 PdE+1 reação pra rerolar com +3 bônus.',
    },
    pericia_adicional: ['determinacao', 'trajetoria', 'pressao'],
    passiva_secundaria: {
      nome: 'No escuro eu sigo!',
      texto: 'Ao acabar duração de ego ferido/quebrado, ganha ego alto/inflado por 2 turnos.',
    },
  },
  {
    id: 'coringa',
    nome: 'Coringa',
    tema: 'Não se encaixa em nada e se encaixa em tudo.',
    dom: {
      nome: 'Sem ocasiões ruins / Duelo de sorte',
      texto: 'Bônus contextual por setor ao entrar nele; ou gasta 1 PdS num J vs J pra rolar d2 (1=falha garantida, 2=vitória garantida).',
    },
    pericia_adicional: ['posicionamento', 'precisao', 'constancia'],
    passiva_secundaria: {
      nome: 'Naipe indefinido',
      texto: 'Pode ativar zona dourada em setor diferente do seu, +2 PdE adicional se escolher.',
    },
  },
  {
    id: 'rebelde',
    nome: 'Rebelde',
    tema: 'Limites não existem — evolui derrubando os mais fortes com sorte.',
    dom: null,
    pericia_adicional: [],
    passiva_secundaria: {
      nome: 'Contra destino',
      texto: 'Gasta 1 PdS pra remover efeito negativo de inimigo por 2 rodadas; começa toda partida com 1 PdS.',
    },
  },
];
