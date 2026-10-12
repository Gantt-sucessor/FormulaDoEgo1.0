# Fórmula do Ego

Site do RPG **Fórmula do Ego 1.0**: fichas, mesa com habilidades automatizadas, salas ao vivo e painel do mestre.
Feito em **React + Vite + Tailwind CSS v4**, com **Supabase** (login, banco e tempo real) e deploy na **Vercel**.

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # regras do jogo (node --test)
npm run build    # gera dist/
```

O Supabase já vem configurado com a chave pública. Para usar outro projeto, defina `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (no Vercel: Settings → Environment Variables).

## Banco de dados

`supabase-schema.sql` é o schema original. Para o app novo rode **uma vez** `supabase/migracao-aditiva.sql` no SQL Editor: ela faz um backup da tabela `fichas` e só adiciona colunas que faltarem — nenhuma ficha existente é alterada.

## Estrutura

- `src/data/` — conteúdo do livro (armas, óticas, tendências, categorias, talentos, fluxo…)
- `src/regras/` — regras puras e testadas (dados, efeitos, motor de habilidades)
- `src/lib/` — Supabase, rotas, login, estado da ficha (`useFicha`)
- `src/components/` e `src/pages/` — interface (aba **Na mesa**, **Personagem**, **Talentos & Fluxo**, sala e mestre)
- `public/` — imagens das armas, ícone e manifesto (instalável no celular)

## Mestre e jogadores

- Quem **cria a sala** vira o mestre: `/mestre` lista as campanhas e abre o painel ao vivo (fichas, rolagens, teste de DJ, ajuste de PdE/fôlego/efeitos, passar turno/rodada para todos).
- Jogadores entram por código em `/fichas` e veem a sala em `/sala/CÓDIGO`.
- Qualquer ficha tem link público somente leitura em `/publica/ID`.

## Celular

Layout responsivo com barra de abas fixa embaixo. No navegador do celular, use "Adicionar à tela inicial" para instalar como app.
