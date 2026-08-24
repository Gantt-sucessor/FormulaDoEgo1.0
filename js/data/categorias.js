// Fórmula do Ego — Gênios e Aprendizes (categorias)
// Personagem escolhe 1 categoria + 1 arquétipo dela. Começa com 0 habilidades de categoria.

export const CATEGORIAS = [
  {
    id: 'genio',
    nome: 'Gênio',
    tema: 'Dom congênito. Evolui via instinto próprio; raramente aprende armas novas, aprimora a que já nasceu usando.',
    arquetipos: [
      { id: 'genes_abencoados', nome: 'Genes abençoados', descricao: 'Corpo excepcional (músculos, fôlego, saltos) — vitórias por genética pura.' },
      { id: 'puro_instinto', nome: 'Puro instinto', descricao: 'Joga sem pensar/calcular, guiado por instinto de vitória.' },
      { id: 'arquiteto', nome: 'Arquiteto', descricao: 'Gênio com raciocínio lógico acima da média, joga calculado.' },
    ],
    evolucao: [
      { nivel: 1, ganhos: 'Criação de personagem + 1 nível de ótica' },
      { nivel: 2, ganhos: '+2 pontos de perícia' },
      { nivel: 3, ganhos: '+1 habilidade de categoria + 1 ponto de perícia' },
      { nivel: 4, ganhos: '+2 pontos de perícia' },
      { nivel: 5, ganhos: '+2 pontos de perícia + 1 habilidade de categoria + 1 nível de ótica' },
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
      { nivel: 1, ganhos: 'Criação de personagem + 1 Ponto de chama' },
      { nivel: 2, ganhos: '+1 Ponto de chama' },
      { nivel: 3, ganhos: '+1 nível de ótica + 1 habilidade de categoria' },
      { nivel: 4, ganhos: '+2 pontos de chama + 1 nível de ótica' },
      { nivel: 5, ganhos: '+2 pontos de chama + 2 pontos de perícia distribuíveis' },
    ],
  },
];

// Habilidades de categoria — só pega se seu arquétipo estiver na lista.
export const HABILIDADES_DE_CATEGORIA = [
  { nome: 'Compleição desgastante', arquetipos: ['genes_abencoados', 'talentoso'], esf: '+3 PdE', dis: 'pessoal', dur: '1d4+1 turnos', tda: 'Ação egoísta + Reação', texto: 'Com 0 PdE acumulados, ativa: +2 fôlegos até fim da rodada + adrenalina por d4+1 turnos. Ao fim, fica exausto por 3 turnos.' },
  { nome: 'Forçando destino', arquetipos: ['genes_abencoados', 'afortunado'], esf: '+2 PdE', dis: 'pessoal', dur: 'instantânea', tda: 'Ação egoísta', gex: '1 fôlego', texto: 'Se a jogada usaria perícia com +2 ou menos, usa sua maior perícia no lugar e ignora efeitos negativos ativos (só na execução).' },
  { nome: 'Esforço arriscado', arquetipos: ['genes_abencoados', 'determinado'], esf: '+2 PdE', dis: 'pessoal', dur: 'instantânea', tda: 'Ação egoísta', gex: '2 fôlegos', texto: 'Faz jogada de Potência/Destreza/Robustez/passe mesmo sem ação tática, mas fica lesionado por d4+2 turnos.' },
  { nome: 'Plano: Marionete', arquetipos: ['arquiteto', 'talentoso'], esf: '+3 PdE', dis: '8x8m', dur: 'instantânea', tda: 'Ação egoísta + Reação', texto: 'Aliado com bola em 8x8m é obrigado a chutar, passar ou avançar driblando quem estiver no caminho.' },
  { nome: 'Magnetismo imprevisível', arquetipos: ['arquiteto', 'afortunado'], esf: '+1 PdE', dis: '6m', dur: 'instantânea', tda: 'Reação', texto: 'Em rebote/passe antecipado/espalmar até 6m: bola vem até sua perna boa; voleio +3 bônus ou domínio +4 bônus.' },
  { nome: 'Percepção espacial', arquetipos: ['arquiteto', 'determinado'], esf: '+4 PdE', dis: 'pessoal', dur: 'Visão de jogo+1 turnos', tda: 'Ação egoísta', prep: 'M/3 turnos', texto: 'Sem a bola: +2m DdP, interceptar não custa PdE p/ distância, troca atributo por Cognição, avança 1m ao fim de todo turno.' },
  { nome: 'Máquina inumana', arquetipos: ['puro_instinto', 'talentoso'], esf: '+2 PdE', dis: '8x8m', dur: 'd4+1 turnos', tda: 'Ação egoísta + Reação', texto: 'Ao ganhar J vs J, cria área estática: quem tentar te impedir gasta 1 reação e 1 fôlego a mais.' },
  { nome: 'Improvisação', arquetipos: ['puro_instinto', 'afortunado'], esf: '+1 PdE', dis: 'pessoal', dur: 'instantânea', tda: 'Reação', texto: 'Ao falhar teste com perícia +3 ou menos: rerola com -3 bônus (ou gasta 1 PdS pra rerolar sem malefício).' },
  { nome: 'Restrição de lógica', arquetipos: ['puro_instinto', 'determinado'], esf: '+3 PdE', dis: 'pessoal', dur: 'Instintos+1 turnos', tda: 'Ação egoísta', texto: 'Ao chegar a 0 fôlegos: vira besta insaciável — Cognição vira -1, mas +1 reação, +3 fôlegos, +2m DdC, anula 1 efeito negativo.' },
];
