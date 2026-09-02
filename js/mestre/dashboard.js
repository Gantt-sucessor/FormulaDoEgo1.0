import { supabase } from '../supabase-client.js';

/**
 * Escuta novas rolagens de uma campanha em tempo real via Supabase Realtime.
 * @param {string} campanhaId
 * @param {(rolagem: object) => void} onNovaRolagem - chamado a cada rolagem nova
 * @returns {() => void} função para cancelar a inscrição
 */
export function escutarRolagens(campanhaId, onNovaRolagem) {
  const canal = supabase
    .channel(`rolagens-campanha-${campanhaId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'rolagens', filter: `campanha_id=eq.${campanhaId}` },
      (payload) => onNovaRolagem(payload.new)
    )
    .subscribe();

  return () => supabase.removeChannel(canal);
}

/**
 * Escuta mudanças nas fichas de uma campanha em tempo real (painel de partida do player:
 * fôlego, PdE, condições, ações gastas). Chama onFichaAtualizada a cada UPDATE.
 * @returns {() => void} função para cancelar a inscrição
 */
export function escutarFichas(campanhaId, onFichaAtualizada) {
  const canal = supabase
    .channel(`fichas-campanha-${campanhaId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'fichas', filter: `campanha_id=eq.${campanhaId}` },
      (payload) => onFichaAtualizada(payload.new)
    )
    .subscribe();

  return () => supabase.removeChannel(canal);
}

/** Busca o histórico de rolagens já feitas nessa campanha (mais recentes primeiro). */
export async function buscarHistoricoRolagens(campanhaId, limite = 30) {
  const { data, error } = await supabase
    .from('rolagens')
    .select('*')
    .eq('campanha_id', campanhaId)
    .order('criada_em', { ascending: false })
    .limit(limite);

  if (error) throw error;
  return data;
}
