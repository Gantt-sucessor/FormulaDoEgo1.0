// Sons do sistema — sintetizados na hora (Web Audio), sem arquivos.
// Identidade: eletrônico, seco e ciano — blips curtos de "HUD", varreduras de energia e um gongo grave.
// O navegador só libera áudio depois de um clique/toque; tudo aqui é chamado a partir de ações do usuário.

const CHAVE = 'fde-som';
let ctx = null;
let mestre = null;
let ligado = lerPreferencia();
let ultimoEspecial = 0;
const ouvintes = new Set();

function lerPreferencia() {
  try { return localStorage.getItem(CHAVE) !== 'off'; } catch { return true; }
}

function contexto() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    mestre = ctx.createGain();
    mestre.gain.value = 0.55;
    const comp = ctx.createDynamicsCompressor();
    mestre.connect(comp); comp.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

/** Um tom com envelope: tipo, frequência (ou [de, até]), duração, volume, atraso, filtro opcional. */
function tom({ tipo = 'sine', f, dur = 0.12, vol = 0.2, atraso = 0, filtro = null, ataque = 0.005 }) {
  const c = contexto(); if (!c) return;
  const t0 = c.currentTime + atraso;
  const o = c.createOscillator(); const g = c.createGain();
  o.type = tipo;
  const [de, ate] = Array.isArray(f) ? f : [f, f];
  o.frequency.setValueAtTime(de, t0);
  if (ate !== de) o.frequency.exponentialRampToValueAtTime(Math.max(ate, 1), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + ataque);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  let saida = o;
  if (filtro) {
    const bq = c.createBiquadFilter(); bq.type = filtro.tipo; bq.frequency.value = filtro.f; bq.Q.value = filtro.q || 1;
    if (filtro.ate) bq.frequency.exponentialRampToValueAtTime(filtro.ate, t0 + dur);
    o.connect(bq); saida = bq;
  }
  saida.connect(g); g.connect(mestre);
  o.start(t0); o.stop(t0 + dur + 0.05);
}

/** Ruído filtrado (estalos, chiado, rajada). */
function ruido({ dur = 0.1, vol = 0.15, atraso = 0, tipo = 'bandpass', f = 2000, ate = null, q = 1 }) {
  const c = contexto(); if (!c) return;
  const t0 = c.currentTime + atraso;
  const buf = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * dur)), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i += 1) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource(); src.buffer = buf;
  const bq = c.createBiquadFilter(); bq.type = tipo; bq.frequency.setValueAtTime(f, t0); bq.Q.value = q;
  if (ate) bq.frequency.exponentialRampToValueAtTime(ate, t0 + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(bq); bq.connect(g); g.connect(mestre);
  src.start(t0); src.stop(t0 + dur + 0.02);
}

const NOTAS = { c5: 523.25, e5: 659.25, g5: 783.99, c6: 1046.5, e6: 1318.5, g6: 1568 };

