import { Turno } from './mesa/Turno.jsx';
import { HabilidadesAtivas } from './mesa/HabilidadesAtivas.jsx';
import { TalentosMesa } from './mesa/TalentosMesa.jsx';
import { PassivasMesa } from './mesa/PassivasMesa.jsx';
import { Efeitos } from './mesa/Efeitos.jsx';
import { Jogadas } from './mesa/Jogadas.jsx';
import { FluxoMesa } from './mesa/FluxoMesa.jsx';
import { CatalisadorMesa } from './mesa/CatalisadorMesa.jsx';
import { Distancias } from './mesa/Recursos.jsx';
import { Secao } from './ui.jsx';
import { FiltroMesa, SECOES_PADRAO } from './mesa/FiltroMesa.jsx';
import { getSecoesMesa, setSecoesMesa } from '../lib/local.js';
import { useState } from 'react';
import { useAuth } from '../lib/auth.jsx';

/** Tudo que se usa durante a partida, na ordem em que acontece: turno → habilidades → efeitos → jogadas. */
export function AbaMesa({ ficha, toast, abrirFita }) {
  const { f, atualizar, registrar, rolar, existe, campanha } = ficha;
  const { usuario } = useAuth();
  const [visiveis, setVisiveis] = useState(() => getSecoesMesa() || SECOES_PADRAO);
  const escolher = (lista) => { setVisiveis(lista); setSecoesMesa(lista); };
  const ver = (id) => visiveis.includes(id);
  // Em campanha, rodada e turno são do mestre (criador). Ficha solta (sem campanha) segue livre.
  const somenteMestre = !!campanha && !(usuario?.id && campanha.criador_id === usuario.id);
  return (
    <div className="space-y-4">
      {!existe && (
        <p className="rounded border border-laranja/50 bg-laranja/10 p-3 text-[15px] text-laranja">
          Essa ficha ainda não foi criada. Vá na aba <strong>Personagem</strong>, dê um nome e clique em <strong>Criar ficha</strong> — depois disso dá para rolar e usar habilidades.
        </p>
      )}
      <FiltroMesa visiveis={visiveis} onChange={escolher} />
      {ver('turno') && <Turno f={f} atualizar={atualizar} registrar={registrar} toast={toast} somenteMestre={somenteMestre} />}
      {ver('habilidades') && <HabilidadesAtivas f={f} atualizar={atualizar} registrar={registrar} toast={toast} existe={existe} />}
      {ver('talentos') && <TalentosMesa f={f} atualizar={atualizar} registrar={registrar} toast={toast} existe={existe} />}
      {ver('passivas') && <PassivasMesa f={f} />}
      {ver('efeitos') && <Efeitos f={f} atualizar={atualizar} />}
      {ver('jogadas') && <Jogadas f={f} rolar={rolar} atualizar={atualizar} toast={toast} existe={existe} abrirFita={abrirFita} />}
      {ver('distancias') && <Secao titulo="Distâncias e iniciativa"><Distancias f={f} atualizar={atualizar} /></Secao>}
      {(ver('fluxo') || ver('catalisador')) && (
        <div className="grid gap-4 lg:grid-cols-2">
          {ver('fluxo') && <FluxoMesa f={f} atualizar={atualizar} registrar={registrar} toast={toast} />}
          {ver('catalisador') && <CatalisadorMesa f={f} atualizar={atualizar} registrar={registrar} toast={toast} />}
        </div>
      )}
      {visiveis.length === 0 && <p className="py-8 text-center text-[15px] text-mudo">Nada marcado. Abra “O que mostrar na mesa” e escolha as seções, ou toque em <strong>Combate</strong>.</p>}
    </div>
  );
}
