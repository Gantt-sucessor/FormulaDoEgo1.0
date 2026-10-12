-- Fórmula do Ego 2.0 — migração ADITIVA (só adiciona; nunca apaga nem altera dados existentes).
-- Pode rodar quantas vezes quiser no SQL Editor do Supabase: tudo é "if not exists".

-- 0) Backup de segurança das fichas (copia a tabela inteira). Rode ANTES do deploy.
create table if not exists fichas_backup_20261012 as table fichas;

-- 1) Colunas que o app usa. Em bancos que já têm todas elas, nada acontece.
alter table fichas add column if not exists nivel int not null default 1;
alter table fichas add column if not exists folego_atual int;
alter table fichas add column if not exists pde_atual int not null default 0;
alter table fichas add column if not exists pontos_chama int not null default 0;
alter table fichas add column if not exists pontos_sorte int not null default 0;
alter table fichas add column if not exists talentos jsonb not null default '[]';
alter table fichas add column if not exists talentos_niveis jsonb not null default '{}';
alter table fichas add column if not exists habilidades_categoria jsonb not null default '[]';
alter table fichas add column if not exists visoes_desbloqueadas jsonb not null default '[]';
alter table fichas add column if not exists recompensa_nivel_6 text;
alter table fichas add column if not exists recompensa_nivel_8 text;
alter table fichas add column if not exists posicao text;
alter table fichas add column if not exists perna_dominante text;
alter table fichas add column if not exists tendencia_pericia_escolhida text;
alter table fichas add column if not exists efeitos_ativos jsonb not null default '[]';
alter table fichas add column if not exists acoes_gastas jsonb not null default '{}';
alter table fichas add column if not exists fluxo jsonb not null default '{}';
alter table fichas add column if not exists catalisador jsonb not null default '{}';

-- 2) Tempo real para o painel do mestre (ignora se já estiver ligado).
do $$ begin
  begin alter publication supabase_realtime add table rolagens; exception when others then null; end;
  begin alter publication supabase_realtime add table fichas; exception when others then null; end;
end $$;
