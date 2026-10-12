import { supabase, gerarCodigoCampanha } from '../lib/supabase.js';

export async function criarCampanha(nome, criadorNome, criadorId = null) {
  const { data, error } = await supabase
    .from('campanhas')
    .insert({ nome, codigo: gerarCodigoCampanha(), criador_nome: criadorNome, criador_id: criadorId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listarCampanhasDoMestre(criadorNome) {
  const { data, error } = await supabase.from('campanhas').select('*').eq('criador_nome', criadorNome).order('criada_em', { ascending: false });
  if (error) throw error;
  return data;
}

/** Busca a campanha pelo código (a mesma busca que o jogador faz ao entrar). */
export async function entrarNaCampanha(codigo) {
  const { data, error } = await supabase.from('campanhas').select('*').eq('codigo', String(codigo).toUpperCase().trim()).single();
  if (error || !data) throw new Error('Código não encontrado. Confere com o mestre se está certo.');
  return data;
}

export async function buscarFichasDaCampanha(campanhaId) {
  const { data, error } = await supabase.from('fichas').select('*').eq('campanha_id', campanhaId).order('criada_em', { ascending: true });
  if (error) throw error;
  return data;
}

export async function apagarCampanha(campanhaId) {
  const { error } = await supabase.from('campanhas').delete().eq('id', campanhaId);
  if (error) throw error;
}

export function escutarRolagens(campanhaId, aoChegar) {
  const canal = supabase
    .channel(`rolagens-${campanhaId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rolagens', filter: `campanha_id=eq.${campanhaId}` }, (p) => aoChegar(p.new))
    .subscribe();
  return () => supabase.removeChannel(canal);
}

export function escutarFichas(campanhaId, aoMudar) {
  const canal = supabase
    .channel(`fichas-${campanhaId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'fichas', filter: `campanha_id=eq.${campanhaId}` }, (p) => aoMudar(p.new))
    .subscribe();
  return () => supabase.removeChannel(canal);
}

export async function buscarHistoricoRolagens(campanhaId, limite = 40) {
  const { data, error } = await supabase.from('rolagens').select('*').eq('campanha_id', campanhaId).order('criada_em', { ascending: false }).limit(limite);
  if (error) throw error;
  return data;
}
