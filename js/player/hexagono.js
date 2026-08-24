import { ATRIBUTOS, VALORES_ATRIBUTO } from '../data/atributos.js';

/**
 * Desenha o seletor hexagonal de atributos e cuida da lógica de atribuição.
 * Cada um dos 6 valores pré-definidos ([+4,+3,+2,+1,0,-1]) só pode ser usado uma vez.
 *
 * @param {HTMLElement} container - onde o widget será renderizado
 * @param {(atributosPreenchidos: Record<string, number>) => void} onChange - chamado a cada mudança
 * @param {Record<string, number>} [valoresIniciais] - atributos já salvos (pra editar uma ficha existente)
 */
export function initHexagono(container, onChange, valoresIniciais = {}) {
  const atribuicoes = { ...valoresIniciais }; // { atributoId: valor }
  let valorSelecionado = null;

  const raio = 130;
  const cx = 170, cy = 170;
  const angulos = [-90, -30, 30, 90, 150, 210]; // 6 pontos do hexágono

  const posicoes = ATRIBUTOS.map((atr, i) => {
    const rad = (angulos[i] * Math.PI) / 180;
    return { ...atr, x: cx + raio * Math.cos(rad), y: cy + raio * Math.sin(rad) };
  });

  container.innerHTML = `
    <div class="hexagono-wrap">
      <svg viewBox="0 0 340 340" class="hexagono-svg">
        <polygon class="hex-outline" points="${posicoes.map(p => `${p.x},${p.y}`).join(' ')}" />
        ${posicoes.map(p => `<line class="hex-spoke" x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" />`).join('')}
        <circle class="hex-center" cx="${cx}" cy="${cy}" r="34" />
        <text class="hex-center-label" x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central">ATRIBUTOS</text>
        ${posicoes.map(p => `
          <g class="hex-node" data-atributo="${p.id}" tabindex="0">
            <circle cx="${p.x}" cy="${p.y}" r="32" />
            <text class="hex-node-value" x="${p.x}" y="${p.y - 6}" text-anchor="middle" dominant-baseline="central" data-role="valor"></text>
            <text class="hex-node-label" x="${p.x}" y="${p.y + 14}" text-anchor="middle" dominant-baseline="central">${p.nome}</text>
          </g>
        `).join('')}
      </svg>
      <div class="hex-pool" id="hex-pool"></div>
      <p class="hex-hint">Toque num valor, depois toque no atributo pra atribuir.</p>
    </div>
  `;

  const svg = container.querySelector('.hexagono-svg');
  const pool = container.querySelector('#hex-pool');

  function renderPool() {
    const usados = Object.values(atribuicoes);
    pool.innerHTML = VALORES_ATRIBUTO.map((v) => {
      const disponivel = !usados.includes(v);
      const selecionado = valorSelecionado === v;
      return `<button class="hex-chip ${!disponivel ? 'usado' : ''} ${selecionado ? 'selecionado' : ''}"
                data-valor="${v}" ${!disponivel ? 'disabled' : ''}>${v > 0 ? '+' + v : v}</button>`;
    }).join('');
  }

  function renderNodes() {
    svg.querySelectorAll('.hex-node').forEach((node) => {
      const atrId = node.dataset.atributo;
      const valorEl = node.querySelector('[data-role="valor"]');
      const valor = atribuicoes[atrId];
      valorEl.textContent = valor !== undefined ? (valor > 0 ? '+' + valor : valor) : '';
      node.classList.toggle('preenchido', valor !== undefined);
    });
  }

  pool.addEventListener('click', (e) => {
    const chip = e.target.closest('.hex-chip');
    if (!chip || chip.disabled) return;
    const v = Number(chip.dataset.valor);
    valorSelecionado = valorSelecionado === v ? null : v;
    renderPool();
  });

  svg.querySelectorAll('.hex-node').forEach((node) => {
    node.addEventListener('click', () => {
      const atrId = node.dataset.atributo;
      if (valorSelecionado !== null) {
        atribuicoes[atrId] = valorSelecionado;
        valorSelecionado = null;
      } else if (atribuicoes[atrId] !== undefined) {
        delete atribuicoes[atrId];
      }
      renderPool();
      renderNodes();
      onChange({ ...atribuicoes });
    });
  });

  renderPool();
  renderNodes();
}