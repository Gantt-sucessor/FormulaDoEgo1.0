// Fórmula do Ego — Jogadas base (livro, páginas 12–40)
// Cada jogada tem: perícia usada, dj (dificuldade da jogada), distância, ação gasta, anormalidade.
// Campos extras: pericias_compostas + divisor (soma ÷ divisor, arredondado para cima), atributo (fixo) ou
// atributo_opcoes (o jogador escolhe), usa (perícias que entram na jogada sem rolagem comum, só para as dicas).

export const JOGADAS = {
  chutes: [
    { id: 'chute_curvo', nome: 'Chute curvo', pericia: 'trajetoria', dj: 'J vs G', distancia: 'DdC', acao: 'Ação tática', anormalidade: 'Com a bola no ar, pode curvá-la, desviando metros para a esquerda, direita ou diagonal.' },
    { id: 'chute_regular', nome: 'Chute regular', pericia: 'precisao', dj: 'J vs G', distancia: 'DdC', acao: 'Ação tática', anormalidade: 'Nenhuma.' },
    { id: 'chute_de_poder', nome: 'Chute de poder', pericia: 'especializacao', dj: 'J vs G', distancia: 'DdC', acao: 'Ação tática', anormalidade: 'Role d2 antes do teste: 1 = +1 desvantagem; 2 = +1 vantagem.' },
    { id: 'voleio', nome: 'Voleio', pericia: 'instintos + precisao ÷ 2', pericias_compostas: ['instintos', 'precisao'], divisor: 2, atributo_opcoes: ['potencia', 'destreza'], dj: 'J vs G', distancia: 'DdC', acao: '2 reações', anormalidade: 'Apenas como reação a um passe aliado; 2 desvantagens se não estiver no ar. Se outro jogador quiser dominar/voleio no mesmo passe, quem tiver o maior resultado faz a jogada. Atributo à escolha: Potência ou Destreza.' },
  ],
  passes: [
    { id: 'passe_longo', nome: 'Passe longo', pericia: 'visao_de_jogo', dj: 14, distancia: 'DdP', acao: 'Ação tática', anormalidade: 'Nenhuma.' },
    { id: 'passe_curto', nome: 'Passe curto', pericia: 'momento', dj: 8, distancia: '3m', acao: 'Ação tática', anormalidade: 'Nenhuma.' },
    { id: 'passe_alto', nome: 'Passe alto', pericia: 'posicionamento', dj: 20, distancia: 'DdP', acao: 'Ação tática', anormalidade: 'Não é interceptável.' },
    { id: 'passe_antecipado', nome: 'Passe antecipado', pericia: 'momento', dj: 16, distancia: '6m', acao: 'Ação tática', anormalidade: 'Todos em 3x3m do final do passe avançam até ele como reação; não precisa de alvo. [Reação] Se mais de um jogador quiser dominar o passe, quem tiver o maior resultado ganha a posse.' },
  ],
  dribles: [
    { id: 'roubo', nome: 'Roubo', pericia: 'agilidade', dj: 'J vs J', distancia: 'Adjacente', acao: 'Ação tática OU reação (se o alvo gastar fôlego ao lado)', anormalidade: 'Se ganhar, recebe a posse e recupera a ação tática.' },
    { id: 'jogo_de_corpo', nome: 'Jogo de corpo', pericia: 'agressividade', dj: 'J vs J', distancia: 'Adjacente', acao: 'Ação tática OU reação', anormalidade: 'Se ganhar, recebe a posse e o alvo perde os 5 fôlegos da rodada.' },
    { id: 'elastico', nome: 'Elástico', pericia: 'posse', dj: 'J vs J', distancia: 'Adjacente', acao: 'Reação', anormalidade: 'Se ganhar, anda 1m sem gastar fôlegos.' },
    { id: 'caneta', nome: 'Caneta', pericia: 'criatividade', dj: 'J vs J', distancia: 'Adjacente', acao: '2 reações', anormalidade: 'Vai para trás do alvo e sai do estado "flanqueado".' },
    { id: 'chapeu', nome: 'Chapéu', pericia: 'pressao', dj: 'J vs J', distancia: 'Adjacente', acao: 'Reação + 2 fôlegos', anormalidade: 'Oponentes em até 2x2m não podem te roubar como reação.' },
    { id: 'pedalada', nome: 'Pedalada', pericia: 'constancia + pressao ÷ 2', pericias_compostas: ['constancia', 'pressao'], divisor: 2, atributo: 'drible', dj: 'J vs J', distancia: '2x2m', acao: '1 reação por alvo', anormalidade: 'Dribla até 3 alvos em 2x2m com um teste; depois, move-se para o lado de quem ganhou. Se perder, a bola vai para o maior resultado no roubo. Atributo: Drible.' },
  ],
  defesa: [
    { id: 'dominio', nome: 'Domínio', pericia: 'agilidade', dj: 'dj do passe aliado x2 − resultado do passador (dj natural 20)', distancia: 'pessoal', acao: 'Reação', anormalidade: 'Pega a bola em posse via passe aliado.' },
    { id: 'jogo_sujo', nome: 'Jogo sujo', pericia: 'determinacao', dj: 'J vs J', distancia: 'Adjacente', acao: 'Ação tática', anormalidade: 'Determinação vs Determinação (resistência); se ganhar, o alvo recebe "lesionado" por d2+1 turnos (só o efeito acumula).' },
    { id: 'interceptacao', nome: 'Interceptação', pericia: 'instintos', dj: 'resultado do passe/chute', distancia: '1m', acao: '2 reações', anormalidade: 'Para o passe/chute no meio e toma a posse; pode aumentar a distância em +1m, mas é obrigado a fazer rebote.' },
    { id: 'marcacao', nome: 'Marcação', pericia: 'musculos', dj: 'J vs J', distancia: 'Adjacente', acao: 'Ação tática', anormalidade: 'Você segue o alvo, que fica com metade dos fôlegos e não pode dominar passes. Para escapar, o alvo gasta ação tática e vence Agilidade OU Músculos vs Músculos (resistência). [Reação] Só marca alvos sem a posse de bola.' },
    { id: 'analise', nome: 'Análise', pericia: 'posicionamento', dj: '12+ (aumenta +1 por metro de distância do alvo)', distancia: '10m', acao: 'Ação tática', anormalidade: 'Contra oponente: +3 de bônus na próxima jogada contra ele (não acumulativo). Contra aliado: +1 vantagem no próximo passe para ele (não acumulativo).' },
    { id: 'trash_talk', nome: 'Trash talk', pericia: 'emocional', dj: 'J vs J', distancia: '5m', acao: 'Ação egoísta', anormalidade: 'Emocional vs Emocional (resistência); se ganhar, o alvo fica estressado por 1 rodada (acumula o efeito, não a duração).' },
    { id: 'corta_angulo', nome: 'Corta-ângulo', pericia: 'escudo', dj: 'J vs J', distancia: 'Adjacente', acao: 'Ação tática', anormalidade: 'Acompanha o alvo, que só pode agir com a perna ruim enquanto cortado; escape: Escudo vs Momento (resistência). Só contra quem tem a posse.' },
  ],
  goleiro: [
    { id: 'defesa_de_goleiro', nome: 'Defesa de goleiro', pericia: 'agilidade', dj: 'chute inimigo', distancia: 'Adjacente', acao: '2 reações', anormalidade: 'Para a trajetória do chute antes que entre e toma posse; obriga um passe logo em seguida. Só na posição de goleiro.' },
    { id: 'espalmar', nome: 'Espalmar', pericia: 'instintos', dj: 'chute inimigo', distancia: 'Adjacente', acao: 'Reação', anormalidade: 'Defende e a bola volta metade da trajetória, ficando livre. Só goleiro.' },
    { id: 'erguer_base', nome: 'Erguer base', pericia: 'constancia + posicionamento ÷ 2', pericias_compostas: ['constancia', 'posicionamento'], divisor: 2, atributo: 'cognicao', dj: 10, distancia: 'pessoal', acao: 'Ação de movimento', anormalidade: 'Pode fazer defesa de goleiro/espalmar gastando 1 reação a menos; a dj aumenta +2 por turno seguido usado, e deve ser rerolada a cada início de turno.' },
  ],
  outras: [
    { id: 'investida', nome: 'Investida', pericia: null, usa: ['constancia'], dj: null, distancia: 'Constância', acao: 'Ação tática', anormalidade: 'Avança metros iguais a Constância + 1, em qualquer direção.' },
    { id: 'pedir_passe', nome: 'Pedir passe', pericia: null, dj: null, distancia: '—', acao: 'Ação egoísta', anormalidade: 'O aliado com a posse pode passar para você gastando 1 reação. [Reação]' },
    { id: 'descansar', nome: 'Descansar', pericia: null, usa: ['constancia'], dj: null, distancia: '—', acao: 'Ação tática + ação de movimento + reação', anormalidade: 'Retira PdE iguais a 1 + (Constância ÷ 2).' },
    { id: 'levantar_bola', nome: 'Levantar bola', pericia: 'trajetoria + instintos ÷ 2', pericias_compostas: ['trajetoria', 'instintos'], divisor: 2, atributo_opcoes: ['potencia', 'destreza'], dj: 15, distancia: '1m', acao: '3 fôlegos', anormalidade: 'Joga a bola 1m em qualquer direção, avança até ela e faz voleio/cabeceio/domínio mesmo sem receber passe. A bola pode ser interceptada.' },
    { id: 'cabeceio', nome: 'Cabeceio', pericia: null, usa: ['agilidade'], dj: 'variável', distancia: 'Adjacente', acao: 'Reação', anormalidade: 'Ofensivo (só com o efeito "no ar"): substitui o voleio, 1 desvantagem, −3m na DdC; o goleiro só pode espalmar. Defensivo: substitui a interceptação, −3 de bônus, não aumenta a distância com PdE; se interceptar, passe curto com +3 de bônus para o aliado mais próximo (sem aliado próximo, rebote de cabeceio obrigatório). Atributo: Agilidade (nas duas formas).' },
    { id: 'devorar', nome: 'Devorar', pericia: null, usa: ['consumir'], dj: 'J vs J', distancia: 'variável', acao: 'variável', anormalidade: 'Só contra aliados: rouba o protagonismo (Consumir + perícia do método ÷ 2). Métodos: interceptação (Instintos; 2 reações + ação egoísta), roubo/jogo de corpo (Agilidade; ação tática + ação egoísta), não passar (Consumir vs Determinação; +1 PdE) e trash talk (Emocional; ação tática + ação egoísta). Ao devorar: você recebe "ego alto" e o alvo "ego ferido" por Ego × 2 turnos.' },
  ],
};