const SONS = {
  // clique de botão: blip de HUD
  clique: () => tom({ tipo: 'square', f: 1900, dur: 0.035, vol: 0.05, filtro: { tipo: 'lowpass', f: 4200 } }),
  // caixa marcada / desmarcada
  ligar: () => { tom({ tipo: 'triangle', f: 760, dur: 0.06, vol: 0.12 }); tom({ tipo: 'triangle', f: 1140, dur: 0.09, vol: 0.12, atraso: 0.05 }); },
  desligar: () => { tom({ tipo: 'triangle', f: 1000, dur: 0.06, vol: 0.1 }); tom({ tipo: 'triangle', f: 640, dur: 0.09, vol: 0.1, atraso: 0.05 }); },
  // usar habilidade/talento: carga de energia que dispara
  usar: () => {
    tom({ tipo: 'sawtooth', f: [180, 900], dur: 0.22, vol: 0.12, filtro: { tipo: 'lowpass', f: 600, ate: 5000, q: 4 } });
    tom({ tipo: 'square', f: 1320, dur: 0.09, vol: 0.09, atraso: 0.2 });
    ruido({ dur: 0.16, vol: 0.06, atraso: 0.2, tipo: 'highpass', f: 5000 });
  },
  // encerrar efeito
  encerrar: () => tom({ tipo: 'sawtooth', f: [700, 160], dur: 0.2, vol: 0.09, filtro: { tipo: 'lowpass', f: 2200 } }),
  // rolagem normal: dados chacoalhando e pousando
  rolar: () => {
    [0, 0.05, 0.1, 0.17, 0.25].forEach((a, i) => ruido({ dur: 0.035, vol: 0.2 - i * 0.025, atraso: a, f: 1400 + Math.random() * 2200, q: 3 }));
    tom({ tipo: 'sine', f: [160, 70], dur: 0.16, vol: 0.2, atraso: 0.3 });
  },
  // CRÍTICO (12 no d12): fanfarra brilhante, arpejo ascendente e brilho
  critico: () => {
    [NOTAS.c5, NOTAS.e5, NOTAS.g5, NOTAS.c6, NOTAS.e6].forEach((n, i) => {
      tom({ tipo: 'triangle', f: n, dur: 0.32, vol: 0.16, atraso: i * 0.07 });
      tom({ tipo: 'sine', f: n * 2, dur: 0.4, vol: 0.05, atraso: i * 0.07 });
    });
    tom({ tipo: 'sawtooth', f: [NOTAS.c6, NOTAS.c6], dur: 0.9, vol: 0.05, atraso: 0.3, filtro: { tipo: 'lowpass', f: 3000 } });
    tom({ tipo: 'sine', f: [90, 45], dur: 0.45, vol: 0.28 });
    ruido({ dur: 0.7, vol: 0.05, atraso: 0.28, tipo: 'highpass', f: 6500 });
  },
  // FALHA CRÍTICA (1 no d12): queda desafinada, grave e estalos
  falha: () => {
    tom({ tipo: 'sawtooth', f: [330, 48], dur: 0.9, vol: 0.2, filtro: { tipo: 'lowpass', f: 1200, ate: 120, q: 3 } });
    tom({ tipo: 'sawtooth', f: [349, 52], dur: 0.9, vol: 0.14, filtro: { tipo: 'lowpass', f: 1200, ate: 120, q: 3 } }); // meio-tom: dissonância
    tom({ tipo: 'square', f: [92, 38], dur: 0.5, vol: 0.18, atraso: 0.04 });
    [0.1, 0.22, 0.31, 0.47, 0.6].forEach((a) => ruido({ dur: 0.05, vol: 0.18, atraso: a, f: 900 + Math.random() * 900, q: 5 }));
  },
  // nova rodada: gongo grave
  rodada: () => {
    [[110, 0.3], [165, 0.14], [221, 0.1], [331, 0.06]].forEach(([f, v]) => tom({ tipo: 'sine', f, dur: 1.5, vol: v, ataque: 0.01 }));
    ruido({ dur: 0.25, vol: 0.08, f: 300, tipo: 'lowpass' });
  },
  // passar turno: dois toques secos
  turno: () => { tom({ tipo: 'square', f: 520, dur: 0.06, vol: 0.09 }); tom({ tipo: 'square', f: 780, dur: 0.08, vol: 0.09, atraso: 0.08 }); },
  // fluxo: varredura de energia + acorde
  fluxo: () => {
    tom({ tipo: 'sawtooth', f: [90, 1400], dur: 0.7, vol: 0.12, filtro: { tipo: 'lowpass', f: 300, ate: 6000, q: 5 } });
    ruido({ dur: 0.7, vol: 0.08, tipo: 'bandpass', f: 400, ate: 7000, q: 2 });
    [NOTAS.c5, NOTAS.g5, NOTAS.c6].forEach((n) => tom({ tipo: 'triangle', f: n, dur: 0.8, vol: 0.1, atraso: 0.62 }));
  },
  // erro / não pode
  erro: () => { tom({ tipo: 'square', f: 170, dur: 0.11, vol: 0.12 }); tom({ tipo: 'square', f: 130, dur: 0.16, vol: 0.12, atraso: 0.1 }); },
  // sucesso leve (ficha criada, etc.)
  ok: () => { tom({ tipo: 'triangle', f: 660, dur: 0.08, vol: 0.12 }); tom({ tipo: 'triangle', f: 990, dur: 0.14, vol: 0.12, atraso: 0.07 }); },
};

export const som = {
  get ligado() { return ligado; },
  inscrever(fn) { ouvintes.add(fn); return () => ouvintes.delete(fn); },
  alternar() {
    ligado = !ligado;
    try { localStorage.setItem(CHAVE, ligado ? 'on' : 'off'); } catch { /* sem armazenamento: só não lembra */ }
    ouvintes.forEach((fn) => fn(ligado));
    if (ligado) SONS.ok();
    return ligado;
  },
  tocar(nome) {
    if (!ligado || !SONS[nome]) return;
    if (nome !== 'clique') ultimoEspecial = Date.now();
    try { SONS[nome](); } catch { /* áudio indisponível: segue sem som */ }
  },
  /** Som de uma rolagem pronta: crítico, falha crítica ou rolagem comum. */
  rolagem(resultado) {
    const tipo = resultado?.execucaoAbsoluta?.tipo;
    this.tocar(tipo === 'positiva' ? 'critico' : tipo === 'negativa' ? 'falha' : 'rolar');
  },
};

/** Liga o "tique" em todo botão/cartão/caixa da página (sem tocar por cima de um som específico). */
export function instalarSomGlobal() {
  if (typeof document === 'undefined') return;
  document.addEventListener('click', (e) => {
    if (!ligado) return;
    const alvo = e.target instanceof Element ? e.target.closest('button, a.btn, summary, input[type="checkbox"], input[type="radio"], [role="tab"]') : null;
    if (!alvo || alvo.disabled) return;
    if (Date.now() - ultimoEspecial < 80) return;
    if (alvo.matches('input[type="checkbox"]')) som.tocar(alvo.checked ? 'ligar' : 'desligar');
    else som.tocar('clique');
  });
}
