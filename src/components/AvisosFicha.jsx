import { useState } from 'react';
import { validarFicha } from '../lib/validarFicha.js';

const ROTULO_ABA = { mesa: 'Na mesa', personagem: 'Personagem', fluxo: 'Talentos & Fluxo' };

/** Faixa no topo da ficha: lista o que está errado ou faltando, com atalho para corrigir. */
export function AvisosFicha({ f, existe, irPara }) {
  const [aberto, setAberto] = useState(true);
  const problemas = validarFicha(f).filter((p) => existe || p.alvo !== 'sec-identidade' || p.nivel === 'erro');
  if (problemas.length === 0) return null;
  const erros = problemas.filter((p) => p.nivel === 'erro').length;
  const avisos = problemas.length - erros;
  const cor = erros ? 'border-perigo/60 bg-perigo/10' : 'border-laranja/50 bg-laranja/10';

  return (
    <section className={`mb-4 rounded border p-4 ${cor}`} role="alert" aria-label="Problemas na ficha">
      <button type="button" className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 text-left" aria-expanded={aberto} onClick={() => setAberto((v) => !v)}>
        <strong className={`text-[15px] uppercase tracking-[0.14em] ${erros ? 'text-perigo' : 'text-laranja'}`}>{erros ? '⚠ Tem coisa errada na ficha' : '⚠ Falta completar a ficha'}</strong>
        <span className="text-[14px] text-suave">{erros > 0 && `${erros} erro${erros > 1 ? 's' : ''}`}{erros > 0 && avisos > 0 && ' · '}{avisos > 0 && `${avisos} aviso${avisos > 1 ? 's' : ''}`}</span>
        <span className="ml-auto text-[13px] text-mudo">{aberto ? 'esconder ▴' : 'mostrar ▾'}</span>
      </button>
      {aberto && (
        <ul className="mt-3 space-y-2">
          {problemas.map((p, i) => (
            <li key={i} className="flex flex-wrap items-start gap-x-3 gap-y-1 text-[15px] leading-snug">
              <span className={p.nivel === 'erro' ? 'text-perigo' : 'text-laranja'} aria-hidden>{p.nivel === 'erro' ? '✕' : '!'}</span>
              <span className="min-w-0 basis-[calc(100%-2rem)] sm:flex-1 sm:basis-0">{p.texto}</span>
              <button type="button" className="btn btn-mini btn-fantasma ml-6 sm:ml-0" onClick={() => irPara(p.aba, p.alvo)}>corrigir em {ROTULO_ABA[p.aba]}</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
