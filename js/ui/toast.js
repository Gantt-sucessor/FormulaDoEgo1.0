// Fórmula do Ego — Toast (aviso flutuante de confirmação)
// Uso: mostrarToast('Campanha criada com sucesso!')
//      mostrarToast('Não deu pra salvar.', 'erro')

export function mostrarToast(mensagem, tipo = 'sucesso') {
  const el = document.createElement('div');
  el.className = `toast toast-${tipo}`;
  el.textContent = mensagem;
  document.body.appendChild(el);

  requestAnimationFrame(() => el.classList.add('visivel'));

  setTimeout(() => {
    el.classList.remove('visivel');
    setTimeout(() => el.remove(), 300);
  }, 2800);
}