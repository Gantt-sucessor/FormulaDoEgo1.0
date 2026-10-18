import { GLOSSARIO } from '../data/glossario.js';

/** Mantém a dica dentro da tela: desloca para o lado se estourar a borda e abre para baixo se faltar espaço em cima. */
export function posicionarDica(e) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const vw = document.documentElement.clientWidth;
  const larg = Math.min(el.classList.contains('termo-longo') ? 340 : 280, vw * 0.8);
  const alvo = Math.max(8, Math.min(r.left, vw - larg - 8));
  el.style.setProperty('--dx', `${Math.round(alvo - r.left)}px`);
  if (r.top < 190) el.setAttribute('data-baixo', ''); else el.removeAttribute('data-baixo');
}

/** Termo do sistema com dica ao passar o mouse, focar (teclado) ou tocar (celular). */
export function Termo({ id, children, className = '' }) {
  const dica = GLOSSARIO[id];
  if (!dica) return <span className={className}>{children}</span>;
  return (
    <span className={`termo ${className}`} tabIndex={0} data-dica={dica} onMouseEnter={posicionarDica} onFocus={posicionarDica} onTouchStart={posicionarDica} aria-label={`${typeof children === 'string' ? children : ''}: ${dica}`}>
      {children}
    </span>
  );
}
