// Fórmula do Ego — Ícones das armas
// Aponta pra uma imagem sua (colocada em assets/armas/) pra cada arma.
// Se a arma não tiver caminho definido aqui, cai no monograma automático (círculo + letra).

// Coloque seus arquivos de imagem em: formula-do-ego/assets/armas/
// e preencha o caminho de cada arma que você já tem abaixo.
// Exemplo real (edite o nome do arquivo pra bater com o que você salvou):
const CAMINHOS_IMAGENS = {
    
    abelha_anarquica: 'assets/armas/Bachira.png',
    indomito_mutavel: 'assets/armas/Isagi.jpg',
    tirano_atroz: 'assets/armas/Barou.jpg',
    felino_celere: 'assets/armas/chigiri.jpg',
    espectro_inanime: 'assets/armas/Nagi.jpg',
    camaleao_mimetico: 'assets/armas/Reo.jpg',
    carrasco_sintetico: 'assets/armas/Kunigami.jpg',
    guardiao_selvatico: 'assets/armas/Gagamaru.jpg',
    muralha_tenaz: 'assets/armas/Raichi.jpg',
    arauto_vigilante: 'assets/armas/Arauto.jpg',
    vandalo_duelista: 'assets/armas/Vandalo.jpg',
    esqualo_sideral: 'assets/armas/Esqualo.jpg',
    corvo_pejorativo: 'assets/armas/Corvo.jpg',
    shinobi_absconso: 'assets/armas/Shinobi.jpg',
    trem_sonico: 'assets/armas/Trem.jpg',
    astro_inabalavel: 'assets/armas/Astro.jpg',
    sadista_frigido: 'assets/armas/Sadista.jpg',
    ritmista_limitrofe: 'assets/armas/Ritmista.jpg',
    astro_ascendente: 'assets/armas/Astro.jpg',
    devoto_iluminado: 'assets/armas/Devoto.jpg',
};  

/** Monograma automático (círculo com a inicial) pras armas sem imagem ainda. */
function monograma(nome) {
  const letra = (nome || '?').trim().charAt(0).toUpperCase();
  return `
    <svg viewBox="0 0 40 40" class="icone-arma-svg">
      <circle cx="20" cy="20" r="18" class="icone-arma-fundo" />
      <text x="20" y="21" text-anchor="middle" dominant-baseline="central" class="icone-arma-letra">${letra}</text>
    </svg>
  `;
}

/**
 * Retorna o markup HTML do ícone de uma arma (por id).
 * Usa a imagem de CAMINHOS_IMAGENS se existir; senão cai no monograma.
 * onerror: se o arquivo de imagem não for encontrado (caminho errado, ainda não
 * enviado, etc), troca sozinho pelo monograma em vez de mostrar ícone quebrado.
 */
export function iconeArmaHTML(armaId, armaNome) {
  const caminho = CAMINHOS_IMAGENS[armaId];
  if (!caminho) return monograma(armaNome);

  const fallback = monograma(armaNome).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  return `<img src="${caminho}" alt="${armaNome}" class="icone-arma-img" onerror="this.outerHTML = '${fallback}';" />`;
}