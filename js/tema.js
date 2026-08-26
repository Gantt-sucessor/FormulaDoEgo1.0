const TEMAS = {
  sae: { label: 'Itoshi Sae', accent: '#ff4f9a', accentDim: '#6e2448', glow: '255, 79, 154' },
  kaiser: { label: 'Michael Kaiser', accent: '#4aa8ff', accentDim: '#24527a', glow: '74, 168, 255' },
  rin: { label: 'Rin Itoshi', accent: '#8c7bff', accentDim: '#403776', glow: '140, 123, 255' },
  bachira: { label: 'Meguru Bachira', accent: '#f6c945', accentDim: '#705c1c', glow: '246, 201, 69' },
  shidou: { label: 'Ryusei Shidou', accent: '#ff654d', accentDim: '#762f27', glow: '255, 101, 77' },
};

const temaSalvo = localStorage.getItem('formula-ego-tema') || 'kaiser';
const temaInicial = TEMAS[temaSalvo] ? temaSalvo : 'kaiser';

document.documentElement.dataset.tema = temaInicial;

function atualizarTema(temaId) {
  if (!TEMAS[temaId]) return;
  document.documentElement.dataset.tema = temaId;
  localStorage.setItem('formula-ego-tema', temaId);
  document.querySelectorAll('[data-seletor-tema]').forEach((select) => {
    select.value = temaId;
  });
}

function criarSeletorTema() {
  const topbar = document.querySelector('.topbar');
  if (!topbar || topbar.querySelector('[data-seletor-tema]')) return;

  const seletor = document.createElement('label');
  seletor.className = 'tema-controle';
  seletor.title = 'Trocar aura visual';
  seletor.innerHTML = `
    <span class="tema-sinal" aria-hidden="true">◈</span>
    <span class="tema-label">Aura</span>
    <select data-seletor-tema aria-label="Escolher aura visual">
      ${Object.entries(TEMAS).map(([id, tema]) => `<option value="${id}">${tema.label}</option>`).join('')}
    </select>
  `;
  topbar.insertBefore(seletor, topbar.lastElementChild);
  seletor.querySelector('select').addEventListener('change', (event) => atualizarTema(event.target.value));
  atualizarTema(temaInicial);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', criarSeletorTema);
} else {
  criarSeletorTema();
}
