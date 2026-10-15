import { CATEGORIAS } from '../data/categorias.js';
import { TENDENCIAS } from '../data/tendencias.js';
import { OTICAS } from '../data/oticas.js';
import { CATALISADORES } from '../data/catalisadores.js';
import { PERICIAS } from '../data/pericias.js';
import { ATRIBUTOS } from '../data/atributos.js';
import { calcularFolegos, calcularDdC, calcularDdP, MAX_PDS_PADRAO } from '../regras/calculos.js';
import { acoesVazias, normalizarAcoes, modificadorFolegoMaximo } from '../regras/habilidades.js';
import { modDistancia } from '../regras/modificadores.js';

export const NIVEL_MAXIMO = 8;

export function fluxoVazio() {
  return { tipo: 'basico', auraTipo: '', pontosApice: {}, apiceComplexo: {}, jogadasBonus: [], efeitosAuraSelecionados: [], marcasConhecidas: [], marcasUsos: {}, ativo: false };
}

export function fichaVazia() {
  return {
    nome: '', atributos: {}, pericias: {},
    armaId: '', oticaId: '', tendPrincipal: '', tendSecundaria: '', categoriaId: '', arquetipoId: '',
    nivel: 1, folego: null, pde: 0, chama: 0, pds: 0,
    talentos: [], talentosNiveis: {}, habilidadesCategoria: [], visoes: [],
    recompensa6: '', recompensa8: '', posicao: '', perna: '', tendPericia: '',
    efeitos: [], acoes: acoesVazias(), comBola: true, usadasFluxo: [], turno: 0, rodada: 1,
    fluxo: fluxoVazio(), catalisador: { id: '', potencial: 0 },
    periciaChute: 'precisao', periciaPasse: 'visao_de_jogo',
  };
}

/** Linha do banco → estado do editor. */
export function fichaDoBanco(r) {
  const base = fichaVazia();
  const extras = r.acoes_gastas || {};
  const cat = r.catalisador || {};
  const folegoMax = folegoMaximo({ ...base, pericias: r.pericias || {}, recompensa6: r.recompensa_nivel_6 || '', efeitos: r.efeitos_ativos || [] });
  return {
    ...base,
    nome: r.nome_personagem || '',
    atributos: r.atributos || {},
    pericias: r.pericias || {},
    armaId: r.arma_id || '',
    oticaId: r.otica_id || '',
    tendPrincipal: r.tendencia_principal_id || '',
    tendSecundaria: r.tendencia_secundaria_id || '',
    categoriaId: r.categoria_id || '',
    arquetipoId: r.arquetipo_id || '',
    nivel: r.nivel ?? 1,
    folego: r.folego_atual ?? folegoMax,
    pde: r.pde_atual ?? 0,
    chama: r.pontos_chama ?? 0,
    pds: r.pontos_sorte ?? 0,
    talentos: r.talentos || [],
    talentosNiveis: r.talentos_niveis || {},
    habilidadesCategoria: r.habilidades_categoria || [],
    visoes: r.visoes_desbloqueadas || [],
    recompensa6: r.recompensa_nivel_6 || '',
    recompensa8: r.recompensa_nivel_8 || '',
    posicao: r.posicao || '',
    perna: r.perna_dominante || '',
    tendPericia: r.tendencia_pericia_escolhida || '',
    efeitos: (r.efeitos_ativos || []).map((e) => ({ ...e })),
    acoes: normalizarAcoes(extras),
    comBola: extras.comBola ?? true,
    usadasFluxo: extras.usadasFluxo || [],
    turno: extras.turno || 0,
    rodada: extras.rodada || 1,
    fluxo: { ...fluxoVazio(), ...(r.fluxo || {}) },
    catalisador: { id: cat.id || '', potencial: cat.potencial || 0 },
    periciaChute: cat.periciaChute || 'precisao',
    periciaPasse: cat.periciaPasse || 'visao_de_jogo',
  };
}

/** Estado do editor → colunas do banco. */
export function camposParaBanco(f) {
  return {
    nome_personagem: f.nome.trim(),
    atributos: f.atributos,
    pericias: f.pericias,
    arma_id: f.armaId || null,
    otica_id: f.oticaId || null,
    tendencia_principal_id: f.tendPrincipal || null,
    tendencia_secundaria_id: f.tendSecundaria || null,
    categoria_id: f.categoriaId || null,
    arquetipo_id: f.arquetipoId || null,
    nivel: f.nivel,
    folego_atual: f.folego ?? folegoMaximo(f),
    pde_atual: f.pde,
    pontos_chama: f.chama,
    pontos_sorte: f.pds,
    talentos: f.talentos,
    talentos_niveis: f.talentosNiveis,
    habilidades_categoria: f.habilidadesCategoria,
    visoes_desbloqueadas: f.visoes,
    recompensa_nivel_6: f.recompensa6 || null,
    recompensa_nivel_8: f.recompensa8 || null,
    posicao: f.posicao || null,
    perna_dominante: f.perna || null,
    tendencia_pericia_escolhida: f.tendPericia || null,
    efeitos_ativos: f.efeitos,
    acoes_gastas: { ...f.acoes, comBola: f.comBola, usadasFluxo: f.usadasFluxo, turno: f.turno, rodada: f.rodada },
    fluxo: f.fluxo,
    catalisador: { ...f.catalisador, periciaChute: f.periciaChute, periciaPasse: f.periciaPasse },
  };
}

