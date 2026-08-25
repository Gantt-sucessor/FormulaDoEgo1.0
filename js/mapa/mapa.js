import { supabase } from '../supabase-client.js';

/** Busca o mapa da campanha; cria um em branco na primeira vez que alguém abre. */
export async function buscarOuCriarMapa(campanhaId) {
  const { data: existente, error: erroBusca } = await supabase
    .from('mapas').select('*').eq('campanha_id', campanhaId).maybeSingle();
  if (erroBusca) throw erroBusca;
  if (existente) return existente;

  const { data: novo, error: erroCria } = await supabase
    .from('mapas').insert({ campanha_id: campanhaId }).select().single();
  if (erroCria) throw erroCria;
  return novo;
}

/** Atualiza configurações do mapa (imagem de fundo, tamanho do grid). */
export async function atualizarMapa(mapaId, campos) {
  const { data, error } = await supabase.from('mapas').update(campos).eq('id', mapaId).select().single();
  if (error) throw error;
  return data;
}

export async function listarTokens(mapaId) {
  const { data, error } = await supabase.from('tokens').select('*').eq('mapa_id', mapaId);
  if (error) throw error;
  return data;
}

export async function criarToken(mapaId, nome, cor, x, y) {
  const { data, error } = await supabase
    .from('tokens').insert({ mapa_id: mapaId, nome, cor, pos_x: x, pos_y: y }).select().single();
  if (error) throw error;
  return data;
}

export async function moverToken(tokenId, x, y) {
  const { error } = await supabase
    .from('tokens').update({ pos_x: x, pos_y: y, atualizado_em: new Date().toISOString() }).eq('id', tokenId);
  if (error) throw error;
}

export async function apagarToken(tokenId) {
  const { error } = await supabase.from('tokens').delete().eq('id', tokenId);
  if (error) throw error;
}

export async function listarMarcadores(mapaId) {
  const { data, error } = await supabase.from('marcadores').select('*').eq('mapa_id', mapaId);
  if (error) throw error;
  return data;
}

export async function criarMarcador(mapaId, marcador) {
  const { data, error } = await supabase
    .from('marcadores').insert({ mapa_id: mapaId, ...marcador }).select().single();
  if (error) throw error;
  return data;
}

export async function apagarMarcador(marcadorId) {
  const { error } = await supabase.from('marcadores').delete().eq('id', marcadorId);
  if (error) throw error;
}

/**
 * Escuta mudanças em tempo real nos tokens e marcadores de um mapa.
 * callbacks.onToken(payload) e callbacks.onMarcador(payload) recebem o evento cru do Supabase
 * (payload.eventType é 'INSERT' | 'UPDATE' | 'DELETE', payload.new / payload.old têm os dados).
 */
export function escutarMapa(mapaId, callbacks) {
  const canal = supabase
    .channel(`mapa-${mapaId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tokens', filter: `mapa_id=eq.${mapaId}` }, (payload) => callbacks.onToken?.(payload))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'marcadores', filter: `mapa_id=eq.${mapaId}` }, (payload) => callbacks.onMarcador?.(payload))
    .subscribe();

  return () => supabase.removeChannel(canal);
}