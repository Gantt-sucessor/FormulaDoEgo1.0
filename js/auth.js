import { supabase } from './supabase-client.js';

let usuarioAtual = null;

function configurarSaida() {
  document.querySelectorAll('[data-sair]').forEach((botao) => {
    if (botao.dataset.saidaConfigurada) return;
    botao.dataset.saidaConfigurada = 'true';
    botao.addEventListener('click', async (event) => {
      event.preventDefault();
      await sair();
      window.location.href = botao.href || 'index.html';
    });
  });
}

export async function exigirAutenticacao() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    usuarioAtual = session.user;
    configurarSaida();
    return usuarioAtual;
  }

  return new Promise((resolve, reject) => {
    const overlay = document.createElement('div');
    overlay.className = 'auth-overlay';
    overlay.innerHTML = `
      <form class="auth-painel">
        <div class="eyebrow">Fórmula do Ego</div>
        <h2>Entrar na arena</h2>
        <p>Use seu e-mail para acessar campanhas, fichas e rolagens.</p>
        <label for="auth-email">E-mail</label>
        <input id="auth-email" type="email" autocomplete="email" required />
        <label for="auth-senha">Senha</label>
        <input id="auth-senha" type="password" autocomplete="current-password" minlength="8" required />
        <button class="btn btn-primary" type="submit">Entrar</button>
        <button class="auth-alternar" type="button">Criar conta</button>
        <p class="auth-mensagem" role="status"></p>
      </form>
    `;
    document.body.appendChild(overlay);

    const form = overlay.querySelector('form');
    const alternar = overlay.querySelector('.auth-alternar');
    const submit = form.querySelector('button[type="submit"]');
    const mensagem = overlay.querySelector('.auth-mensagem');
    let cadastro = false;

    alternar.addEventListener('click', () => {
      cadastro = !cadastro;
      submit.textContent = cadastro ? 'Criar conta' : 'Entrar';
      alternar.textContent = cadastro ? 'Já tenho uma conta' : 'Criar conta';
      mensagem.textContent = '';
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      submit.disabled = true;
      mensagem.textContent = '';
      const email = form.querySelector('#auth-email').value.trim();
      const senha = form.querySelector('#auth-senha').value;
      const resposta = cadastro
        ? await supabase.auth.signUp({ email, password: senha })
        : await supabase.auth.signInWithPassword({ email, password: senha });

      if (resposta.error) {
        mensagem.textContent = resposta.error.message;
        submit.disabled = false;
        return;
      }
      if (cadastro && !resposta.data.session) {
        mensagem.textContent = 'Conta criada. Confirme seu e-mail e depois entre.';
        submit.disabled = false;
        return;
      }
      usuarioAtual = resposta.data.user;
      overlay.remove();
      configurarSaida();
      resolve(usuarioAtual);
    });
  });
}

export async function usuarioAutenticado() {
  if (usuarioAtual) return usuarioAtual;
  const { data: { user } } = await supabase.auth.getUser();
  usuarioAtual = user;
  return user;
}

export async function sair() {
  await supabase.auth.signOut();
  usuarioAtual = null;
}
