-- Fórmula do Ego — Schema do Supabase
-- Rode isso inteiro no SQL Editor do seu projeto Supabase (uma vez só).

create table if not exists campanhas (
  id uuid primary key default gen_random_uuid(),
  codigo text unique not null,
  nome text not null,
  criador_nome text not null,
  criador_id uuid references auth.users(id) on delete set null,
  criada_em timestamptz default now()
);

alter table campanhas add column if not exists criador_nome text;
alter table campanhas add column if not exists criador_id uuid references auth.users(id) on delete set null;
update campanhas set criador_nome = 'legado' where criador_nome is null;
alter table campanhas alter column criador_nome set not null;

create table if not exists fichas (
  id uuid primary key default gen_random_uuid(),
  campanha_id uuid references campanhas(id) on delete cascade,
  jogador_id uuid references auth.users(id) on delete cascade,
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

alter table fichas add column if not exists jogador_id uuid references auth.users(id) on delete cascade;

create table if not exists participantes_campanha (
  campanha_id uuid not null references campanhas(id) on delete cascade,
  usuario_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  entrou_em timestamptz default now(),
  primary key (campanha_id, usuario_id)
);

create table if not exists mapas (
  id uuid primary key default gen_random_uuid(),
  campanha_id uuid unique not null references campanhas(id) on delete cascade,
  largura_celulas int not null default 30 check (largura_celulas between 5 and 100),
  altura_celulas int not null default 20 check (altura_celulas between 5 and 100),
  tamanho_celula_px int not null default 40 check (tamanho_celula_px between 20 and 120),
  imagem_url text,
  criada_em timestamptz default now(),
  atualizada_em timestamptz default now()
);

create table if not exists tokens (
  id uuid primary key default gen_random_uuid(),
  mapa_id uuid not null references mapas(id) on delete cascade,
  criado_por_id uuid references auth.users(id) on delete set null,
  nome text not null check (char_length(nome) between 1 and 80),
  cor text not null default '#4aa8ff',
  pos_x numeric not null default 1 check (pos_x >= 0),
  pos_y numeric not null default 1 check (pos_y >= 0),
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

create table if not exists marcadores (
  id uuid primary key default gen_random_uuid(),
  mapa_id uuid not null references mapas(id) on delete cascade,
  criado_por_id uuid references auth.users(id) on delete set null,
  tipo text not null check (tipo in ('area_circulo', 'area_quadrado', 'nota')),
  x numeric not null check (x >= 0),
  y numeric not null check (y >= 0),
  tamanho numeric check (tamanho is null or tamanho > 0),
  cor text,
  texto text check (texto is null or char_length(texto) <= 500),
  criado_por text,
  criada_em timestamptz default now()
);

create index if not exists fichas_campanha_id_idx on fichas(campanha_id);
create index if not exists fichas_nome_jogador_idx on fichas(nome_jogador);
create index if not exists campanhas_criador_id_idx on campanhas(criador_id);
create index if not exists fichas_jogador_id_idx on fichas(jogador_id);
create index if not exists participantes_usuario_id_idx on participantes_campanha(usuario_id);
create index if not exists tokens_mapa_id_idx on tokens(mapa_id);
create index if not exists marcadores_mapa_id_idx on marcadores(mapa_id);

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

create index if not exists rolagens_campanha_criada_idx on rolagens(campanha_id, criada_em desc);

-- Todas as operações abaixo dependem de auth.uid(); a anon key nunca deve ser usada
-- para conceder privilégios administrativos ou acesso a senhas.
alter table campanhas enable row level security;
alter table fichas enable row level security;
alter table rolagens enable row level security;
alter table mapas enable row level security;
alter table tokens enable row level security;
alter table marcadores enable row level security;

alter table participantes_campanha enable row level security;

drop policy if exists "acesso publico campanhas" on campanhas;
drop policy if exists "acesso publico fichas" on fichas;
drop policy if exists "acesso publico rolagens" on rolagens;
drop policy if exists "acesso publico mapas" on mapas;
drop policy if exists "acesso publico tokens" on tokens;
drop policy if exists "acesso publico marcadores" on marcadores;
drop policy if exists "jogadores criam rolagens" on rolagens;
drop policy if exists "participantes podem ver participacoes" on participantes_campanha;
drop policy if exists "usuarios podem entrar em campanhas" on participantes_campanha;

create policy "donos administram campanhas" on campanhas for all
  using (criador_id = auth.uid())
  with check (criador_id = auth.uid());
create policy "jogadores acessam suas fichas" on fichas for all
  using (
    jogador_id = auth.uid()
    or exists (select 1 from campanhas c where c.id = fichas.campanha_id and c.criador_id = auth.uid())
  )
  with check (jogador_id = auth.uid());
create policy "participantes leem rolagens" on rolagens for select
  using (
    exists (select 1 from fichas f where f.id = rolagens.ficha_id and f.jogador_id = auth.uid())
    or exists (select 1 from campanhas c where c.id = rolagens.campanha_id and c.criador_id = auth.uid())
  );
create policy "jogadores criam rolagens" on rolagens for insert
  with check (exists (select 1 from fichas f where f.id = ficha_id and f.jogador_id = auth.uid()));
create policy "donos administram mapas" on mapas for all
  using (exists (select 1 from campanhas c where c.id = mapas.campanha_id and c.criador_id = auth.uid())
    or exists (select 1 from participantes_campanha p where p.campanha_id = mapas.campanha_id and p.usuario_id = auth.uid()))
  with check (exists (select 1 from campanhas c where c.id = mapas.campanha_id and c.criador_id = auth.uid())
    or exists (select 1 from participantes_campanha p where p.campanha_id = mapas.campanha_id and p.usuario_id = auth.uid()));
create policy "participantes administram tokens" on tokens for all
  using (exists (select 1 from mapas m left join participantes_campanha p on p.campanha_id = m.campanha_id
    where m.id = tokens.mapa_id and (p.usuario_id = auth.uid() or exists (select 1 from campanhas c where c.id = m.campanha_id and c.criador_id = auth.uid()))))
  with check (exists (select 1 from mapas m left join participantes_campanha p on p.campanha_id = m.campanha_id
    where m.id = tokens.mapa_id and (p.usuario_id = auth.uid() or exists (select 1 from campanhas c where c.id = m.campanha_id and c.criador_id = auth.uid()))));
create policy "participantes administram marcadores" on marcadores for all
  using (exists (select 1 from mapas m left join participantes_campanha p on p.campanha_id = m.campanha_id
    where m.id = marcadores.mapa_id and (p.usuario_id = auth.uid() or exists (select 1 from campanhas c where c.id = m.campanha_id and c.criador_id = auth.uid()))))
  with check (exists (select 1 from mapas m left join participantes_campanha p on p.campanha_id = m.campanha_id
    where m.id = marcadores.mapa_id and (p.usuario_id = auth.uid() or exists (select 1 from campanhas c where c.id = m.campanha_id and c.criador_id = auth.uid()))));
create policy "participantes podem ver participacoes" on participantes_campanha for select
  using (usuario_id = auth.uid() or exists (select 1 from campanhas c where c.id = campanha_id and c.criador_id = auth.uid()));
create policy "usuarios podem entrar em campanhas" on participantes_campanha for insert
  with check (usuario_id = auth.uid());

create or replace function entrar_campanha_por_codigo(p_codigo text)
returns table (id uuid, codigo text, nome text, criador_nome text, criada_em timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare campanha_id uuid;
begin
  if auth.uid() is null then raise exception 'Autenticacao obrigatoria'; end if;
  select c.id into campanha_id from campanhas c where c.codigo = upper(trim(p_codigo));
  if campanha_id is null then raise exception 'Codigo nao encontrado'; end if;
  insert into participantes_campanha (campanha_id, usuario_id, nome)
  select campanha_id, auth.uid(), 'jogador'
  on conflict (campanha_id, usuario_id) do nothing;
  return query select c.id, c.codigo, c.nome, c.criador_nome, c.criada_em from campanhas c where c.id = campanha_id;
end;
$$;
revoke all on function entrar_campanha_por_codigo(text) from public;
grant execute on function entrar_campanha_por_codigo(text) to authenticated;
  