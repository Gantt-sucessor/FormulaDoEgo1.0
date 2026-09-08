// Fórmula do Ego — Sistema de Fluxo
// Fluxo básico: 6 pontos de ápice nos atributos (1:1, +1 bônus direto) + 3 jogadas com 1 vantagem.
// Fluxo complexo: 10 pontos de ápice, com a tabela de custo do livro (ver final do arquivo).

export const TIPOS_AURA = [
  {
    id: 'primitiva',
    nome: 'Primitiva',
    tema: 'Geralmente se relaciona a animais ou seres que refletem seu âmago. Representa seu estilo de jogo naturalmente — maior facilidade em alinhar corpo e mente, mas altera pouco seu estilo. Te torna um monstro nos seus pontos fortes.',
    percentual_necessario: 110,
    efeitos_permitidos: 1,
    marcas_adicionais: '+2 marcas fáceis e +1 marca média extras.',
  },
  {
    id: 'demonstrativa',
    nome: 'Demonstrativa',
    tema: 'Associada a objetos ou ideias abstratas que refletem seu raciocínio lógico. Não fica sintonizada o tempo todo — exige mais esforço pra alcançar, mas recompensa com aumento significativo das habilidades em campo.',
    percentual_necessario: 130,
    efeitos_permitidos: 2,
    marcas_adicionais: '+1 marca média e +1 marca difícil extras.',
  },
  {
    id: 'contida',
    nome: 'Contida',
    tema: 'Associada ao âmago mais interno do personagem, sem forma definida. Difícil de alinhar ao estilo de jogo, mas com a maior recompensa entre os três tipos.',
    percentual_necessario: 150,
    efeitos_permitidos: 3,
    marcas_adicionais: '+1 marca impossível extra.',
  },
];

export const EFEITOS_AURA = [
  { id: 'sniper', nome: 'Sniper', texto: 'Tem +4m de DdC e DdP enquanto com sua Aura ativa.' },
  { id: 'corpo_nao_pitagorico', nome: 'Corpo não-pitagórico', texto: 'Gasta apenas 1x fôlegos (em vez de 2x) ao andar em diagonais, e escapa de marcações de forma garantida enquanto com a Aura ativa.' },
  { id: 'metabolismo_acelerado', nome: 'Metabolismo acelerado', texto: 'Seus efeitos negativos duram metade do normal e, ao fim de uma rodada, retira 3 PdE (em vez de 2). Ambos enquanto a Aura estiver ativa.' },
  { id: 'acumulo_de_dopamina', nome: 'Acúmulo de dopamina', texto: 'Escolhe entre ficar com adrenalina, furtivo, ou no ar enquanto com a Aura ativa.' },
  { id: 'expansao_de_dominio', nome: 'Expansão de domínio', texto: 'Triplica (em vez de duplicar) suas perícias dentro da zona dourada enquanto com a Aura ativa.' },
  { id: 'quebra_de_limitador', nome: 'Quebra de limitador', texto: 'Seu limite de PdE se torna 12, só recebendo os efeitos de excesso ao atingir esse novo limite. Dura enquanto a Aura estiver ativa.' },
  { id: 'quick_time_event', nome: 'Quick Time Event', texto: 'Oponentes não podem usar ações reativas em testes que você ganhar, e você não gasta reações pra fazer ações reativas. Dura enquanto a Aura estiver ativa.' },
  { id: 'consistente', nome: 'Consistente', texto: 'Efeitos positivos externos duram 2x mais tempo enquanto com a Aura ativa.' },
  { id: '999kmh', nome: '999 km/h', texto: 'Tem +5 fôlegos e +2 reações enquanto com a Aura ativa.' },
  { id: 'sem_chance', nome: 'SEM CHANCE!', texto: 'Alvos que perderem contra você duas vezes na mesma rodada perdem o próximo turno, enquanto com a Aura ativa.' },
];

