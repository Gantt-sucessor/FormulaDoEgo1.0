// Fórmula do Ego — Gênios e Aprendizes (categorias)
// Personagem escolhe 1 categoria + 1 arquétipo dela. Começa com 0 habilidades de categoria.

export const CATEGORIAS = [
  {
    id: 'genio',
    nome: 'Gênio',
    tema: 'Dom congênito. Evolui via instinto próprio; raramente aprende armas novas, aprimora a que já nasceu usando.',
    arquetipos: [
      { id: 'genes_abencoados', nome: 'Genes absurdos', descricao: 'Corpo excepcional (músculos, fôlego, saltos) — vitórias por genética pura.' },
      { id: 'puro_instinto', nome: 'Puro instinto', descricao: 'Joga sem pensar/calcular, guiado por instinto de vitória.' },
      { id: 'arquiteto', nome: 'Arquiteto', descricao: 'Gênio com raciocínio lógico acima da média, joga calculado.' },
    ],
    evolucao: [
      { nivel: 1, ganhos: 'Criação de personagem + 1 nível de ótica' },
      { nivel: 2, ganhos: '+2 Pontos de Chama' },
      { nivel: 3, ganhos: '+1 nível de ótica + 1 habilidade de categoria' },
      { nivel: 4, ganhos: '+2 Pontos de Chama + 2 pontos de perícia distribuíveis' },
      { nivel: 5, ganhos: '+2 Pontos de Chama + 1 nível de ótica' },
    ],
  },
  {
    id: 'aprendiz',
    nome: 'Aprendiz',
    tema: 'Sem dom nato, mas com adaptabilidade — aprende coisas novas constantemente.',
    arquetipos: [
      { id: 'talentoso', nome: 'Talentoso', descricao: 'Talento não é fixo, muda conforme a situação (adaptação).' },
      { id: 'determinado', nome: 'Determinado', descricao: 'Evolui pela vontade de evoluir, sem talento nato.' },
      { id: 'afortunado', nome: 'Afortunado', descricao: 'A sorte guia sua evolução — coincidências perfeitas.' },
    ],
    evolucao: [
      { nivel: 1, ganhos: 'Criação de personagem + 1 ponto de perícia' },
      { nivel: 2, ganhos: '+2 pontos de perícia' },
      { nivel: 3, ganhos: '+1 habilidade de categoria + 1 ponto de perícia' },
      { nivel: 4, ganhos: '+2 pontos de perícia + 1 nível de ótica' },
      { nivel: 5, ganhos: '+2 pontos de perícia + 1 habilidade de categoria' },
    ],
  },
];

