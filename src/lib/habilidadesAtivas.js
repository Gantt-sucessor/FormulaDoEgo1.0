import { ARMAS } from '../data/armas.js';
import { OTICAS } from '../data/oticas.js';
import { CATALISADORES } from '../data/catalisadores.js';
import { HABILIDADES_DE_CATEGORIA } from '../data/categorias.js';
import { TALENTOS_EVOLUTIVOS, TALENTOS_SIMPLES, TALENTOS_RAZOAVEIS, TALENTOS_COMPLEXOS } from '../data/talentos.js';
import { chaveHabilidade } from '../regras/habilidades.js';
import { NIVEL_MINIMO_HABILIDADE_CATALISADOR } from '../data/fluxo.js';

export const TODOS_TALENTOS = [...TALENTOS_EVOLUTIVOS, ...TALENTOS_SIMPLES, ...TALENTOS_RAZOAVEIS, ...TALENTOS_COMPLEXOS];

const completar = (h) => ({ esf: '', dis: '', dur: '', tda: '', ...h });

export const ORIGENS = [
  { id: 'arma', rotulo: 'Arma' },
  { id: 'otica', rotulo: 'Ótica' },
  { id: 'catalisador', rotulo: 'Catalisador' },
  { id: 'categoria', rotulo: 'Categoria' },
  { id: 'talento', rotulo: 'Talentos' },
];

/**
 * Tudo que o personagem pode USAR ativamente na mesa, já com a chave que o motor
 * usa para controlar "uma vez em fluxo". Ordem: arma → ótica → catalisador → categoria → talentos.
 */
export function listarHabilidadesAtivas(f) {
  const lista = [];
  const empurrar = (origem, rotuloOrigem, h) => lista.push({ chave: chaveHabilidade(origem, h), origem, rotuloOrigem, h: completar(h) });

  const arma = ARMAS.find((a) => a.id === f.armaId);
  if (arma) arma.habilidades.forEach((h) => empurrar('arma', arma.nome, h));

  const otica = OTICAS.find((o) => o.id === f.oticaId);
  if (otica?.habilidade_nv3 && f.visoes.includes(3)) empurrar('otica', otica.nome, { ...otica.habilidade_nv3, tipo: 'variante' });

  const cat = CATALISADORES.find((c) => c.id === f.catalisador?.id);
  if (cat && f.nivel >= NIVEL_MINIMO_HABILIDADE_CATALISADOR) empurrar('catalisador', cat.nome, cat.habilidade);

  HABILIDADES_DE_CATEGORIA
    .filter((h) => f.habilidadesCategoria.includes(h.nome))
    .forEach((h) => empurrar('categoria', 'Categoria', h));

  f.talentos.forEach((id) => {
    const t = TODOS_TALENTOS.find((x) => x.id === id);
    if (!t) return;
    const nivel = f.talentosNiveis?.[id] || 1;
    const texto = t.niveis ? t.niveis.map((n, i) => `${i + 1 === nivel ? '▶ ' : ''}Nível ${i + 1}: ${n}`).join('\n') : t.texto;
    empurrar('talento', 'Talento', { ...t, texto, tipo: undefined });
  });

  return lista;
}
