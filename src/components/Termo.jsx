import { GLOSSARIO } from '../data/glossario.js';

/** Termo do sistema com dica ao passar o mouse, focar (teclado) ou tocar (celular). */
export function Termo({ id, children, className = '' }) {
  const dica = GLOSSARIO[id];
  if (!dica) return <span className={className}>{children}</span>;
  return (
    <span className={`termo ${className}`} tabIndex={0} data-dica={dica} aria-label={`${typeof children === 'string' ? children : ''}: ${dica}`}>
      {children}
    </span>
  );
}
