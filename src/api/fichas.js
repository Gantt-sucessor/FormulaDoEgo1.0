import { supabase } from '../lib/supabase.js';

const SELECAO_COM_CAMPANHA = '*, campanhas(id, nome, codigo)';

export async function listarTodasFichasDoJogador(jogadorId) {
  const { data, error } = await supabase.from('fichas').select(SELECAO_COM_CAMPANHA).eq('jogador_id', jogadorId).order('criada_em', { ascending: false });
  if (error) throw error;
  return data;
}

export async function buscarFicha(id) {
  const { data, error } = await supabase.from('fichas').select(SELECAO_COM_CAMPANHA).eq('id', id).single();
  if (error) throw error;
  return data;
}

/** Ficha pública (somente leitura): sem embutir campanha. */
export async function buscarFichaPublica(id) {
  const { data, error } = await supabase.from('fichas').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function criarFicha(campos) {
  const { data, error } = await supabase.from('fichas').insert(campos).select(SELECAO_COM_CAMPANHA).single();
  if (error) throw error;
  return data;
}

export async function atualizarFicha(id, campos) {
  const { data, error } = await supabase.from('fichas').update(campos).eq('id', id).select(SELECAO_COM_CAMPANHA).single();
  if (error) throw error;
  return data;
}

export async function vincularFichaACampanha(fichaId, campanhaId) {
  return atualizarFicha(fichaId, { campanha_id: campanhaId });
}

export async function apagarFicha(id) {
  const { data, error } = await supabase.from('fichas').delete().eq('id', id).select();
  if (error) throw error;
  if (!data || data.length === 0) throw new Error('Essa ficha não pôde ser apagada (sem permissão).');
}
