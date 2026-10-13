// Fórmula do Ego — Ícones das armas
// Aponta pra uma imagem sua (colocada em assets/armas/) pra cada arma.
// Se a arma não tiver caminho definido aqui, cai no monograma automático (círculo + letra).

// Coloque seus arquivos de imagem em: formula-do-ego/assets/armas/
// e preencha o caminho de cada arma que você já tem abaixo.
// Exemplo real (edite o nome do arquivo pra bater com o que você salvou):
const CAMINHOS_IMAGENS = {
    
    abelha_anarquica: 'assets/armas/Bachira.png',
    indomito_mutavel: 'assets/armas/Isagi.png',
    tirano_atroz: 'assets/armas/Barou.png',
    felino_celere: 'assets/armas/Chigiri.png',
    espectro_inanime: 'assets/armas/Nagi.png',
    camaleao_mimetico: 'assets/armas/Reo.png',
    carrasco_sintetico: 'assets/armas/Kunigami.png',
    guardiao_selvatico: 'assets/armas/Gagamaru.png',
    muralha_tenaz: 'assets/armas/Raichi.png',
    arauto_vigilante: 'assets/armas/Arauto.png',
    vandalo_duelista: 'assets/armas/Vandalo.png',
    esqualo_sideral: 'assets/armas/Esqualo.png',
    corvo_pejorativo: 'assets/armas/Corvo.png',
    shinobi_absconso: 'assets/armas/Shinobi.png',
    trem_sonico: 'assets/armas/Trem.png',
    astro_inabalavel: 'assets/armas/Astro.png',
    sadista_frigido: 'assets/armas/Sadista.png',
    ritmista_limitrofe: 'assets/armas/Ritmista.png',
    astro_ascendente: 'assets/armas/Astro.png',
    devoto_iluminado: 'assets/armas/Devoto.png',
};  

/** Caminho absoluto da imagem da arma (ou null se ainda não tem). */
export function caminhoIconeArma(armaId) {
  const c = CAMINHOS_IMAGENS[armaId];
  return c ? `/${c.replace(/^\//, '')}` : null;
}
