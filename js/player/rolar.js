import { supabase } from '../supabase-client.js';
import { rolarJogada } from '../regras/dados.js';

/**
 * Rola uma jogada. Se houver campanhaId, salva no Supabase e o mestre vê em tempo real.
 * Sem campanha (ficha solta), só calcula o resultado localmente — não fica salvo em lugar nenhum.
 * atributoNome/periciaNome são só pra exibição (mostrar no histórico o que foi usado na jogada).
 */
export async function rolarEEnviar({ campanhaId = null, fichaId, nomePersonagem, nomeJogada, valorAtributo, valorPericia, vantagens = 0, desvantagens = 0, bonus = 0, atributoNome = null, periciaNome = null }) {
  const base = rolarJogada({ valorAtributo, valorPericia, vantagens, desvantagens, bonus });
  const resultado = { ...base, atributoNome, periciaNome };

  if (campanhaId) {
    const { error } = await supabase.from('rolagens').insert({
      campanha_id: campanhaId,
      ficha_id: fichaId,
      nome_personagem: nomePersonagem,
      jogada: nomeJogada,
      resultado: resultado.resultado,
      detalhe: resultado,
    });
    if (error) throw error;
  }

  return resultado;
}

/** Busca as últimas rolagens feitas por uma ficha específica (só funciona pra fichas com campanha). */
export async function buscarUltimasRolagens(fichaId, limite = 10) {
  const { data, error } = await supabase
    .from('rolagens')
    .select('*')
    .eq('ficha_id', fichaId)
    .order('criada_em', { ascending: false })
    .limit(limite);

  if (error) throw error;
  return data;
}