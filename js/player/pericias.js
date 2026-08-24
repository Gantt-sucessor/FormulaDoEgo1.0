import { PERICIAS, PONTOS_PERICIA_CRIACAO, MAX_PONTOS_PERICIA } from '../data/pericias.js';
import { ATRIBUTOS } from '../data/atributos.js';

/**
 * Desenha o grid de perícias com +/- livres (sem ordem obrigatória).
 * Sinaliza visualmente se passou dos 10 pontos, mas não bloqueia — quem decide é o jogador/mestre.
 *
 * @param {HTMLElement} container
 * @param {Record<string, number>} valoresIniciais - perícias já salvas na ficha (se houver)
 * @param {(pericias: Record<string, number>) => void} onChange
 */
export function initPericias(container, valoresIniciais, onChange) {
  const valores = { ...valoresIniciais };

  function totalDistribuido() {
    return Object.values(valores).reduce((a, b) => a + b, 0);
  }

  function render() {
    const total = totalDistribuido();
    container.innerHTML = `
      <div class="pericias-grid">
        ${ATRIBUTOS.map((atr) => PERICIAS.filter((p) => p.atributo === atr.id).map((p) => `
          <div class="pericia-item">
            <span class="nome">${p.nome}</span>
            <span class="controles">
              <button type="button" data-acao="menos" data-pericia="${p.id}">−</button>
              <span class="valor">${valores[p.id] || 0}</span>
              <button type="button" data-acao="mais" data-pericia="${p.id}">+</button>
            </span>
          </div>
        `).join('')).join('')}
      </div>
      <div class="pericias-total ${total > PONTOS_PERICIA_CRIACAO ? 'excedido' : ''}">
        ${total} / ${PONTOS_PERICIA_CRIACAO} pontos distribuídos
        ${total > PONTOS_PERICIA_CRIACAO ? '— acima do recomendado pro livro, mas fica a critério do mestre' : ''}
      </div>
    `;

    container.querySelectorAll('button[data-acao]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.pericia;
        const atual = valores[id] || 0;
        if (btn.dataset.acao === 'mais' && atual < MAX_PONTOS_PERICIA) {
          valores[id] = atual + 1;
        } else if (btn.dataset.acao === 'menos' && atual > 0) {
          valores[id] = atual - 1;
        }
        render();
        onChange({ ...valores });
      });
    });
  }

  render();
}