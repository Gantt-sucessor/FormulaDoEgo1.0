import { Turno } from './mesa/Turno.jsx';
import { HabilidadesAtivas } from './mesa/HabilidadesAtivas.jsx';
import { Efeitos } from './mesa/Efeitos.jsx';
import { Jogadas } from './mesa/Jogadas.jsx';
import { FluxoMesa } from './mesa/FluxoMesa.jsx';
import { CatalisadorMesa } from './mesa/CatalisadorMesa.jsx';
import { Distancias } from './mesa/Recursos.jsx';
import { Secao } from './ui.jsx';

/** Tudo que se usa durante a partida, na ordem em que acontece: turno → habilidades → efeitos → jogadas. */
export function AbaMesa({ ficha, toast, abrirFita }) {
  const { f, atualizar, registrar, rolar, existe } = ficha;
  return (
    <div className="space-y-4">
      {!existe && (
        <p className="rounded border border-laranja/50 bg-laranja/10 p-3 text-[13px] text-laranja">
          Essa ficha ainda não foi criada. Vá na aba <strong>Personagem</strong>, dê um nome e clique em <strong>Criar ficha</strong> — depois disso dá para rolar e usar habilidades.
        </p>
      )}
      <Turno f={f} atualizar={atualizar} registrar={registrar} toast={toast} />
      <HabilidadesAtivas f={f} atualizar={atualizar} registrar={registrar} toast={toast} existe={existe} />
      <Efeitos f={f} atualizar={atualizar} />
      <Jogadas f={f} rolar={rolar} toast={toast} existe={existe} abrirFita={abrirFita} />
      <Secao titulo="Distâncias e iniciativa"><Distancias f={f} atualizar={atualizar} /></Secao>
      <div className="grid gap-4 lg:grid-cols-2">
        <FluxoMesa f={f} atualizar={atualizar} registrar={registrar} toast={toast} />
        <CatalisadorMesa f={f} atualizar={atualizar} registrar={registrar} toast={toast} />
      </div>
    </div>
  );
}
