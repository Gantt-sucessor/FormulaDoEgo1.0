const TEMAS = {
  sae: { label: 'Itoshi Sae', accent: '#ff4f9a', accentDim: '#6e2448', glow: '255, 79, 154', motif: '01 07 10 11' },
  kaiser: { label: 'Michael Kaiser', accent: '#4aa8ff', accentDim: '#24527a', glow: '74, 168, 255', motif: 'BLUE ROSES // IMPACT' },
  rin: { label: 'Rin Itoshi', accent: '#39d98a', accentDim: '#1c704b', glow: '57, 217, 138', motif: 'EYES // MOUTHS' },
  bachira: { label: 'Meguru Bachira', accent: '#f6c945', accentDim: '#705c1c', glow: '246, 201, 69', motif: 'MONSTER // BEE' },
  shidou: { label: 'Ryusei Shidou', accent: '#ff4f9a', accentDim: '#6e2448', glow: '255, 79, 154', motif: 'DRAGON // DEMON FLOW' },
};

const temaSalvo = localStorage.getItem('formula-ego-tema') || 'kaiser';
const temaInicial = TEMAS[temaSalvo] ? temaSalvo : 'kaiser';

document.documentElement.dataset.tema = temaInicial;

function atualizarTema(temaId) {
  if (!TEMAS[temaId]) return;
  document.documentElement.dataset.tema = temaId;
  localStorage.setItem('formula-ego-tema', temaId);
  const tema = TEMAS[temaId];
  const motivo = document.querySelector('.tema-atmosfera');
  if (motivo) {
    motivo.querySelector('.motivo-principal').textContent = tema.motif;
    motivo.querySelector('.motivo-secundario').textContent = tema.label.toUpperCase();
  }
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
  const atmosfera = document.createElement('div');
  atmosfera.className = 'tema-atmosfera';
  atmosfera.setAttribute('aria-hidden', 'true');
  atmosfera.innerHTML = '<span class="motivo-principal"></span><span class="motivo-secundario"></span>';
  document.body.appendChild(atmosfera);
  atualizarTema(temaInicial);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', criarSeletorTema);
} else {
  criarSeletorTema();
}
