import { supabase } from '../supabase-client.js';
import { usuarioAutenticado } from '../auth.js';

/** Busca uma campanha pelo código digitado pelo player. */
export async function entrarNaCampanha(codigo) {
  const { data, error } = await supabase
    .rpc('entrar_campanha_por_codigo', { p_codigo: codigo });

  if (error || !data?.[0]) throw new Error('Código não encontrado. Confere com o mestre se está certo.');
  return data[0];
}

/**
 * Lista as fichas de um jogador específico (pra ele poder ter várias e escolher).
 * Passe campanhaId = null pra listar as fichas "soltas" (sem campanha nenhuma).
 */
export async function listarFichasDoJogador(campanhaId, nomeJogador) {
  const usuario = await usuarioAutenticado();
  if (!usuario) throw new Error('Autenticação obrigatória.');
  let query = supabase.from('fichas').select('*').eq('jogador_id', usuario.id);
  query = campanhaId ? query.eq('campanha_id', campanhaId) : query.is('campanha_id', null);

  const { data, error } = await query.order('criada_em', { ascending: false });
  if (error) throw error;
  return data;
}

/**
 * Lista TODAS as fichas de um jogador, em qualquer campanha (ou sem campanha),
 * já trazendo o nome/código da campanha de cada uma. Usada pra montar os atalhos
 * de "minhas fichas" e "minhas campanhas" (index e tela inicial do player).
 */
export async function listarTodasFichasDoJogador(nomeJogador) {
  const usuario = await usuarioAutenticado();
  if (!usuario) throw new Error('Autenticação obrigatória.');
  const { data, error } = await supabase
    .from('fichas')
    .select('*, campanhas(id, nome, codigo)')
    .eq('jogador_id', usuario.id)
    .order('criada_em', { ascending: false });

  if (error) throw error;
  return data;
}

/** Busca uma ficha específica pelo id (pra recarregar ao entrar de novo), com a campanha embutida. */
export async function buscarFicha(fichaId) {
  const { data, error } = await supabase
    .from('fichas')
    .select('*, campanhas(id, nome, codigo)')
    .eq('id', fichaId)
    .single();
  if (error) throw error;
  return data;
}

/**
 * Cria uma ficha nova. campanhaId pode ser null (ficha "solta", sem campanha) —
 * o resto (atributos, perícias, arma, ótica, tendências, categoria) pode ser
 * preenchido aos poucos, na ordem que o jogador quiser.
 */
export async function criarFicha({
  campanhaId = null, nomeJogador, nomePersonagem,
  atributos = {}, pericias = {},
  armaId = null, oticaId = null,
  tendenciaPrincipalId = null, tendenciaSecundariaId = null,
  categoriaId = null, arquetipoId = null,
}) {
  const usuario = await usuarioAutenticado();
  if (!usuario) throw new Error('Autenticação obrigatória.');
  const { data, error } = await supabase
    .from('fichas')
    .insert({
      campanha_id: campanhaId,
      jogador_id: usuario.id,
      nome_jogador: nomeJogador,
      nome_personagem: nomePersonagem,
      atributos,
      pericias,
      arma_id: armaId,
      otica_id: oticaId,
      tendencia_principal_id: tendenciaPrincipalId,
      tendencia_secundaria_id: tendenciaSecundariaId,
      categoria_id: categoriaId,
      arquetipo_id: arquetipoId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Atualiza qualquer conjunto de campos de uma ficha existente (edição livre, a qualquer momento). */
export async function atualizarFicha(fichaId, campos) {
  const { data, error } = await supabase
    .from('fichas')
    .update(campos)
    .eq('id', fichaId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Vincula uma ficha solta (sem campanha) a uma campanha existente. */
export async function vincularFichaACampanha(fichaId, campanhaId) {
  const { data, error } = await supabase
    .from('fichas')
    .update({ campanha_id: campanhaId })
    .eq('id', fichaId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Apaga uma ficha (o jogador decidiu recomeçar aquele personagem). */
export async function apagarFicha(fichaId) {
  const { error } = await supabase.from('fichas').delete().eq('id', fichaId);
  if (error) throw error;
}