// Marcas de despertar — clicar soma % de fluxo automaticamente.
export const MARCAS_DESPERTAR = {
  facil: [
    { id: 'molejo_brasileiro', nome: 'Molejo brasileiro', texto: 'Drible 2 alvos em uma mesma rodada.', recompensa: 5 },
    { id: 'passe_tijolo', nome: 'Passe tijolo', texto: 'Domine um passe com Dj acima de 14.', recompensa: 5 },
    { id: 'jogador_libero', nome: 'Jogador Líbero', texto: 'Entre em um setor que não seja da sua posição (1x por rodada).', recompensa: 5 },
    { id: 'eu_sou_a_injustica', nome: 'Eu sou a injustiça', texto: 'Ganhe em um jogo sujo/trash talk contra um alvo que já possua um efeito negativo.', recompensa: 5 },
    { id: 'eu_cai', nome: '"Eu... caí?"', texto: 'Zere os fôlegos de um jogador usando jogo de corpo.', recompensa: 5 },
    { id: 'all_in', nome: 'All In', texto: 'Ganhe em um teste que você possua 2 ou menos pontos na perícia necessária.', recompensa: 5 },
    { id: 'cava_falta_gol', nome: 'Cava uma falta que é gol!', texto: 'Faça uma cobrança/pênalti.', recompensa: 5 },
    { id: 'calma_chocolate_branco', nome: 'Calma chocolate branco...', texto: 'Deixe um jogador em sua marcação por 1 rodada completa.', recompensa: 5 },
    { id: 'im_the_king', nome: "I'm the king!", texto: 'Tenha 2+ efeitos positivos diferentes ao mesmo tempo.', recompensa: 5 },
    { id: 'tenta_passar', nome: 'Tenta passar!', texto: 'Faça um desarme bem-sucedido dentro da zaga do seu time.', recompensa: 5 },
  ],
  media: [
    { id: 'pes_leves', nome: 'Pés leves', texto: 'Escape de uma marcação durante uma ação reativa sua.', recompensa: 10 },
    { id: 'sanguessuga', nome: 'Sanguessuga', texto: 'Após um roubo bem-sucedido, use a ação tática recuperada pra testar contra o roubado e ganhe.', recompensa: 10 },
    { id: 'mosquito_insistente', nome: 'Mosquito insistente', texto: 'Ganhe em 2 testes J vs J/J vs G enquanto no ar, numa janela de 2 rodadas.', recompensa: 10 },
    { id: 'lobo_pidao', nome: 'Lobo pidão', texto: 'Recepcione 2 passes feitos pra você através de um pedir passe.', recompensa: 10 },
    { id: 'nigerundayo', nome: 'Nigerundayo!', texto: 'Escape de um flanqueamento utilizando uma investida.', recompensa: 10 },
    { id: 'quebrando_limites', nome: 'Quebrando limites', texto: 'Faça um passe/chute bem-sucedido fora da sua devida distância.', recompensa: 10 },
    { id: 'cacador_de_espacos', nome: 'Caçador de espaços', texto: 'Faça um passe/chute bem-sucedido onde 2+ alvos podem tentar ir contra a jogada.', recompensa: 10 },
    { id: 'centro_da_orbita', nome: 'Centro da órbita', texto: 'Domine/intercepte 3 passes numa janela de 2 rodadas.', recompensa: 10 },
    { id: 'jackpot', nome: 'JACKPOT!', texto: 'Saia de 0 PdS e acumule até 3 PdS.', recompensa: 10 },
    { id: 'contar_vitoria', nome: 'Contar vitória', texto: 'Drible um alvo e, logo em seguida, faça um trash talk bem-sucedido contra ele.', recompensa: 10 },
  ],
  dificil: [
    { id: 'maestro_da_orquestra', nome: 'Maestro da orquestra', texto: 'Faça uma assistência (passe pra aliado e ele marcar sem perder a posse).', recompensa: 15 },
    { id: 'eu_sou_melhor', nome: 'EU SOU MELHOR!', texto: 'Fique com 3+ efeitos positivos diferentes ativos ao mesmo tempo.', recompensa: 15 },
    { id: 'inutilizar_as', nome: 'Inutilizar Ás', texto: 'Impeça um gol oponente de acontecer através de malefícios dados por você.', recompensa: 15 },
    { id: 'cranio_resistente', nome: 'Crânio resistente', texto: 'Faça um cabeceio bem-sucedido sem ignorar os malefícios inertes.', recompensa: 15 },
    { id: 'presa_definida', nome: 'Presa definida', texto: 'Acumule ego alto x2 devorando apenas um único jogador.', recompensa: 15 },
    { id: 'banheirista_de_elite', nome: 'Banheirista de Elite', texto: 'Faça uma finalização bem-sucedida dentro da grande área inimiga após receber um passe.', recompensa: 15 },
    { id: 'muleta_profissional', nome: 'Muleta profissional', texto: 'Ganhe numa jogada de J vs J usando sua perna ruim e sem ignorar os malefícios dela.', recompensa: 15 },
    { id: 'esfacelar_time', nome: 'Esfacelar time', texto: 'Deixe 3+ alvos do time inimigo com 1+ efeitos negativos ao mesmo tempo.', recompensa: 15 },
    { id: 'restricao_celestial', nome: 'Restrição celestial', texto: 'Ganhe de um alvo em J vs J estando com 2+ efeitos negativos (sem ignorar) OU com 7 PdE.', recompensa: 15 },
    { id: 'miseria', nome: 'Miséria', texto: 'Fique com 0 PdE acumulados por 6 turnos.', recompensa: 15 },
  ],
  impossivel: [
    { id: 'provacao_para_o_irmao', nome: 'Provação para o irmão', texto: 'Marque um gol através de uma cobrança de lateral/escanteio pro seu time sendo você o cobrador.', recompensa: 25 },
    { id: 'reconstruindo_imperios', nome: 'Reconstruindo impérios', texto: 'Saia de ego quebrado e faça um gol na mesma janela de tempo em que ficou afetado pelo efeito.', recompensa: 25 },
    { id: 'colocarei_o_valor_na_balanca', nome: 'Colocarei o valor de vocês na balança', texto: 'Faça uma assistência pra alguém que está em reação química com você.', recompensa: 25 },
    { id: 'passinho_do_jamal', nome: 'Passinho do Jamal', texto: 'Drible o goleiro num confronto um contra um e faça um gol.', recompensa: 25 },
    { id: 'dono_da_area', nome: 'Dono da área', texto: 'Pare 3 chutes inimigos usando habilidades numa janela de 2 rodadas, dentro da sua grande área.', recompensa: 25 },
    { id: 'pronto_pra_morrer', nome: 'Pronto pra morrer', texto: 'Mantenha um alvo com fluxo ou catalisador ativo em sua marcação por 2 rodadas.', recompensa: 25 },
    { id: 'esforco_maximo', nome: 'Esforço máximo', texto: 'Chegue em 8 de PdE e retire -4 PdE numa única rodada.', recompensa: 25 },
    { id: 'peca_de_sorte', nome: 'Peça de sorte', texto: 'Faça um gol após receber um passe/rebote que tentaram parar 2+ vezes.', recompensa: 25 },
    { id: 'hiena', nome: 'Hiena', texto: 'Faça 4 devorar seguidos sem falhar numa janela de 2 rodadas.', recompensa: 25 },
    { id: 'my_ball', nome: 'My ball...', texto: 'Faça um domínio e drible 3 alvos numa mesma rodada.', recompensa: 25 },
  ],
};

