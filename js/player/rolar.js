import { supabase } from '../supabase-client.js';
import { rolarJogada } from '../regras/dados.js';

/**
 * Rola uma jogada e salva o resultado no Supabase — o mestre vê aparecer em tempo real.
 */
export async function rolarEEnviar({ campanhaId, fichaId, nomePersonagem, nomeJogada, valorAtributo, valorPericia, vantagens = 0, desvantagens = 0, bonus = 0 }) {
  const resultado = rolarJogada({ valorAtributo, valorPericia, vantagens, desvantagens, bonus });

  const { error } = await supabase.from('rolagens').insert({
    campanha_id: campanhaId,
    ficha_id: fichaId,
    nome_personagem: nomePersonagem,
    jogada: nomeJogada,
    resultado: resultado.resultado,
    detalhe: resultado,
  });

  if (error) throw error;
  return resultado;
}
