// Fórmula do Ego — Memória local do navegador
// Guarda o nome do jogador e o último código de campanha usado, pra não precisar
// redigitar toda vez que a página recarrega. Fica só no navegador (localStorage),
// não é salvo no banco.

const CHAVE_NOME = 'formula_ego_nome_jogador';
const CHAVE_ULTIMO_CODIGO = 'formula_ego_ultimo_codigo';

export function getNomeSalvo() {
  return localStorage.getItem(CHAVE_NOME) || '';
}

export function setNomeSalvo(nome) {
  localStorage.setItem(CHAVE_NOME, nome);
}

export function getUltimoCodigoSalvo() {
  return localStorage.getItem(CHAVE_ULTIMO_CODIGO) || '';
}

export function setUltimoCodigoSalvo(codigo) {
  localStorage.setItem(CHAVE_ULTIMO_CODIGO, codigo);
}