// ---------------------------------------------------------------------------
// Derivados
// ---------------------------------------------------------------------------

export const folegoMaximo = (f) =>
  Math.max(0, calcularFolegos(f.pericias?.constancia || 0) + (f.recompensa6 === 'folego' ? 1 : 0) + modificadorFolegoMaximo(f.efeitos));

export const distanciaChute = (f) => calcularDdC(f.pericias?.[f.periciaChute] || 0, (f.recompensa6 === 'distancia_chute' ? 1 : 0) + modDistancia(f.efeitos, 'chute'));
export const distanciaPasse = (f) => calcularDdP(f.pericias?.[f.periciaPasse] || 0, (f.recompensa6 === 'distancia_passe' ? 1 : 0) + modDistancia(f.efeitos, 'passe'));
export const iniciativa = (f) => (f.pericias?.momento || 0) + (f.atributos?.destreza || 0);
export const pdsMaximo = () => MAX_PDS_PADRAO;

/** Nível de categoria (1-5): sobe nos níveis de personagem 4, 5, 6 e 8. */
export function nivelCategoria(nivel) {
  let n = 1;
  [4, 5, 6, 8].forEach((x) => { if (nivel >= x) n += 1; });
  return Math.min(5, n);
}

export const categoriaDe = (f) => CATEGORIAS.find((c) => c.id === f.categoriaId) || null;
export const oticaDe = (f) => OTICAS.find((o) => o.id === f.oticaId) || null;
export const tendenciaPrincipalDe = (f) => TENDENCIAS.find((t) => t.id === f.tendPrincipal) || null;
export const tendenciaSecundariaDe = (f) => TENDENCIAS.find((t) => t.id === f.tendSecundaria) || null;

export function limiteHabilidadesCategoria(f) {
  const cat = categoriaDe(f);
  if (!cat) return 0;
  const nc = nivelCategoria(f.nivel);
  let total = 0;
  cat.evolucao.forEach((e) => {
    if (nc < e.nivel) return;
    (e.ganhos.match(/\+\s*(\d+)\s*habilidades?\s+de\s+categoria/gi) || []).forEach((m) => {
      total += Number(m.match(/\+\s*(\d+)/)[1]);
    });
  });
  return total;
}

export function pontosPericiaMaximos(f) {
  let total = 10;
  [2, 3, 6, 7].forEach((n) => { if (f.nivel >= n) total += 1; });
  const cat = categoriaDe(f);
  if (cat) {
    const nc = nivelCategoria(f.nivel);
    cat.evolucao.forEach((e) => {
      if (nc >= e.nivel) {
        const m = e.ganhos.match(/\+\s*(\d+)\s*pontos?\s+de\s+perícia/i);
        if (m) total += Number(m[1]);
      }
    });
  }
  if (tendenciaPrincipalDe(f) && f.tendPericia) total += 2;
  return total;
}

export const pontosPericiaUsados = (f) => Object.values(f.pericias || {}).reduce((a, b) => a + (b || 0), 0);

export function catalisadoresDaOtica(f) {
  const otica = oticaDe(f);
  if (!otica) return [];
  const texto = otica.catalisadores.toLowerCase();
  if (texto.includes('qualquer um')) return CATALISADORES;
  return CATALISADORES.filter((c) => texto.includes(c.nome.toLowerCase()));
}

export function valorPericiaDaJogada(f, jogada) {
  if (jogada.pericias_compostas) {
    const soma = jogada.pericias_compostas.reduce((acc, id) => acc + (f.pericias?.[id] || 0), 0);
    return Math.floor(soma / jogada.divisor);
  }
  const def = PERICIAS.find((p) => p.id === jogada.pericia);
  return def ? (f.pericias?.[def.id] || 0) : 0;
}

export const nomeAtributo = (id) => ATRIBUTOS.find((a) => a.id === id)?.nome || id;
export const nomePericia = (id) => PERICIAS.find((p) => p.id === id)?.nome || id;
export const sinal = (v) => (v > 0 ? `+${v}` : `${v}`);

/** Estado no formato que o motor de habilidades espera. */
export function estadoDoMotor(f) {
  return {
    pde: f.pde, folego: f.folego ?? folegoMaximo(f), folegoMax: folegoMaximo(f),
    pds: f.pds, pdsMax: MAX_PDS_PADRAO, nivel: f.nivel, comBola: f.comBola,
    fluxoAtivo: !!f.fluxo?.ativo, acoes: f.acoes, efeitos: f.efeitos,
    usadasFluxo: f.usadasFluxo, turno: f.turno, rodada: f.rodada,
  };
}

/** Aplica de volta o que o motor devolveu. */
export function aplicarEstadoDoMotor(f, e) {
  return {
    ...f, pde: e.pde, folego: e.folego, pds: e.pds, acoes: e.acoes, efeitos: e.efeitos,
    usadasFluxo: e.usadasFluxo || [], turno: e.turno ?? f.turno, rodada: e.rodada ?? f.rodada,
  };
}
