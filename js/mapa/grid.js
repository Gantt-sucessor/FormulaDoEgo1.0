// Fórmula do Ego — Motor visual do mapa tático
// 1 célula do grid = 1 metro. Desenha em <canvas>, cuida de arrastar tokens,
// medir distância com a régua, e criar marcadores de área/anotação.

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Object} opcoes
 * @param {Object} opcoes.mapa - { largura_celulas, altura_celulas, tamanho_celula_px, imagem_url }
 * @param {Array} opcoes.tokens
 * @param {Array} opcoes.marcadores
 * @param {(tokenId: string, x: number, y: number) => void} opcoes.onMoverToken
 * @param {(marcador: object) => void} opcoes.onCriarMarcador
 * @param {string} opcoes.meuNome
 */
export function initMapaCanvas(canvas, { mapa, tokens, marcadores, onMoverToken, onCriarMarcador, meuNome }) {
  const ctx = canvas.getContext('2d');
  const cel = mapa.tamanho_celula_px;
  canvas.width = mapa.largura_celulas * cel;
  canvas.height = mapa.altura_celulas * cel;

  let imagemFundo = null;
  if (mapa.imagem_url) {
    imagemFundo = new Image();
    imagemFundo.crossOrigin = 'anonymous';
    imagemFundo.src = mapa.imagem_url;
    imagemFundo.onload = render;
  }

  let ferramenta = 'mover'; // 'mover' | 'regua' | 'area' | 'nota'
  let arrastando = null;
  let reguaInicio = null;
  let mousePos = { x: 0, y: 0 };

  function pxParaCelula(px) { return px / cel; }

  function posDoEvento(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function limitarPosicao(pos) {
    return {
      x: Math.max(0.5, Math.min(mapa.largura_celulas - 0.5, pos.x)),
      y: Math.max(0.5, Math.min(mapa.altura_celulas - 0.5, pos.y)),
    };
  }

  function wrapText(texto, x, y, maxWidth, lineHeight) {
    const palavras = (texto || '').split(' ');
    let linha = '';
    let linhaY = y;
    for (const p of palavras) {
      const teste = linha + p + ' ';
      if (ctx.measureText(teste).width > maxWidth && linha) {
        ctx.fillText(linha, x, linhaY);
        linha = p + ' ';
        linhaY += lineHeight;
      } else {
        linha = teste;
      }
    }
    ctx.fillText(linha, x, linhaY);
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (imagemFundo && imagemFundo.complete) {
      ctx.drawImage(imagemFundo, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#0a0d14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Grid — cada quadrado = 1m
    ctx.strokeStyle = 'rgba(255,255,255,0.28)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx <= mapa.largura_celulas; gx++) {
      ctx.beginPath(); ctx.moveTo(gx * cel, 0); ctx.lineTo(gx * cel, canvas.height); ctx.stroke();
    }
    for (let gy = 0; gy <= mapa.altura_celulas; gy++) {
      ctx.beginPath(); ctx.moveTo(0, gy * cel); ctx.lineTo(canvas.width, gy * cel); ctx.stroke();
    }

    // Marcadores (áreas e anotações)
    marcadores.forEach((m) => {
      if (m.tipo === 'area_circulo') {
        ctx.beginPath();
        ctx.arc(m.x * cel, m.y * cel, m.tamanho * cel, 0, Math.PI * 2);
        ctx.fillStyle = (m.cor || '#f2b705') + '33';
        ctx.strokeStyle = m.cor || '#f2b705';
        ctx.lineWidth = 2;
        ctx.fill(); ctx.stroke();
      } else if (m.tipo === 'area_quadrado') {
        const lado = m.tamanho * cel;
        ctx.fillStyle = (m.cor || '#f2b705') + '33';
        ctx.strokeStyle = m.cor || '#f2b705';
        ctx.lineWidth = 2;
        ctx.fillRect(m.x * cel - lado / 2, m.y * cel - lado / 2, lado, lado);
        ctx.strokeRect(m.x * cel - lado / 2, m.y * cel - lado / 2, lado, lado);
      } else if (m.tipo === 'nota') {
        const w = 150, h = 44;
        ctx.fillStyle = '#12161f';
        ctx.strokeStyle = '#f2b705';
        ctx.lineWidth = 1.5;
        ctx.fillRect(m.x * cel - w / 2, m.y * cel - h / 2, w, h);
        ctx.strokeRect(m.x * cel - w / 2, m.y * cel - h / 2, w, h);
        ctx.fillStyle = '#eceef3';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        wrapText(m.texto, m.x * cel, m.y * cel - h / 2 + 16, w - 12, 14);
      }
    });

    // Tokens
    tokens.forEach((t) => {
      ctx.beginPath();
      ctx.arc(t.pos_x * cel, t.pos_y * cel, cel * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = t.cor || '#3b7bff';
      ctx.fill();
      ctx.strokeStyle = '#eceef3';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((t.nome || '?').charAt(0).toUpperCase(), t.pos_x * cel, t.pos_y * cel);
    });

    // Régua sendo usada agora
    if (ferramenta === 'regua' && reguaInicio) {
      ctx.beginPath();
      ctx.moveTo(reguaInicio.x, reguaInicio.y);
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.strokeStyle = '#f2b705';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      const dist = Math.hypot(mousePos.x - reguaInicio.x, mousePos.y - reguaInicio.y) / cel;
      ctx.fillStyle = '#f2b705';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${dist.toFixed(1)}m`, mousePos.x + 10, mousePos.y - 10);
    }
  }

  function tokenNaPosicao(pos) {
    return tokens.find((t) => Math.hypot(t.pos_x * cel - pos.x, t.pos_y * cel - pos.y) <= cel * 0.4);
  }

  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture?.(e.pointerId);
    e.preventDefault();
    const pos = posDoEvento(e);
    if (ferramenta === 'mover') {
      const t = tokenNaPosicao(pos);
      if (t) arrastando = t;
    } else if (ferramenta === 'regua') {
      reguaInicio = pos;
    } else if (ferramenta === 'area') {
      const entrada = prompt('Raio da área em metros (ex: 3). Deixe em branco pra cancelar:');
      if (!entrada) return;
      const tamanho = parseFloat(entrada.replace(',', '.'));
      if (!tamanho || tamanho <= 0) return;
      onCriarMarcador({ tipo: 'area_circulo', x: pxParaCelula(pos.x), y: pxParaCelula(pos.y), tamanho, cor: '#f2b705', criado_por: meuNome });
    } else if (ferramenta === 'nota') {
      const texto = prompt('Texto da anotação:');
      if (!texto) return;
      onCriarMarcador({ tipo: 'nota', x: pxParaCelula(pos.x), y: pxParaCelula(pos.y), texto, criado_por: meuNome });
    }
  });

  canvas.addEventListener('pointermove', (e) => {
    e.preventDefault();
    mousePos = posDoEvento(e);
    if (arrastando) {
      const limitada = limitarPosicao({ x: pxParaCelula(mousePos.x), y: pxParaCelula(mousePos.y) });
      arrastando.pos_x = limitada.x;
      arrastando.pos_y = limitada.y;
      render();
    } else if (ferramenta === 'regua' && reguaInicio) {
      render();
    }
  });

  canvas.addEventListener('pointerup', (e) => {
    canvas.releasePointerCapture?.(e.pointerId);
    if (arrastando) {
      onMoverToken(arrastando.id, arrastando.pos_x, arrastando.pos_y);
      arrastando = null;
    }
    if (ferramenta === 'regua') {
      reguaInicio = null;
      render();
    }
  });

  canvas.addEventListener('pointercancel', () => {
    if (arrastando) {
      onMoverToken(arrastando.id, arrastando.pos_x, arrastando.pos_y);
      arrastando = null;
    }
  });

  render();

  return {
    setFerramenta(f) { ferramenta = f; reguaInicio = null; render(); },
    atualizarTokens(novos) { tokens = novos; render(); },
    atualizarMarcadores(novos) { marcadores = novos; render(); },
    redesenhar: render,
  };
}