import { OTICAS } from '../data/oticas.js';
import { CATALISADORES } from '../data/catalisadores.js';
import { HABILIDADES_DE_CATEGORIA } from '../data/categorias.js';
import { TIPOS_AURA, limiteMarcasDespertar, NIVEL_MINIMO_CATALISADOR, NIVEL_MINIMO_FLUXO_COMPLEXO, custoTotalComplexo } from '../data/fluxo.js';
import { MAX_SLOTS_TALENTOS } from '../data/talentos.js';
import { MAX_PONTOS_PERICIA } from '../data/pericias.js';
import { LIMITE_PDE } from '../regras/habilidades.js';
import {
  catalisadoresDaOtica, folegoMaximo, limiteHabilidadesCategoria, nomePericia, pdsMaximo, pontosPericiaMaximos, pontosPericiaUsados,
} from './ficha.js';

/**
 * Confere a ficha e devolve o que está errado ou faltando.
 * Cada item: { nivel: 'erro' | 'aviso', texto, aba, alvo }  (alvo = id da seção na aba, para rolar até lá)
 * Nunca altera a ficha — só avisa.
 */
export function validarFicha(f) {
  const p = [];
  const erro = (texto, aba, alvo) => p.push({ nivel: 'erro', texto, aba, alvo });
  const aviso = (texto, aba, alvo) => p.push({ nivel: 'aviso', texto, aba, alvo });

  if (!f.nome.trim()) erro('A ficha está sem nome.', 'personagem', 'sec-identidade');

  const usados = pontosPericiaUsados(f);
  const maximo = pontosPericiaMaximos(f);
  if (usados > maximo) erro(`Perícias: ${usados} pontos usados, mas o limite no nível ${f.nivel} é ${maximo} (${usados - maximo} a mais).`, 'personagem', 'sec-pericias');
  else if (usados < maximo) aviso(`Perícias: ainda sobram ${maximo - usados} ponto(s) para distribuir.`, 'personagem', 'sec-pericias');
  Object.entries(f.pericias || {}).forEach(([id, v]) => { if (v > MAX_PONTOS_PERICIA) erro(`Perícia "${nomePericia(id)}" está em ${v}; o máximo é ${MAX_PONTOS_PERICIA}.`, 'personagem', 'sec-pericias'); });

  if (!Object.values(f.atributos || {}).some((v) => v !== 0)) aviso('Nenhum atributo foi definido no hexágono.', 'personagem', 'sec-atributos');
  if (!f.armaId) aviso('Nenhuma arma escolhida — sem ela não aparecem habilidades ativas.', 'personagem', 'sec-arma');
  if (!f.oticaId) aviso('Nenhuma ótica escolhida.', 'personagem', 'sec-otica');
  if (!f.tendPrincipal) aviso('Tendência principal não escolhida.', 'personagem', 'sec-tendencias');
  else if (!f.tendPericia) aviso('Escolha a perícia adicional (+2) da sua tendência principal.', 'personagem', 'sec-tendencias');
  if (!f.categoriaId || !f.arquetipoId) aviso('Categoria e arquétipo não escolhidos.', 'personagem', 'sec-categoria');
  if (!f.posicao) aviso('Posição principal não definida.', 'personagem', 'sec-identidade');
  if (!f.perna) aviso('Perna dominante não definida.', 'personagem', 'sec-identidade');
  if (f.nivel >= 6 && !f.recompensa6) aviso('Recompensa do nível 6 ainda não escolhida.', 'personagem', 'sec-otica');

  // Ótica / catalisador
  const otica = OTICAS.find((o) => o.id === f.oticaId);
  if (f.catalisador?.id) {
    if (f.nivel < NIVEL_MINIMO_CATALISADOR) erro(`Catalisador só é liberado no nível ${NIVEL_MINIMO_CATALISADOR} (você está no ${f.nivel}).`, 'personagem', 'sec-otica');
    if (otica && !catalisadoresDaOtica(f).some((c) => c.id === f.catalisador.id)) {
      const nome = CATALISADORES.find((c) => c.id === f.catalisador.id)?.nome || f.catalisador.id;
      erro(`O catalisador ${nome} não combina com a ótica ${otica.nome}.`, 'personagem', 'sec-otica');
    }
    if ((f.catalisador.potencial || 0) > 10) erro('Potencial do catalisador acima de 10.', 'mesa');
  }

  // Habilidades de categoria
  const limCat = limiteHabilidadesCategoria(f);
  if (f.habilidadesCategoria.length > limCat) erro(`Habilidades de categoria: ${f.habilidadesCategoria.length} marcadas, mas o limite é ${limCat}.`, 'personagem', 'sec-categoria');
  f.habilidadesCategoria.forEach((nome) => {
    const h = HABILIDADES_DE_CATEGORIA.find((x) => x.nome === nome);
    if (!h) erro(`A habilidade de categoria "${nome}" não existe mais no livro.`, 'personagem', 'sec-categoria');
    else if (f.arquetipoId && !h.arquetipos.includes(f.arquetipoId)) erro(`"${nome}" não pertence ao seu arquétipo.`, 'personagem', 'sec-categoria');
  });

  // Talentos
  if (f.talentos.length > MAX_SLOTS_TALENTOS) erro(`Talentos: ${f.talentos.length} guardados, mas só há ${MAX_SLOTS_TALENTOS} espaços.`, 'fluxo');

  // Fluxo
  const fl = f.fluxo;
  const aura = TIPOS_AURA.find((t) => t.id === fl.auraTipo);
  if (fl.tipo === 'complexo' && f.nivel < NIVEL_MINIMO_FLUXO_COMPLEXO) erro(`Fluxo complexo só a partir do nível ${NIVEL_MINIMO_FLUXO_COMPLEXO}.`, 'fluxo');
  const apiceBasico = Object.values(fl.pontosApice || {}).reduce((a, b) => a + (b || 0), 0);
  if (fl.tipo !== 'complexo' && apiceBasico > 6) erro(`Pontos de ápice: ${apiceBasico}/6 no fluxo básico.`, 'fluxo');
  if (fl.tipo === 'complexo' && custoTotalComplexo(fl.apiceComplexo || {}) > 10) erro('Pontos de ápice do fluxo complexo passam de 10.', 'fluxo');
  if ((fl.jogadasBonus || []).length > 3) erro('Mais de 3 jogadas com vantagem no fluxo básico.', 'fluxo');
  if (aura && (fl.efeitosAuraSelecionados || []).length > aura.efeitos_permitidos) erro(`Efeitos de Aura: ${fl.efeitosAuraSelecionados.length} marcados, a Aura permite ${aura.efeitos_permitidos}.`, 'fluxo');
  const limMarcas = limiteMarcasDespertar(f.nivel, fl.auraTipo);
  if ((fl.marcasConhecidas || []).length > limMarcas) erro(`Marcas de despertar: ${fl.marcasConhecidas.length} conhecidas, o limite é ${limMarcas}.`, 'fluxo');
  if ((fl.marcasConhecidas || []).length > 0 && !aura) aviso('Você tem marcas de despertar, mas não escolheu o tipo de Aura.', 'fluxo');

  // Recursos em jogo
  const fMax = folegoMaximo(f);
  if ((f.folego ?? fMax) > fMax) erro(`Fôlego atual (${f.folego}) acima do máximo (${fMax}).`, 'mesa');
  if (f.pde >= LIMITE_PDE) aviso(`PdE em ${f.pde}: chegou ao limite de ${LIMITE_PDE} — role o d4 de exaustão e volte para 7.`, 'mesa');
  if (f.pds > pdsMaximo()) erro(`PdS acima do máximo de ${pdsMaximo()}.`, 'mesa');
  if (f.pde < 0 || f.pds < 0 || (f.folego ?? 0) < 0) erro('Algum recurso (PdE, PdS ou fôlego) está negativo.', 'mesa');

  return p.sort((a, b) => (a.nivel === b.nivel ? 0 : a.nivel === 'erro' ? -1 : 1));
}
