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
  configurarSaida();
  return null;
}

export async function usuarioAutenticado() {
  return null;
}

export async function sair() {
  usuarioAtual = null;
}
