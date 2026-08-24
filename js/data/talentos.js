// Fórmula do Ego — Talentos Impetuosos
// Comprados com Pontos de Chama. 5 espaços de armazenamento no total.
// Tipos: evolutivo (1 chama/nível), simples (1), razoável (2), complexo (3).

export const MAX_SLOTS_TALENTOS = 5;

export const TALENTOS_EVOLUTIVOS = [
  {
    id: 'oneshot',
    nome: 'Oneshot',
    frase: 'Ore wa striker da!',
    esf: '+3 PdE', dis: 'DdP+2m (evolutível)', dur: 'instantâneo', tda: 'Ação egoísta + tática',
    niveis: [
      'Chute regular com 1 vantagem +2m DdC.',
      'Escolhe chute regular ou curvo; 1 vantagem → 1 vantagem+3 bônus.',
      'Inclui chute de poder; 2 vantagens+3 bônus.',
    ],
  },
  {
    id: 'passe_celestial',
    nome: 'Passe Celestial',
    esf: '+3 PdE', dis: 'DdP+2m (evolutível)', dur: 'instantâneo', tda: 'Ação egoísta + tática',
    niveis: [
      'Passe longo com 1 vantagem +2m DdP.',
      'Alcança qualquer setor adjacente; 2 vantagens.',
      'Qualquer distância, garantido, vira passe alto.',
    ],
  },
  {
    id: 'destrone_ataque',
    nome: 'Destrone o Ataque',
    frase: 'Encomendei lápides para o meu cemitério!',
    esf: '+2 PdE', dis: 'adjacente', dur: 'instantâneo', tda: 'Ação egoísta', gex: '2 fôlegos',
    niveis: [
      'Roubo com 1 vantagem; se ganhar, avança 2m.',
      '1 vantagem+3 bônus; avança 3m; retira 2 fôlegos do roubado.',
      '2 vantagens+3 bônus; avança 4m; passe curto garantido ao final.',
    ],
  },
  {
    id: 'ala_messi',
    nome: 'Ala Messi',
    frase: 'Nos pés sinto a magia!',
    esf: '+4 PdE', dis: 'pessoal', dur: 'Drible turnos (evolutível)', tda: 'Ação egoísta', gex: '3 fôlegos',
    niveis: [
      '1 vantagem numa perícia de Drible à escolha, por Drible turnos.',
      '1 vantagem+3 bônus; 2 perícias; Drible+1 turnos.',
      '2 vantagens+3 bônus; todas perícias de Drible; Drible+2 turnos.',
    ],
  },
  {
    id: 'inutil',
    nome: 'Inútil, Inútil, Inútil!',
    frase: 'Desista dos seus sonhos e morra!',
    esf: '+2 PdE', dis: 'pessoal', dur: 'Emocional turnos (evolutível)', tda: 'Ação egoísta',
    niveis: [
      'Trash talk com 1 vantagem; se ganhar, alvo recebe ego ferido por Emocional turnos.',
      '1 vantagem+3 bônus; Emocional+1 turnos.',
      '2 vantagens+3 bônus; Emocional+2 turnos; ego ferido x2.',
    ],
  },
];

export const TALENTOS_SIMPLES = [
  { id: 'cabeca_dura', nome: 'Cabeça-dura', esf: '+3 PdE', dis: '½DdC+3m', dur: 'instantâneo', tda: 'Ação egoísta + Reação', texto: 'Cabeceio ofensivo +3 bônus, ignora malefícios de não estar no ar/flanqueamento, +3m distância.' },
  { id: 'judas', nome: 'Judas', frase: 'Torne-se um traidor por trinta moedas!', esf: '+3 PdE', dis: 'DdP/pessoal', dur: 'd4+2/d6+1 turnos', tda: 'Ação egoísta + tática', texto: 'Passe longo pra um INIMIGO; se dominar sem interceptação: você ganha ego alto x2, time recebe ego ferido.' },
  { id: 'ponto_cego', nome: 'Ponto cego + sem bola', esf: '+2 PdE', dis: 'pessoal', dur: 'Posicionamento+1 turnos', tda: 'Ação egoísta', prep: 'P/2 turnos', texto: 'Sem a bola: +2 fôlegos, +3 bônus escapar marcação/roubo, fica furtivo. Acaba ao ganhar posse.' },
  { id: 'a_gasolina', nome: 'À gasolina', frase: 'Perde a linha, puxa o brabo!', esf: '+3 PdE', dis: 'Investida+1m', dur: 'instantâneo', tda: 'Reação', gex: '3 fôlegos', texto: 'Investida +1m; se achar alvo, drible usa Destreza em vez do atributo padrão.' },
  { id: 'zero_reset_turn', nome: 'Zero Reset Turn', esf: '+2 PdE', dis: '3m/2m', dur: 'instantâneo', tda: '2 reações', gex: '3 fôlegos', texto: 'Ao ser flanqueado, avança 3m saindo do flanqueamento; pode passar pra aliado, que avança 2m se dominar.' },
];

