import { ATRIBUTOS } from '../data/atributos.js';

const MIN_ATRIBUTO = -1;
const MAX_ATRIBUTO = 4;

/**
 * Desenha o cartão de Atributos: hexágono visual em cima + grade de +/- embaixo,
 * tudo dentro de um único cartão centralizado. Edição livre (sem exigir que cada
 * valor pré-definido seja usado só uma vez) — o mestre decide o que faz sentido pra mesa.
 *
 * @param {HTMLElement} container - onde o widget será renderizado
 * @param {(atributosPreenchidos: Record<string, number>) => void} onChange - chamado a cada mudança
 * @param {Record<string, number>} [valoresIniciais] - atributos já salvos (pra editar uma ficha existente)
 */
export function initHexagono(container, onChange, valoresIniciais = {}) {
  const valores = {};
  ATRIBUTOS.forEach((a) => { valores[a.id] = valoresIniciais[a.id] ?? 0; });

  const raio = 110;
  const cx = 150, cy = 150;
  const angulos = [-90, -30, 30, 90, 150, 210]; // 6 pontos do hexágono

  const posicoes = ATRIBUTOS.map((atr, i) => {
    const rad = (angulos[i] * Math.PI) / 180;
    return { ...atr, x: cx + raio * Math.cos(rad), y: cy + raio * Math.sin(rad) };
  });

  container.innerHTML = `
    <div class="atributos-card">
      <div class="atributos-card-titulo">ATRIBUTOS</div>
      <p class="hex-hint">Clique em + ou − pra ajustar. O hexágono acompanha em tempo real.</p>
      <div class="hexagono-wrap">
        <svg viewBox="0 0 300 300" class="hexagono-svg">
          <polygon class="hex-outline" points="${posicoes.map(p => `${p.x},${p.y}`).join(' ')}" />
          ${posicoes.map(p => `<line class="hex-spoke" x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" />`).join('')}
          <circle class="hex-center" cx="${cx}" cy="${cy}" r="30" />
          <text class="hex-center-label" x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central">ATRIBUTOS</text>
          ${posicoes.map(p => `
            <g class="hex-node" data-atributo="${p.id}">
              <circle cx="${p.x}" cy="${p.y}" r="28" />
              <text class="hex-node-value" x="${p.x}" y="${p.y - 5}" text-anchor="middle" dominant-baseline="central" data-role="valor"></text>
              <text class="hex-node-label" x="${p.x}" y="${p.y + 13}" text-anchor="middle" dominant-baseline="central">${p.nome.split(' ')[0].slice(0, 3).toUpperCase()}</text>
            </g>
          `).join('')}
        </svg>
      </div>
      <div class="hex-attr-grid">
        ${ATRIBUTOS.map((a) => `
          <div class="hex-attr-cell">
            <div class="hex-attr-nome">${a.nome}</div>
            <div class="hex-attr-controles">
              <button type="button" data-acao="menos" data-atributo="${a.id}">−</button>
              <span class="hex-attr-valor" data-role="valor-${a.id}"></span>
              <button type="button" data-acao="mais" data-atributo="${a.id}">+</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  const svg = container.querySelector('.hexagono-svg');

  function formatar(v) {
    return v > 0 ? `+${v}` : `${v}`;
  }

  function render() {
    svg.querySelectorAll('.hex-node').forEach((node) => {
      const atrId = node.dataset.atributo;
      node.querySelector('[data-role="valor"]').textContent = formatar(valores[atrId]);
      node.classList.toggle('preenchido', valores[atrId] !== 0);
    });
    ATRIBUTOS.forEach((a) => {
      const el = container.querySelector(`[data-role="valor-${a.id}"]`);
      if (el) el.textContent = formatar(valores[a.id]);
    });
  }

  container.querySelectorAll('.hex-attr-controles button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.atributo;
      if (btn.dataset.acao === 'mais' && valores[id] < MAX_ATRIBUTO) valores[id] += 1;
      if (btn.dataset.acao === 'menos' && valores[id] > MIN_ATRIBUTO) valores[id] -= 1;
      render();
      onChange({ ...valores });
    });
  });

  render();
  onChange({ ...valores });
}