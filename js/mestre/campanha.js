import { supabase, gerarCodigoCampanha } from '../supabase-client.js';

/** Cria uma nova campanha e retorna { id, codigo, nome }. */
export async function criarCampanha(nome) {
  const codigo = gerarCodigoCampanha();
  const { data, error } = await supabase
    .from('campanhas')
    .insert({ nome, codigo })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Busca fichas de uma campanha. */
export async function buscarFichas(campanhaId) {
  const { data, error } = await supabase
    .from('fichas')
    .select('*')
    .eq('campanha_id', campanhaId)
    .order('criada_em', { ascending: true });

  if (error) throw error;
  return data;
}
