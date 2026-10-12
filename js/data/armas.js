// Fórmula do Ego — Armas (classes), transcritas do livro (páginas 160–314).
// Cada personagem escolhe 1 arma, fixa após a escolha. Os dados ficam divididos em 3 arquivos
// só por tamanho; este módulo os junta mantendo a ordem e os ids originais.
//
// Estrutura de cada arma:
//   id, nome, dificuldade (1–5 ★), tema (texto de abertura do livro)
//   desbloqueia  — linha "Desbloqueia ..." do livro
//   mecanica_especial {nome, texto}
//   efeito / recurso / jogada — opcionais (efeito próprio, contador de classe, jogada exclusiva)
//   habilidades[4] — sem bola / com bola / variante / fluxo, com esf, dis, dur, tda, gex, prep, texto

import { ARMAS_A } from './armas-a.js';
import { ARMAS_B } from './armas-b.js';
import { ARMAS_C } from './armas-c.js';

export const ARMAS = [...ARMAS_A, ...ARMAS_B, ...ARMAS_C];
