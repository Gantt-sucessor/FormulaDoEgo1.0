const CHAVE_NOME = 'formula_ego_nome_jogador';
const CHAVE_CODIGO = 'formula_ego_ultimo_codigo';
const CHAVE_ABA = 'fde-ficha-aba';

function ler(chave, padrao = '') {
  try { return localStorage.getItem(chave) ?? padrao; } catch { return padrao; }
}
function gravar(chave, valor) {
  try { localStorage.setItem(chave, valor); } catch { /* sem armazenamento local: só não lembra */ }
}

export const getNomeSalvo = () => ler(CHAVE_NOME);
export const setNomeSalvo = (v) => gravar(CHAVE_NOME, v);
export const getUltimoCodigoSalvo = () => ler(CHAVE_CODIGO);
export const setUltimoCodigoSalvo = (v) => gravar(CHAVE_CODIGO, v);
export const getAbaSalva = () => {
  const aba = ler(CHAVE_ABA, 'mesa');
  return ['mesa', 'personagem', 'fluxo'].includes(aba) ? aba : 'mesa';
};
export const setAbaSalva = (v) => gravar(CHAVE_ABA, v);

const CHAVE_MESA = 'fde-mesa-secoes';
/** Seções da mesa que o jogador escolheu ver (null = nunca escolheu). */
export const getSecoesMesa = () => {
  try { const v = JSON.parse(ler(CHAVE_MESA, 'null')); return Array.isArray(v) ? v : null; } catch { return null; }
};
export const setSecoesMesa = (lista) => gravar(CHAVE_MESA, JSON.stringify(lista));

/** Lembra, por lista, se os textos das habilidades ficam abertos (padrão: recolhidos, para não lotar a tela). */
export const getTextosAbertos = (lista) => ler(`fde-textos-${lista}`, '0') === '1';
export const setTextosAbertos = (lista, v) => gravar(`fde-textos-${lista}`, v ? '1' : '0');

/** Atributos do goleiro bot, por campanha. */
export const getBotGoleiro = (campanhaId) => {
  try { const v = JSON.parse(ler(`fde-bot-${campanhaId}`, 'null')); return v && typeof v === 'object' ? v : {}; } catch { return {}; }
};
export const setBotGoleiro = (campanhaId, bot) => gravar(`fde-bot-${campanhaId}`, JSON.stringify(bot));
