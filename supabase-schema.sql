-- Fórmula do Ego — Schema do Supabase
-- Rode isso inteiro no SQL Editor do seu projeto Supabase (uma vez só).

create table if not exists campanhas (
  id uuid primary key default gen_random_uuid(),
  codigo text unique not null,
  nome text not null,
  criada_em timestamptz default now()
);

create table if not exists fichas (
  id uuid primary key default gen_random_uuid(),
  campanha_id uuid references campanhas(id) on delete cascade,
  nome_jogador text not null,
  nome_personagem text not null,
  atributos jsonb not null default '{}',   -- { potencia: 2, drible: 1, ... }
  pericias jsonb not null default '{}',    -- { precisao: 3, agilidade: 2, ... }
  arma_id text,
  otica_id text,
  tendencia_principal_id text,
  tendencia_secundaria_id text,
  categoria_id text,
  arquetipo_id text,
  criada_em timestamptz default now()
);

create table if not exists rolagens (
  id uuid primary key default gen_random_uuid(),
  campanha_id uuid references campanhas(id) on delete cascade,
  ficha_id uuid references fichas(id) on delete cascade,
  nome_personagem text not null,
  jogada text not null,          -- ex: "Chute curvo", "Roubo"
  resultado int not null,
  detalhe jsonb,                 -- rolagens individuais, execução absoluta, etc
  criada_em timestamptz default now()
);

-- Segurança básica: qualquer um com a anon key pode ler/escrever
-- (ok pro escopo do projeto agora — para uso público real, isso precisa de regras mais finas).
alter table campanhas enable row level security;
alter table fichas enable row level security;
alter table rolagens enable row level security;

create policy "acesso publico campanhas" on campanhas for all using (true) with check (true);
create policy "acesso publico fichas" on fichas for all using (true) with check (true);
create policy "acesso publico rolagens" on rolagens for all using (true) with check (true);