// Habilidades de categoria — só pega se seu arquétipo estiver na lista.
export const HABILIDADES_DE_CATEGORIA = [
  {
    nome: 'Compleição desgastante',
    frase: 'Falou que eu era só um cara rápido, por que você tá sendo goleado?',
    arquetipos: ['genes_abencoados', 'talentoso'],
    esf: '+3 PdE', dis: 'pessoal', dur: '1d4+1 turnos', tda: 'Ação egoísta + Reação',
    texto: 'Ao estar com 0 PdE acumulados, pode ativar essa habilidade em seu turno. Com a ativação de tal, recebe +2 fôlegos adicionais até o fim da rodada atual e o efeito adrenalina por d4+1 turnos. Ao fim da duração dessa habilidade, você fica exausto por 3 turnos.',
  },
  {
    nome: 'Forçando destino',
    frase: 'Meu destino é criado por mim mesmo, não por idiotas como você!',
    arquetipos: ['genes_abencoados', 'afortunado'],
    esf: '+2 PdE', dis: 'pessoal', dur: 'instantânea', tda: 'Ação egoísta', gex: '1 fôlego',
    texto: 'Ao desejar fazer uma jogada qualquer que tenha +2 ou menos pontos na perícia necessária, pode ativar essa habilidade para compensar. Com a ativação de tal, você utiliza sua maior perícia no lugar da pedida e ignora efeitos negativos ativos no momento [apenas durante a execução da jogada].',
  },
  {
    nome: 'Esforço arriscado',
    frase: 'Eu aprendi, devo manter a constância, cem por cento do tempo, eu serei útil.',
    arquetipos: ['genes_abencoados', 'determinado'],
    esf: '+2 PdE', dis: 'pessoal', dur: 'instantânea', tda: 'Ação egoísta', gex: '2 fôlegos',
    texto: 'Ao desejar fazer uma jogada de Potência, Destreza, Robustez ou passes que utilizem ação tática mas não possua tal ação, pode ativar essa habilidade para compensar. Com a ativação de tal, você faz a jogada desejada mesmo sem ter a ação tática requerida, porém fica lesionado por d4 turnos.',
  },
  {
    nome: 'Plano: Marionete',
    frase: 'Inimigos que me encontraram, cês tão sem sorte, após sua morte, vira meu fantoche e vai tá eternamente em minha posse.',
    arquetipos: ['arquiteto', 'talentoso'],
    esf: '+2 PdE', dis: '8x8m', dur: 'instantânea', tda: 'Ação egoísta + Reação',
    texto: 'Caso haja um aliado com a bola em um raio de 8x8m, pode ativar essa habilidade em seu turno. Com a ativação de tal, você obriga o aliado selecionado à [escolha uma opção]: a] fazer uma jogada de chute à sua escolha. b] fazer um passe para qualquer aliado à sua escolha, incluindo você. c] avançar 4m e driblar qualquer alvo no caminho.',
  },
  {
    nome: 'Magnetismo imprevisível',
    frase: 'Vocês são bons, mas a bola, cruelmente, caiu nos pés do gênio!',
    arquetipos: ['arquiteto', 'afortunado'],
    esf: '+1 PdE', dis: '6m', dur: 'instantânea', tda: 'Reação',
    texto: 'Caso ocorra um rebote/o final de um passe antecipado/espalmar em até 6m de você, pode ativar essa habilidade gastando as reações necessárias. Com a ativação de tal, a bola vem em sua direção automaticamente e ficando adjacente à sua perna boa, com você podendo: fazer um voleio com +3 de bônus [mas ainda com as desvantagens caso não esteja no ar]; ou fazer um domínio com +4 de bônus.',
  },
  {
    nome: 'Percepção espacial',
    frase: 'Penso, logo te esmago!',
    arquetipos: ['arquiteto', 'determinado'],
    esf: '+4 PdE', dis: 'pessoal', dur: 'visão de jogo + 1 turnos', tda: 'Ação egoísta', prep: 'M/3 turnos',
    texto: 'Ao estar sem a bola, pode ativar essa habilidade em seu turno. Você entra em um estado de percepção total por visão de jogo + 1 turnos. Durante esse modo: sua DdP possui +2m; interceptar não dá rebote em maior distância; pode trocar o atributo de qualquer teste por Cognição [ex: Cognição-músculos]; pode avançar 1m ao fim de todo turno.',
  },
  {
    nome: 'Máquina inumana',
    frase: 'Em desespero profundo, vão deixar o mundo te esmagar? Ou cês vão esmagar o mundo?',
    arquetipos: ['puro_instinto', 'talentoso'],
    esf: '+2 PdE', dis: '8x8m', dur: 'd4+1 turnos', tda: 'Ação egoísta + Reação',
    texto: 'Ao ganhar em um teste de J vs J, pode ativar essa habilidade gastando as reações necessárias. Com a ativação de tal, você cria uma área estática de 8x8m à sua volta que dura d4+1 turnos. Todos dentro desse círculo não entendem seus movimentos, tendo que gastar 1 reação adicional e 1 fôlego ao tentarem te impedir [ex: interceptação, roubo, etc].',
  },
  {
    nome: 'Improvisação',
    frase: 'Nada foi conforme o previsto... Bem, é hora de tentar de novo!',
    arquetipos: ['puro_instinto', 'afortunado'],
    esf: '+1 PdE', dis: 'pessoal', dur: 'instantânea', tda: 'Reação',
    texto: 'Ao fazer um teste de uma perícia que tenha +3 ou menos e falhar, pode ativar essa habilidade gastando as reações necessárias. Com a ativação de tal, você roda novamente a jogada pedida porém com -3 de bônus, trocando o resultado anterior pelo do novo dado. Caso deseje, ao ativar essa habilidade, pode gastar 1 PdS para retirar os bônus negativos do teste e rodá-lo naturalmente.',
  },
  {
    nome: 'Restrição de lógica',
    frase: 'Aberração da natureza, e você é minha presa, não adianta correr, vai morrer!',
    arquetipos: ['puro_instinto', 'determinado'],
    esf: '+3 PdE', dis: 'pessoal', dur: 'instintos + 1 turnos', tda: 'Ação egoísta',
    texto: 'Ao chegar a 0 fôlegos na rodada, pode ativar essa habilidade gastando as ações necessárias. Com a ativação de tal, você se torna uma besta insaciável por instintos + 1 turno. Durante esse modo, seu atributo de Cognição se torna [-1], porém recebe: +1 reação; +3 fôlegos adicionais por rodada; +2m de DdC; anula 1 [um] efeito negativo.',
  },
];