# Fórmula do Ego — Site

Site do sistema de RPG "Fórmula do Ego 1.0" (Blue Lock), feito em HTML/CSS/JS puro.
Mestre cria campanha → gera código → players entram, montam ficha e rolam dados →
mestre vê tudo em tempo real.

## Rodar localmente

Como o projeto usa `<script type="module">` e `import`, ele precisa ser servido por
um servidor HTTP (abrir o `index.html` direto do disco não funciona por causa do CORS
dos módulos). Duas opções simples:

```bash
# Python (já vem instalado na maioria dos sistemas)
python3 -m http.server 8000

# ou, se tiver Node:
npx serve .
```

Depois abra `http://localhost:8000`.

## Configurar o banco (Supabase) — necessário pro tempo real funcionar

1. Crie uma conta grátis em https://supabase.com e um novo projeto.
2. No painel: **Settings → API**. Copie a **Project URL** e a **anon public key**.
3. Abra `js/supabase-client.js` e cole os dois valores nas constantes `SUPABASE_URL`
   e `SUPABASE_ANON_KEY`.
4. No painel: **SQL Editor → New query**. Cole todo o conteúdo de
   `supabase-schema.sql` e rode. Isso cria as 3 tabelas (`campanhas`, `fichas`,
   `rolagens`).
5. No painel: **Database → Replication**. Ative o Realtime pra tabela `rolagens`
   (é o que faz o mestre ver as rolagens aparecerem sem dar refresh).

Depois disso, tudo funciona: criar campanha, entrar com código, montar ficha e
rolar dados já vão salvar e sincronizar de verdade.

## Hospedar (deixar público, com link)

Qualquer host de site estático serve — o projeto não tem backend próprio (quem
faz esse papel é o Supabase). Sugestões:
- **Vercel** ou **Netlify**: conecta o repositório do GitHub e ele publica sozinho.
- **GitHub Pages**: `Settings → Pages → Deploy from a branch`.

## Estrutura do projeto

```
formula-do-ego/
├── index.html          → tela inicial (mestre / player)
├── mestre.html          → criar campanha + dashboard em tempo real
├── player.html           → entrar com código + montar ficha + rolar dados
├── supabase-schema.sql    → SQL das tabelas do banco
├── css/                    → base.css (tema), mestre.css, player.css
└── js/
    ├── supabase-client.js  → conexão com o banco
    ├── data/                → conteúdo do livro (atributos, perícias, tendências,
    │                          categorias, óticas, talentos, armas, jogadas)
    ├── regras/               → lógica do sistema (dados.js, calculos.js, efeitos.js)
    ├── mestre/                → lógica exclusiva da tela do mestre
    └── player/                 → lógica exclusiva da tela do player (inclui o
                                  seletor hexagonal de atributos)
```

## O que já está pronto

- Fluxo completo mestre → código → player → ficha → rolagem → tempo real.
- Todos os dados do livro (262 páginas) transcritos em `js/data/`: 6 atributos,
  18 perícias, 12 tendências, categorias (Gênio/Aprendiz), 11 óticas, talentos
  impetuosos (evolutivos/simples/razoáveis/complexos) e as 19 armas/classes.
- Motor de dados fiel à fórmula do livro: `d12 + [atributo × d6] + perícia`,
  com execuções absolutas automáticas (12 = +5 e PdS; 1 = -5, PdE, -PdS).
- Seletor de atributos em hexágono (6 atributos, no estilo visual que você
  mostrou, adaptado de pentágono pra hexágono).

## O que falta pra você decidir/expandir

- A ficha atual salva só atributos. Falta a UI pra escolher perícias, arma,
  ótica, tendência e talentos na tela de criação (os dados já estão prontos
  em `js/data/`, é "só" plugar mais campos no formulário de `player.html`).
- 3 habilidades da arma "Devoto Iluminado" (a última do livro) não tinham
  texto legível nas últimas páginas do PDF original — marcadas com uma nota
  em `js/data/armas.js`. Vale conferir se você tem uma versão mais completa.
- A política de segurança do Supabase (RLS) está aberta pra qualquer um
  ler/escrever, o que é ok pro momento mas vale revisar antes de divulgar
  pra estranhos de verdade.
