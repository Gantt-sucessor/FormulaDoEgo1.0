// Fórmula do Ego — Cliente Supabase
//
// PASSO A PASSO PRA CONFIGURAR (você faz isso 1x):
// 1. Crie uma conta em https://supabase.com e um novo projeto.
// 2. No painel do projeto: Settings > API. Copie a "Project URL" e a "anon public key".
// 3. Cole os dois valores abaixo.
// 4. No painel do projeto: SQL Editor > New query. Cole e rode o SQL do arquivo
//    supabase-schema.sql (na raiz do projeto) pra criar as tabelas.
// 5. No painel: Database > Replication, ative Realtime pra tabela "rolagens".

const SUPABASE_URL = 'https://cmcatwfpbxepxedxtnlo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_1WrVuDGBgCLHVuft1vpbig_CECKdORK';

// Carregado via <script type="module"> — importa o SDK direto do CDN, sem precisar de build.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** Gera um código de campanha de 6 caracteres (letras+números, fácil de digitar/ditar). */
export function gerarCodigoCampanha() {
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sem O/0/I/1 pra evitar confusão
  let codigo = '';
  for (let i = 0; i < 6; i++) {
    codigo += alfabeto[Math.floor(Math.random() * alfabeto.length)];
  }
  return codigo;
}
