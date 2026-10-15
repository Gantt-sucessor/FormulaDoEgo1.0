import { ARMAS } from '../data/armas.js';
import { OTICAS } from '../data/oticas.js';
import { CATALISADORES } from '../data/catalisadores.js';
import { NIVEL_MINIMO_CATALISADOR } from '../data/fluxo.js';
import { categoriaDe, tendenciaPrincipalDe, tendenciaSecundariaDe, nomePericia } from './ficha.js';

export const GRUPOS_PASSIVAS = [
  { id: 'arma', rotulo: 'Da arma' },
  { id: 'otica', rotulo: 'Ótica' },
  { id: 'tendencia', rotulo: 'Tendências' },
  { id: 'catalisador', rotulo: 'Catalisador' },
  { id: 'nivel', rotulo: 'Nível e categoria' },
];

const RECOMPENSA6 = {
  distancia_chute: '+1 m na distância de chute (já somado na mesa).',
  distancia_passe: '+1 m na distância de passe (já somado na mesa).',
  folego: '+1 fôlego máximo (já somado nos fôlegos).',
};

/**
 * Tudo que o personagem TEM sempre ligado (sem gastar ação) ou que só descreve a arma/ótica/tendência dele,
 * para ficar na mesa e ninguém precisar abrir a aba Personagem no meio do jogo.
 * Cada item: { chave, grupo, rotulo, nome, texto, destaque? }
 */
export function listarPassivas(f) {
  const itens = [];
  const add = (grupo, rotulo, nome, texto, extra = {}) => {
    if (!texto) return;
    itens.push({ chave: `${grupo}:${rotulo}:${nome}`, grupo, rotulo, nome, texto, ...extra });
  };

  const arma = ARMAS.find((a) => a.id === f.armaId);
  if (arma) {
    add('arma', 'Capacidade', arma.mecanica_especial?.nome, arma.mecanica_especial?.texto);
    if (arma.efeito) add('arma', arma.efeito.acumulativo ? 'Efeito · acumula' : 'Efeito', arma.efeito.nome, arma.efeito.texto);
    if (arma.recurso) add('arma', 'Recurso', arma.recurso.nome, arma.recurso.texto);
    if (arma.jogada) {
      const j = arma.jogada;
      const stats = [j.pericia && `Perícia ${nomePericia(j.pericia)}`, j.dj != null && `Dj ${j.dj}`, j.distancia, j.acao].filter(Boolean).join(' · ');
      add('arma', 'Jogada exclusiva', j.nome, [stats, j.anormalidade].filter(Boolean).join('\n'));
    }
  }

  const otica = OTICAS.find((o) => o.id === f.oticaId);
  if (otica) {
    (f.visoes || []).slice().sort().forEach((n) => add('otica', `${otica.nome} · nível ${n}`, `Visão nível ${n}`, otica.niveis[n - 1]));
  }

  const principal = tendenciaPrincipalDe(f);
  if (principal?.dom) {
    const extra = f.tendPericia ? `\n+2 de bônus em ${nomePericia(f.tendPericia)} (já somado nas perícias).` : '';
    add('tendencia', `Dom · ${principal.nome}`, principal.dom.nome, principal.dom.texto + extra);
  }
  const secundaria = tendenciaSecundariaDe(f);
  if (secundaria?.passiva_secundaria) add('tendencia', `Passiva · ${secundaria.nome}`, secundaria.passiva_secundaria.nome, secundaria.passiva_secundaria.texto);

  const cat = CATALISADORES.find((c) => c.id === f.catalisador?.id);
  if (cat && f.nivel >= NIVEL_MINIMO_CATALISADOR) add('catalisador', cat.nome, cat.passiva?.nome, cat.passiva?.texto);

  const categoria = categoriaDe(f);
  const arq = categoria?.arquetipos.find((a) => a.id === f.arquetipoId);
  if (arq) add('nivel', `${categoria.nome} · arquétipo`, arq.nome, arq.descricao);
  if (f.recompensa6 && f.nivel >= 6) add('nivel', 'Recompensa do nível 6', 'Recompensa escolhida', RECOMPENSA6[f.recompensa6]);
  if (f.nivel >= 8) add('nivel', 'Recompensa do nível 8', 'Ação egoísta extra', '+1 ação egoísta por rodada (aparece em Turno e ações).');

  return itens;
}

