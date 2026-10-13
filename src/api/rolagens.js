import { supabase } from '../lib/supabase.js';
import { rolarJogada } from '../regras/dados.js';

/** Rola a jogada; com campanha, também publica para a sala em tempo real. */
export async function rolarEEnviar({ campanhaId = null, fichaId, nomePersonagem, nomeJogada, valorAtributo, valorPericia, vantagens = 0, desvantagens = 0, bonus = 0, atributoNome = null, periciaNome = null }) {
  const base = rolarJogada({ valorAtributo, valorPericia, vantagens, desvantagens, bonus });
  const resultado = { ...base, atributoNome, periciaNome };
  if (campanhaId) {
    const { error } = await supabase.from('rolagens').insert({
      campanha_id: campanhaId, ficha_id: fichaId, nome_personagem: nomePersonagem,
      jogada: nomeJogada, resultado: resultado.resultado, detalhe: resultado,
    });
    if (error) throw error;
  }
  return resultado;
}

export async function buscarUltimasRolagens(fichaId, limite = 15) {
  const { data, error } = await supabase.from('rolagens').select('*').eq('ficha_id', fichaId).order('criada_em', { ascending: false }).limit(limite);
  if (error) throw error;
  return data;
}

/** Ação que não é rolagem (usar habilidade, passar rodada…) — aparece na sala igual a uma rolagem sem número. */
export async function registrarAcao({ campanhaId, fichaId, nomePersonagem, nomeAcao, texto = '' }) {
  if (!campanhaId) return;
  const { error } = await supabase.from('rolagens').insert({
    campanha_id: campanhaId, ficha_id: fichaId, nome_personagem: nomePersonagem,
    jogada: nomeAcao, resultado: 0, detalhe: { tipo: 'acao', texto },
  });
  if (error) throw error;
}
