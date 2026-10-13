import { createClient } from '@supabase/supabase-js';

// A chave "anon/publishable" é pública por design (as regras de acesso ficam no RLS do banco).
// Dá pra sobrescrever por variáveis do Vercel: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.
const URL_PADRAO = 'https://cmcatwfpbxepxedxtnlo.supabase.co';
const CHAVE_PADRAO = 'sb_publishable_1WrVuDGBgCLHVuft1vpbig_CECKdORK';

export const supabase = createClient(
  import.meta.env?.VITE_SUPABASE_URL || URL_PADRAO,
  import.meta.env?.VITE_SUPABASE_ANON_KEY || CHAVE_PADRAO,
);

/** Código de campanha de 6 caracteres, sem O/0/I/1 para não confundir. */
export function gerarCodigoCampanha() {
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let codigo = '';
  for (let i = 0; i < 6; i += 1) codigo += alfabeto[Math.floor(Math.random() * alfabeto.length)];
  return codigo;
}
