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
