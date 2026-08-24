// Fórmula do Ego — Óticas (Visões)
// Escolhe 1 ótica, evolui em 3 níveis via nível de categoria (gênio/aprendiz).
// Nv1: passiva | Nv2: melhora da passiva | Nv3: melhora + habilidade + catalisadores disponíveis

export const OTICAS = [
  {
    id: 'neutra',
    nome: 'Visão Neutra',
    tema: 'Olhos versáteis, sem nenhuma habilidade incomum — mas versáteis até demais.',
    niveis: [
      'Início de rodada: +1 em todas as perícias por 1 turno.',
      '+2 de bônus por 2 turnos.',
      '+3 de bônus por 3 turnos, +1 fôlego adicional durante o benefício.',
    ],
    habilidade_nv3: { nome: 'Jogador volátil', esf: '+2 PdE (+1)', dis: 'pessoal', dur: 'd4[d6]+1 turnos', tda: 'Ação egoísta', texto: '1 vantagem numa jogada à escolha por d4+1 turnos (ou +1 PdE p/ d6+1 turnos).' },
    catalisadores: 'Qualquer um da lista (sem restrição).',
  },
  {
    id: 'fotografica',
    nome: 'Visão Fotográfica',
    tema: 'Olhos que enxergam tudo como fotografias — cada jogada é uma nova print.',
    niveis: [
      'Oponente adjacente = "foto"; acompanha ele por 2m andados.',
      'Corrida 3m, +1 bônus na próxima jogada contra o alvo.',
      'Corrida 4m, +2 bônus, pode tentar roubar com +2 se fôlegos do alvo acabarem.',
    ],
    habilidade_nv3: { nome: 'Print screen', esf: '+3 PdE', dis: 'setor todo', dur: 'até sair do setor', tda: 'Ação egoísta + reação', texto: 'Tira "print" do setor (teste de Momento dj15+2/alvo); se ganhar, +2 bônus Destreza/Drible +2 fôlegos.' },
    catalisadores: 'Metavisão OU Fênix.',
  },
  {
    id: 'berserker',
    nome: 'Visão Berserker',
    tema: '"Eu sou... CAOS!" — enxerga a pura destruição em campo.',
    niveis: [
      'Ganhar teste com maior atributo do alvo = ego alto por 2 turnos.',
      'Duração 3 turnos, ignora efeitos negativos por 1 turno.',
      'Duração 2 turnos, +1 bônus em qualquer perícia com 1+ ponto.',
    ],
    habilidade_nv3: { nome: 'Eu não me importo de morrer!', esf: '+4 PdE', dis: 'pessoal', dur: 'instantâneo', tda: 'Ação egoísta', gex: '2 fôlegos', texto: 'Teste J vs J com atributo que não o maior: ignora efeitos negativos + 3 vantagens; fica lesionado 3 turnos depois.' },
    catalisadores: 'Impulsos destrutivos OU Olhos de predador.',
  },
  {
    id: 'metodica',
    nome: 'Visão Metódica',
    tema: '"Não consegue?" — enxerga o destino de todos como peças fora do lugar.',
    niveis: [
      'Oponente falha resistência contra você = ego ferido por 2 turnos (não acumulativo).',
      'Duração 3 turnos, alvo -1 no maior atributo por 1 turno.',
      'Malefício -2 bônus/2 turnos, vira acumulativo (só quantidade).',
    ],
    habilidade_nv3: { nome: 'Peças fora do lugar', esf: '+3 PdE', dis: 'setor escolhido', dur: 'Visão de jogo+1 turnos', tda: 'Ação egoísta + Reação', texto: 'Escolhe setor inimigo: Ataque/Lateral -4 atributos ofensivos; Zaga/Meio-campo -4 atributos defensivos.' },
    catalisadores: 'Ciborgue OU Ego ensandecido.',
  },
  {
    id: 'monstruosa',
    nome: 'Visão Monstruosa',
    tema: '"Haha trollei!" — mil possibilidades de zoar seus alvos.',
    niveis: [
      'Troca perícia de Drible por Criatividade, custa 2 fôlegos.',
      'Custo cai pra 1 fôlego, +1m ao driblar alvo com o efeito ativo.',
      'Custo zero, +2m adicional.',
    ],
    habilidade_nv3: { nome: 'Transformei minha maldição em benção!', esf: '+3 PdE', dis: 'pessoal', dur: 'Criatividade+1 turnos', tda: 'Ação egoísta', gex: '1 PdS', texto: 'Perícias com 3+ pontos ganham 1 vantagem.' },
    catalisadores: 'Ginga OU Euforia.',
  },
  {
    id: 'somatica',
    nome: 'Visão Somática',
    tema: '"GET OUT!" — enxerga o corpo como um todo, não só a jogada.',
    niveis: [
      '+1 bônus em Robustez por estressado acumulado contra você.',
      'Pode driblar com Robustez em vez de Drible na zona dourada.',
      'Bônus dobra (Robustez +2).',
    ],
    habilidade_nv3: { nome: 'Loirinha da Noruega', esf: '+3 PdE', dis: 'pessoal', dur: 'Agressividade+1 turnos', tda: 'Ação egoísta', gex: '2 fôlegos', texto: '+2 bônus segurando em marcação; cabeceios +2m, ignoram malefícios naturais e usam Agressividade.' },
    catalisadores: 'Perfeição OU Deus da velocidade.',
  },
  {
    id: 'soberana',
    nome: 'Visão Soberana',
    tema: '"Eu sou absoluto" — enxerga o motivo de você ter nascido: para imperar.',
    niveis: [
      'Jogadas na zona dourada podem trocar o atributo pedido pelo seu maior atributo.',
      'Entrar na zona remove 1 efeito negativo por 2 turnos.',
      'Todos efeitos negativos removidos (3 turnos); usa maior perícia + maior atributo juntos.',
    ],
    habilidade_nv3: { nome: 'Hizamazuke', esf: '+3 PdE', dis: 'pessoal', dur: 'Momento+1 turnos', tda: 'Ação egoísta', gex: '1 PdS', texto: 'Ganhar J vs J por 5+ de diferença = alvo cai, fica caído 2 turnos.' },
    catalisadores: 'Metavisão OU Olhos de predador.',
  },
  {
    id: 'impulsiva',
    nome: 'Visão Impulsiva',
    tema: '"Que minha alma lute!" — atenta a qualquer adversidade, até reativamente.',
    niveis: [
      'Anula até 1 desvantagem/-2 bônus em jogadas com reação.',
      '+1 reação adicional se no setor da sua posição.',
      '+1 reação em qualquer setor; anulação sobe pra 2 desvantagens/-4 bônus.',
    ],
    habilidade_nv3: { nome: 'Hiperfoco instintivo', esf: '+2 PdE', dis: 'pessoal', dur: 'até executar jogada com reação', tda: 'Ação egoísta + Reação', gex: '2 fôlegos', texto: 'Próxima jogada com reação (exceto gol) tem 2 vantagens, mas Cognição -1 desvantagem até executar.' },
    catalisadores: 'Ciborgue OU Fênix.',
  },
  {
    id: 'velocista',
    nome: 'Visão Velocista',
    tema: '"Gotta go fast!" — o próximo movimento perfeito sempre envolve correr.',
    niveis: [
      'Corre 1m sem gastar fôlegos no início de cada rodada.',
      '+1 fôlego adicional na rodada se estiver na lateral no seu turno.',
      'Corrida sobe pra 3m; benefício adicional +2 fôlegos.',
    ],
    habilidade_nv3: { nome: 'Corte atrás de corte', esf: '+3 PdE', dis: '4m', dur: 'instantâneo', tda: 'Ação de movimento', gex: '2 fôlegos', texto: 'Avança 4m; se achar alvo, corre mais 4m pra direita/esquerda; repete até não achar mais alvos.' },
    catalisadores: 'Euforia OU Deus da velocidade.',
  },
  {
    id: 'gananciosa',
    nome: 'Visão Gananciosa',
    tema: '"Preço abusivo" — enxerga o valor de tudo em dinheiro vivo.',
    niveis: [
      '+1 bônus em J vs J se o alvo tiver 3+ pontos na perícia de resistir.',
      'Bônus +2; vencer 2x mesma posição = -1 PdE.',
      'Só precisa vencer 1x pro benefício.',
    ],
    habilidade_nv3: { nome: 'E pro beta, o que sobrou?', esf: '+2 PdE', dis: 'pessoal', dur: 'instantâneo', tda: 'Ação egoísta', gex: '1 fôlego', texto: 'Em J vs J, alvo recebe -1 bônus acumulativo por jogada que ganhou nessa e na última rodada.' },
    catalisadores: 'Ginga OU Ego ensandecido.',
  },
  {
    id: 'vingativa',
    nome: 'Visão Vingativa',
    tema: '"V de vingança" — a vingança nunca é plena, mas às vezes vale a pena.',
    niveis: [
      'Se alvo te vence, +1 bônus na próxima J vs J contra ele (não acumulativo).',
      'Pode somar metade da Determinação na jogada.',
      'Bônus +2, soma Determinação inteira, vira acumulativo.',
    ],
    habilidade_nv3: { nome: 'Você sou eu, cara, eu sou você...', esf: '+3 PdE', dis: 'pessoal', dur: 'até ganhar do alvo', tda: 'Ação egoísta', texto: 'Marca alvo "desprezível", ganha inspirado contra ele até vencê-lo em J vs J; falhas somam acumulação.' },
    catalisadores: 'Perfeição OU Impulsos destrutivos.',
  },
];
