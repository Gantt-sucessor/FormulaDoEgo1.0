// Fórmula do Ego — Catalisadores
// Cada Ótica libera 2 catalisadores possíveis (ver campo "catalisadores" em oticas.js).
// Cada catalisador tem: passiva sempre ativa, jogadas que acumulam potencial, e 1 habilidade exclusiva.

export const CATALISADORES = [
  {
    id: 'metavisao',
    nome: 'Metavisão',
    tema: 'Você vê o campo de todas as perspectivas possíveis, criando sua própria simulação e usando da leitura de campo pra achar o espaço, tempo e jogada perfeita e trazer sua teoria à prática.',
    passiva: { nome: 'Conexão extraintuitiva', texto: 'Ao analisar um alvo: Aliado → passes/domínios pra ele ganham 2 vantagens. Inimigo → ele perde 1 reação e interceptar passes dele (mesmo altos) tem +6 de bônus.' },
    jogadas_potencial: [
      { acao: '2x análise', potencial: 1 },
      { acao: 'Interceptação', potencial: 2 },
      { acao: '2x desarme', potencial: 1 },
    ],
    habilidade: { nome: 'Quarta dimensão', esf: '+5 PdE', dis: 'pessoal', dur: 'Cognição x2 turnos', tda: 'Ação egoísta', texto: 'Sem a bola, ativa em seu turno; por Cognição x2 turnos, de acordo com o setor: Zaga = roubos/interceptações não gastam reações; Meio-campo/Lateral = +4m de DdP, domínio garantido e +4 fôlegos; Ataque = Cognição x2 de bônus em chutes e dribles.' },
  },
  {
    id: 'olhos_de_predador',
    nome: 'Olhos de Predador',
    tema: 'A sua percepção permite identificar brechas na defesa e antecipar o instante perfeito pra atacar, como um predador que fixa sua presa antes do bote.',
    passiva: { nome: 'Foco na presa', texto: '(texto exato dessa passiva não ficou legível na leitura do livro — o nome e a lógica geral de "focar num alvo" estão confirmados, falta o número exato do bônus.)' },
    jogadas_potencial: [
      { acao: 'Devorar', potencial: 1 },
      { acao: 'Chute + gol', potencial: 2 },
      { acao: '2x desarme', potencial: 1 },
    ],
    habilidade: { nome: 'Alvo na mira', esf: '+6 PdE', dis: '1 setor', dur: 'instantâneo', tda: 'Ação tática', gex: '4 fôlegos', texto: 'Com a bola, a 1 setor do gol adversário: avança sua DdC em metros em direção ao gol (dribla quem estiver no caminho usando Potência). Ao fim do avanço, chuta: adversários que tentarem parar têm 3 desvantagens, e o goleiro fica confuso pra tentar defender.' },
  },
  {
    id: 'ginga',
    nome: 'Ginga',
    tema: 'Aquele molejo em seus pés e a beleza em seus dribles transforma cada caneta em samba e cada finta numa formosura que só um brasileiro poderia fazer.',
    passiva: { nome: 'Arte da dança', texto: 'Pode fazer dribles utilizando qualquer uma das 3 perícias do atributo Drible (Pressão, Criatividade ou Posse).' },
    jogadas_potencial: [
      { acao: '2x drible', potencial: 1 },
      { acao: 'Drible + gol', potencial: 2 },
      { acao: '2x trash talk', potencial: 1 },
    ],
    habilidade: { nome: 'Vem x1!', esf: '+2 PdE', dis: 'setor', dur: 'd4 turnos', tda: '—', texto: 'Com a bola, obriga um alvo (exceto goleiro) do setor a avançar até você e fazer um desarme. Se você driblar, ele fica caído por d4 turnos, você avança 2m e pode repetir a habilidade sem receber PdE de novo. Repetindo 3x seguidas sem falhar, todos os driblados ficam com ego quebrado.' },
  },
  {
    id: 'impulsos_destrutivos',
    nome: 'Impulsos Destrutivos',
    tema: 'Futebol não é feito só pra jogar e se divertir. Pra você, é sinônimo de caçar, executar, massacrar, eliminar, subjugar, pisar, destroçar, arrancar, devorar e MATAR!',
    passiva: { nome: 'Rancor espelhado', texto: 'Sempre que ganhar de um alvo num teste de J vs J, diminui em uma patente o atributo que ele usou na jogada até o fim do catalisador (ex: +3 → +2; se já estiver em -1, não pode diminuir mais).' },
    jogadas_potencial: [
      { acao: '2x jogo sujo', potencial: 1 },
      { acao: 'Chute + gol', potencial: 2 },
      { acao: 'Devorar', potencial: 1 },
    ],
    habilidade: { nome: 'Mão de Deus', esf: '+5 PdE', dis: 'variável', dur: 'variável', tda: 'Ação egoísta + 2 reações', texto: 'Com a bola, cria uma área de 6x6m que te acompanha. Ao um alvo entrar nela, avança até ele e testa Consumir vs Constância com bônus à sua escolha: -6 = vitória derruba por 1 rodada + 2 turnos; -4 = vitória derruba por d8 turnos; -2 = vitória derruba por d4 turnos.' },
  },
  {
    id: 'euforia',
    nome: 'Euforia',
    tema: 'Quanto mais você joga, mais aquela chama de vitória cresce dentro de você e mais o seu desejo de jogar aumenta. Só vai se sentir satisfeito quando encontrar um oponente à altura.',
    passiva: { nome: 'Labareda', texto: 'Sempre que ganhar numa jogada de J vs J, recebe +2 de bônus na próxima jogada de J vs J (acumulativo, não reinicia ao falhar). A cada +8 de bônus acumulado assim, recebe ego alto por 1 rodada.' },
    jogadas_potencial: [
      { acao: '2x investida', potencial: 1 },
      { acao: 'Gol com efeitos negativos ativos em você', potencial: 3 },
      { acao: 'Devorar', potencial: 1 },
    ],
    habilidade: { nome: 'Sinto esse fogo', esf: '+8 PdE', dis: 'pessoal', dur: 'variável', tda: 'Ação egoísta', texto: 'Com a bola, até o fim do catalisador: toda vitória em J vs J dá ego inflado naquele turno e reduz 2 PdE. Pode passar do limite de 8 PdE, só recebendo os efeitos de excesso ao encerrar a habilidade.' },
  },
  {
    id: 'ciborgue',
    nome: 'Ciborgue',
    tema: 'Seu corpo? Apenas uma máquina moldada a partir das engrenagens mais fortes do globo. Muitos podem até dizer que você se move como um robô, mas vão repensar ao estarem no chão.',
    passiva: { nome: 'Precisão matemática', texto: 'Sempre que enfrentar alguém com uma perícia menor que a sua, a jogada tem 2 vantagens (se a perícia for igual em valor, recebe só 1 vantagem).' },
    jogadas_potencial: [
      { acao: '2x análise', potencial: 1 },
      { acao: '2x drible', potencial: 1 },
      { acao: '2x desarme', potencial: 1 },
    ],
    habilidade: { nome: 'Mecanismo sem defeitos', esf: '+4 PdE', dis: '5m', dur: '3 turnos', tda: '—', texto: 'Ao ganhar numa jogada de J vs J, recupera todas as suas ações perdidas até o momento e avança 5m, deixando os alvos no caminho caídos por 3 turnos.' },
  },
  {
    id: 'deus_da_velocidade',
    nome: 'Deus da Velocidade',
    tema: 'Futebol é aceleração: quanto mais rápido você corre, mais oponentes caem no meio do caminho. Você é movido a gasolina, e está incendiando esse placar.',
    passiva: { nome: 'Come poeira!', texto: 'Dribla oponentes usando Destreza e, ao driblar ou passar ao lado de um alvo, pode fazer uma investida sem gastar nenhuma ação.' },
    jogadas_potencial: [
      { acao: '2x investida', potencial: 1 },
      { acao: '2x desarme', potencial: 1 },
      { acao: 'Interceptação', potencial: 1 },
    ],
    habilidade: { nome: 'Muito lento', esf: '+4 PdE', dis: 'pessoal', dur: 'variável', tda: '2 reações', texto: 'Ao ocorrer um passe/rebote num setor adjacente, avança até ele e faz uma interceptação com 2 vantagens. Ganhando, no início de todo turno até o fim do catalisador avança 3m (+1m a cada turno seguinte).' },
  },
  {
    id: 'perfeicao',
    nome: 'Perfeição',
    tema: 'Corpo perfeito? Check. Impulsão incrível? Check. Chute potente? Check. Você é perfeito em tudo, seu overall é S+, e ainda acham que vão te parar?',
    passiva: { nome: 'OVERALL NO MÁXIMO!', texto: 'Todos os seus atributos aumentam em uma patente (ex: +2 → +3; isso inclui o seu +4, que vira +5).' },
    jogadas_potencial: [
      { acao: 'Jogo de corpo', potencial: 1 },
      { acao: 'Marcação (1 rodada)', potencial: 1 },
      { acao: 'Trash talk', potencial: 1 },
    ],
    habilidade: { nome: 'Witness perfection', esf: '+5 PdE', dis: 'Músculos m', dur: 'd6+1 turnos', tda: 'Ação egoísta', texto: 'Com ou sem a bola, cria uma área de Músculos metros que te acompanha. Alvos dentro fazem um teste de Posicionamento Dj 20 no início de todo turno em que estiverem lá, por d6+2 turnos — falhando, ficam exaustos e caídos até a próxima rodada.' },
  },
  {
    id: 'fenix',
    nome: 'Fênix',
    tema: 'Assim como uma família unida, todo seu time joga em prol de um só objetivo: vencer. Mesmo que falhem nele, todos podem renascer do pó com a ajuda de uma fênix.',
    passiva: { nome: 'Sem brechas', texto: 'Ignora flanqueamentos e recebe +1 vantagem em jogadas pra cada aliado adjacente a você.' },
    jogadas_potencial: [
      { acao: '2x drible', potencial: 1 },
      { acao: '2x passe', potencial: 1 },
      { acao: '2x análise', potencial: 1 },
    ],
    habilidade: { nome: 'Família calorosa', esf: '+5 PdE', dis: 'pessoal', dur: 'Cognição rodadas', tda: '2 reações OU Ação egoísta', texto: 'Com ou sem a bola, seus aliados podem fazer uma ação reativa sem gastar reação e ficam inspirados até o fim do catalisador. Ao mesmo tempo, todos os inimigos num raio de 4x4m ficam imóveis até o fim do catalisador.' },
  },
  {
    id: 'ego_ensandecido',
    nome: 'Ego Ensandecido',
    tema: 'Protagonismo é o de menos, ego é tudo que você tem, e só assim vai alcançar toda glória enquanto perdedores o rodeiam. O próximo melhor jogador vai ser você.',
    passiva: { nome: 'Guiado pelo ego', texto: 'Ignora ego quebrado e dobra os benefícios de ego inflado.' },
    jogadas_potencial: [
      { acao: 'Devorar', potencial: 1 },
      { acao: '2x desarme', potencial: 1 },
      { acao: '2x análise', potencial: 1 },
    ],
    habilidade: { nome: 'Deus do Futebol', esf: '+8 PdE', dis: 'pessoal', dur: 'variável', tda: 'Ação egoísta', texto: 'Com a bola: tem +1 de bônus em qualquer teste, dobrando a cada novo turno (1º turno = +1, 2º = +2, 3º = +4...). Efeitos causados pelo excesso de PdE só se aplicam ao fim da duração. Dura até o fim do catalisador.' },
  },
];