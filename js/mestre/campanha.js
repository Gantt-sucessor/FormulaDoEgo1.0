import { supabase, gerarCodigoCampanha } from '../supabase-client.js';
import { usuarioAutenticado } from '../auth.js';

/** Cria uma nova campanha e retorna { id, codigo, nome, criador_nome }. */
export async function criarCampanha(nome, criadorNome) {
  const codigo = gerarCodigoCampanha();
  const usuario = await usuarioAutenticado();
  if (!usuario) throw new Error('Autenticação obrigatória.');
  const { data, error } = await supabase
    .from('campanhas')
    .insert({ nome, codigo, criador_nome: criadorNome, criador_id: usuario.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Lista todas as campanhas que esse mestre já criou (mais recentes primeiro). */
export async function listarCampanhasDoMestre(criadorNome) {
  const usuario = await usuarioAutenticado();
  if (!usuario) throw new Error('Autenticação obrigatória.');
  const { data, error } = await supabase
    .from('campanhas')
    .select('*')
    .eq('criador_id', usuario.id)
    .order('criada_em', { ascending: false });

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

/** Apaga uma campanha inteira (e, em cascata, suas fichas, rolagens e mapa). */
export async function apagarCampanha(campanhaId) {
  const { error } = await supabase.from('campanhas').delete().eq('id', campanhaId);
  if (error) throw error;
}