export function calcularPercentualFluxo(marcasMarcadas) {
  let total = 0;
  Object.values(MARCAS_DESPERTAR).forEach((lista) => {
    lista.forEach((marca) => {
      if (marcasMarcadas.includes(marca.id)) total += marca.recompensa;
    });
  });
  return total;
}

/**
 * Marcas de despertar agora são reutilizáveis: cada marca CONHECIDA pode ser "usada" várias
 * vezes numa partida, e cada uso soma a % de novo. marcasUsos = { marcaId: quantasVezes }.
 */
export function calcularPercentualFluxoComUsos(marcasConhecidas, marcasUsos) {
  let total = 0;
  Object.values(MARCAS_DESPERTAR).forEach((lista) => {
    lista.forEach((marca) => {
      if (!marcasConhecidas.includes(marca.id)) return;
      const usos = marcasUsos[marca.id] || 0;
      total += usos * marca.recompensa;
    });
  });
  return total;
}

/**
 * Quantas marcas de despertar você pode conhecer, de acordo com o nível e o tipo de Aura.
 * Da tabela de progressão de nível do livro: você ganha +1 marca no nível 4, +1 no nível 5,
 * e +1 no nível 8 (total de 3 marcas só por nível, até o nível 8). A Aura soma um bônus em cima disso.
 */
export function limiteMarcasDespertar(nivel, auraId) {
  const bonusPorAura = { primitiva: 3, demonstrativa: 2, contida: 1 };
  let marcasDoNivel = 0;
  if (nivel >= 4) marcasDoNivel += 1;
  if (nivel >= 5) marcasDoNivel += 1;
  if (nivel >= 8) marcasDoNivel += 1;
  return marcasDoNivel + (bonusPorAura[auraId] || 0);
}

export const NIVEL_MINIMO_FLUXO_COMPLEXO = 4;
export const NIVEL_MINIMO_CATALISADOR = 5;
export const NIVEL_MINIMO_HABILIDADE_CATALISADOR = 7;

// --- Fluxo complexo: tabela de custo por vantagem/bônus ---
// 10 pontos de ápice ao todo. O 1º atributo incluído é grátis pra "desbloquear";
// cada atributo adicional custa 3 pontos só pra ser incluído.
// Depois de incluído, cada vantagem custa 2 pontos, e cada +2 de bônus custa 2 pontos.
export const CUSTO_DESBLOQUEIO_ATRIBUTO_COMPLEXO = 3;
export const CUSTO_POR_VANTAGEM_COMPLEXO = 2;
export const MAX_VANTAGENS_COMPLEXO = 4;
export const MAX_BONUS_COMPLEXO = 8; // sobe de 2 em 2

/** Custo (em pontos de ápice) dos benefícios de UM atributo já incluído. */
export function custoAtributoComplexo(vantagens = 0, bonus = 0) {
  return vantagens * CUSTO_POR_VANTAGEM_COMPLEXO + bonus;
}

/**
 * Custo total do fluxo complexo inteiro.
 * apiceComplexo = { atributoId: { vantagens, bonus } } — só as chaves presentes contam como "incluídas".
 */
export function custoTotalComplexo(apiceComplexo) {
  const incluidos = Object.keys(apiceComplexo);
  const custoDesbloqueio = Math.max(0, incluidos.length - 1) * CUSTO_DESBLOQUEIO_ATRIBUTO_COMPLEXO;
  const custoBeneficios = incluidos.reduce((total, id) => {
    const dados = apiceComplexo[id] || {};
    return total + custoAtributoComplexo(dados.vantagens || 0, dados.bonus || 0);
  }, 0);
  return custoDesbloqueio + custoBeneficios;
}