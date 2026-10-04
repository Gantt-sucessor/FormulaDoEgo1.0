// Fórmula do Ego — Jogadas base
// Cada jogada tem: perícia usada, dj (dificuldade da jogada), distância, ação gasta, anormalidade.

export const JOGADAS = {
  chutes: [
    { id: 'chute_curvo', nome: 'Chute curvo', pericia: 'trajetoria', dj: 'J vs G', distancia: 'DdC', acao: 'Ação tática', anormalidade: 'Com a bola no ar, pode curvá-la, desviando metros p/ esquerda/direita/diagonal.' },
    { id: 'chute_regular', nome: 'Chute regular', pericia: 'precisao', dj: 'J vs G', distancia: 'DdC', acao: 'Ação tática', anormalidade: 'Nenhuma.' },
    { id: 'chute_de_poder', nome: 'Chute de poder', pericia: 'especializacao', dj: 'J vs G', distancia: 'DdC+2m', acao: 'Ação tática', anormalidade: 'Ignora o primeiro interceptador (exceto contra habilidades).' },
    { id: 'voleio', nome: 'Voleio', pericia: 'instintos + precisao ÷ 2', pericias_compostas: ['instintos', 'precisao'], divisor: 2, atributo: 'potencia', dj: 'J vs G', distancia: 'DdC', acao: '2 reações', anormalidade: 'Só como reação a um passe aliado. 2 desvantagens se não estiver no ar. Atributo usado: sempre Potência.' },
  ],
  passes: [
    { id: 'passe_longo', nome: 'Passe longo', pericia: 'visao_de_jogo', dj: 14, distancia: 'DdP', acao: 'Ação tática', anormalidade: 'Nenhuma.' },
    { id: 'passe_curto', nome: 'Passe curto', pericia: 'momento', dj: 8, distancia: '3m', acao: 'Ação tática', anormalidade: 'Nenhuma.' },
    { id: 'passe_alto', nome: 'Passe alto', pericia: 'posicionamento', dj: '20 + 2 por alvo no caminho', distancia: 'DdP', acao: 'Ação tática', anormalidade: 'Não é interceptável.' },
    { id: 'passe_antecipado', nome: 'Passe antecipado', pericia: 'momento', dj: 16, distancia: '6m', acao: 'Ação tática', anormalidade: 'Todos em 3x3m do final avançam até ele como reação, não precisa de alvo. [Reação]' },
  ],
  dribles: [
    { id: 'roubo', nome: 'Roubo', pericia: 'agilidade', dj: 'J vs J', distancia: 'Adjacente', acao: 'Ação tática OU reação', anormalidade: 'Se ganhar, recebe posse e recupera a ação tática.' },
    { id: 'jogo_de_corpo', nome: 'Jogo de corpo', pericia: 'agressividade', dj: 'J vs J', distancia: 'Adjacente', acao: 'Ação tática OU reação', anormalidade: 'Se ganhar, recebe posse e alvo perde os 5 fôlegos da rodada.' },
    { id: 'elastico', nome: 'Elástico', pericia: 'criatividade', dj: 'J vs J', distancia: 'Adjacente', acao: 'Reação', anormalidade: 'Se ganhar, você se move 1m para a direita/esquerda e o oponente se move 1m para o lado oposto.' },
    { id: 'caneta', nome: 'Caneta', pericia: 'pressao', dj: 'J vs J', distancia: 'Adjacente', acao: '2 reações', anormalidade: 'Se ganhar, se move para trás do alvo e pode andar +1m em seguida.' },
    { id: 'chapeu', nome: 'Chapéu', pericia: 'posse', dj: 'J vs J', distancia: 'Adjacente', acao: 'Reação', anormalidade: 'Se ganhar, joga a bola 2m e avança com ela. Alvos adjacentes trocam seus testes de desarme por interceptação.' },
    { id: 'pedalada', nome: 'Pedalada', pericia: 'pressao', dj: 'J vs J', distancia: 'Adjacente', acao: 'Ação tática', anormalidade: 'Força um teste de desarme a um alvo adjacente, avançando 3m se ganhar.' },
  ],
  defesa: [
    { id: 'dominio', nome: 'Domínio', pericia: 'posse', dj: 'dj do passe x2 - resultado do passador', distancia: 'pessoal', acao: 'Reação', anormalidade: 'Pega a bola em posse através de um passe aliado.' },
    { id: 'jogo_sujo', nome: 'Jogo sujo', pericia: 'determinacao', dj: 'J vs J', distancia: 'Adjacente', acao: 'Ação tática', anormalidade: 'Se ganhar, alvo recebe lesionado por d2+1 turnos.' },
    { id: 'interceptacao', nome: 'Interceptação', pericia: 'instintos', dj: 'resultado do passe/chute', distancia: '1m', acao: '2 reações', anormalidade: 'Para o passe/chute no meio e toma a posse.' },
    { id: 'marcacao', nome: 'Marcação', pericia: 'escudo', dj: 'J vs J', distancia: 'Adjacente', acao: 'Ação tática', anormalidade: 'Alvo fica com metade dos fôlegos e não pode dominar passes.' },
    { id: 'analise', nome: 'Análise', pericia: 'visao_de_jogo', dj: '12+ (por metro de distância)', distancia: '10m', acao: 'Ação tática', anormalidade: 'Contra oponente: +3 bônus próxima jogada. Contra aliado: +1 vantagem no próximo passe.' },
    { id: 'trash_talk', nome: 'Trash talk', pericia: 'emocional', dj: 'J vs J', distancia: '5m', acao: 'Ação egoísta', anormalidade: 'Teste de Emocional vs Determinação (resistência). Se ganhar, alvo fica estressado por 1 rodada (só acumula efeito, não duração).' },
    { id: 'corta_angulo', nome: 'Corta-ângulo', pericia: 'escudo', dj: 'J vs J', distancia: 'Adjacente', acao: 'Ação tática', anormalidade: 'Acompanha o alvo, que só pode agir com a perna ruim enquanto cortado. Escape: teste de Escudo vs Momento (resistência). Pode ser feito contra alvos com ou sem a posse de bola.' },
  ],
  goleiro: [
    { id: 'defesa_de_goleiro', nome: 'Defesa de goleiro', pericia: 'agilidade', dj: 'chute inimigo', distancia: 'Adjacente', acao: '2 reações', anormalidade: 'Para a trajetória e toma posse. Obriga um passe logo em seguida.' },
    { id: 'espalmar', nome: 'Espalmar', pericia: 'instintos', dj: 'chute inimigo', distancia: 'Adjacente', acao: 'Reação', anormalidade: 'A bola volta metade da trajetória e fica livre.' },
    { id: 'erguer_base', nome: 'Erguer base', pericia: 'constancia + posicionamento ÷ 2', pericias_compostas: ['constancia', 'posicionamento'], divisor: 2, atributo: 'cognicao', dj: 10, distancia: 'pessoal', acao: 'Ação de movimento', anormalidade: 'Facilita defesas seguintes; dj sobe +2 por turno seguido, tendo que rerolar no início de todo turno. Atributo usado: sempre Cognição.' },
  ],
  outras: [
    { id: 'investida', nome: 'Investida', pericia: null, dj: null, distancia: 'Agilidade + 1m', acao: 'Ação tática', anormalidade: 'Avança uma quantidade de metros igual sua perícia de Agilidade + 1, em qualquer direção.' },
  ],
};