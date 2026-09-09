import { supabase } from '../supabase-client.js';

/** Busca uma campanha pelo código digitado pelo player. */
export async function entrarNaCampanha(codigo) {
  const { data, error } = await supabase
    .from('campanhas')
    .select('*')
    .eq('codigo', codigo.toUpperCase().trim())
    .single();

  if (error || !data) throw new Error('Código não encontrado. Confere com o mestre se está certo.');
  return data;
}

/**
 * Lista as fichas de um jogador específico (pra ele poder ter várias e escolher).
 * Passe campanhaId = null pra listar as fichas "soltas" (sem campanha nenhuma).
 * O filtro principal é o jogador_id autenticado do Supabase, não o nome exibido.
 */
export async function listarFichasDoJogador(campanhaId, nomeJogador, jogadorId = null) {
  let query = supabase.from('fichas').select('*');

  if (jogadorId) {
    query = query.eq('jogador_id', jogadorId);
  } else {
    query = query.eq('nome_jogador', nomeJogador);
  }

  query = campanhaId ? query.eq('campanha_id', campanhaId) : query.is('campanha_id', null);

  const { data, error } = await query.order('criada_em', { ascending: false });
  if (error) throw error;
  return data;
}

/**
 * Lista TODAS as fichas de um jogador, em qualquer campanha (ou sem campanha),
 * já trazendo o nome/código da campanha de cada uma. Usada pra montar os atalhos
 * de "minhas fichas" e "minhas campanhas" (index e tela inicial do player).
 * O filtro principal é o jogador_id autenticado do Supabase, não o nome exibido.
 */
export async function listarTodasFichasDoJogador(nomeJogador, jogadorId = null) {
  let query = supabase
    .from('fichas')
    .select('*, campanhas(id, nome, codigo)');

  if (jogadorId) {
    query = query.eq('jogador_id', jogadorId);
  } else {
    query = query.eq('nome_jogador', nomeJogador);
  }

  const { data, error } = await query.order('criada_em', { ascending: false });

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
  campanhaId = null, jogadorId, nomeJogador, nomePersonagem,
  atributos = {}, pericias = {},
  armaId = null, oticaId = null,
  tendenciaPrincipalId = null, tendenciaSecundariaId = null,
  categoriaId = null, arquetipoId = null,
  nivel = 1, folegoAtual = 0, pdeAtual = 0, pontosChama = 0, pontosSorte = 0, talentos = [],
  efeitosAtivos = [], acoesGastas = { tatica: false, egoista: false, regulares: [false, false, false, false] },
  habilidadesCategoria = [], visoesDesbloqueadas = [], talentosNiveis = {}, recompensaNivel6 = null,
  recompensaNivel8 = null, posicao = null, pernaDominante = null,
}) {
  const { data, error } = await supabase
    .from('fichas')
    .insert({
      campanha_id: campanhaId,
      jogador_id: jogadorId,
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
      nivel,
      folego_atual: folegoAtual,
      pde_atual: pdeAtual,
      pontos_chama: pontosChama,
      pontos_sorte: pontosSorte,
      talentos,
      efeitos_ativos: efeitosAtivos,
      acoes_gastas: acoesGastas,
      habilidades_categoria: habilidadesCategoria,
      visoes_desbloqueadas: visoesDesbloqueadas,
      talentos_niveis: talentosNiveis,
      recompensa_nivel_6: recompensaNivel6,
      recompensa_nivel_8: recompensaNivel8,
      posicao,
      perna_dominante: pernaDominante,
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
  const { data, error } = await supabase.from('fichas').delete().eq('id', fichaId).select();
  if (error) throw error;
  // O Supabase não avisa quando o RLS bloqueia silenciosamente: se nada voltou, nada foi apagado de verdade.
  if (!data || data.length === 0) {
    throw new Error('Essa ficha não pôde ser apagada (sem permissão, ou ela é de antes do login — fala com o mestre).');
  }
}