export const TALENTOS_RAZOAVEIS = [
  { id: 'finta_imprevisivel', nome: 'Finta imprevisível', frase: 'Eu te enganei gêniozinho!', esf: '+4 PdE', dis: 'pessoal', dur: 'instantâneo', tda: '2 reações', gex: '3 fôlegos', texto: 'Se declarar chute e alguém declarar interceptação, finta e faz novo chute/passe; interceptador -2 desvantagens naquele turno.' },
  { id: 'calcanhar_de_aquiles', nome: 'Calcanhar de Aquiles', frase: 'É GOL DO DRAGÃO!', esf: '+4 PdE', dis: 'DdC[-3m]', dur: 'instantâneo', tda: 'Ação egoísta + tática', texto: 'Com bola + ângulo cortado/flanqueado: remove um malefício da perna ruim; flanqueadores não interceptam.' },
  { id: 'pisar_na_bola', nome: 'Pisar na Bola', esf: '+4 PdE', dis: '4m/DdP', dur: 'instantâneo/3 turnos', tda: 'Ação de movimento', texto: 'Todos aliados avançam 4m; escolhe um na DdP e passa +3; se dominar, ganha inspirado por 3 turnos.' },
  { id: 'pegx_pegx', nome: 'PEGx PEGx', esf: '+4 PdE', dis: 'adjacente/4x4m', dur: '4 turnos', tda: 'Ação egoísta + tática', texto: 'Sem bola, adjacente a alvo: marcação com 2 vantagens na 1ª rodada; área 4x4m que te acompanha.' },
  { id: 'ganancia_do_polvo', nome: 'Ganância do Polvo', esf: '+4 PdE', dis: 'pessoal', dur: '2 turnos', tda: 'Ação egoísta (+reação/alvo)', texto: 'Sem bola: escolhe aliados, dá +3 no próximo teste deles; se ganharem, você ganha bônus extra.' },
];

export const TALENTOS_COMPLEXOS = [
  { id: 'topo_da_cadeia', nome: 'Topo da Cadeia', frase: 'Predador! Devorando todos tipo um egoísta!', esf: '+5 PdE', dis: 'pessoal', dur: 'Consumir+4 turnos', tda: 'Ação egoísta', gex: '1 PdS', texto: 'Sem bola: "devorar" pode ser feito contra inimigos também; devorar aliados nesse modo tem +3 bônus.' },
  { id: 'salto_de_conejito', nome: 'Salto de Conejito', esf: '+4 PdE', dis: 'pessoal/6x6m', dur: 'Especialização+3 turnos', tda: 'Ação egoísta + movimento', texto: 'Sem bola: fica no ar, alvos em 6x6m perdem 4 fôlegos; se receber passe, voleio +2 vantagens+2 bônus.' },
  { id: 'visoes_cruzadas', nome: 'Visões Cruzadas', esf: '+4 PdE', dis: '8m/5m', dur: 'Emocional+5 turnos', tda: 'Ação egoísta + 2 reações', texto: 'Aliado com bola a 8m: anda 5m, pede passe (+4 bônus); ao dominar, ambos andam e testam pra reação química.' },
  { id: 'ainda_ta_morno', nome: 'Ainda tá morno...', esf: '+4 PdE', dis: 'pessoal', dur: '2 rodadas', tda: 'Ação egoísta', gex: '2 PdS', texto: 'Ao ganhar J vs J, alvo testa Determinação; se falhar, tem que testar antes de qualquer chute/drible/passe por 2 rodadas.' },
  { id: 'avanco_estracalhador', nome: 'Avanço Estraçalhador', esf: '+4 PdE', dis: 'pessoal', dur: 'd6+2 turnos', tda: 'Ação egoísta', prep: 'M/3 turnos', texto: 'Com bola: Drible usa Robustez, oponentes -5 bônus pra roubar; cada drible dá ego alto acumulativo.' },
];
