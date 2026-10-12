import { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth.jsx';
import { useToast } from '../lib/toast.jsx';
import { Link, useRouter } from '../lib/router.jsx';
import { Pagina } from '../components/Layout.jsx';
import { PainelAoVivo } from '../components/PainelAoVivo.jsx';
import { entrarNaCampanha } from '../api/campanhas.js';
import { getUltimoCodigoSalvo, setUltimoCodigoSalvo } from '../lib/local.js';

/** Sala compartilhada: todo mundo vê as fichas e as rolagens, em tempo real. */
export default function Sala({ codigo }) {
  const { usuario } = useAuth();
  const toast = useToast();
  const { ir } = useRouter();
  const [campanha, setCampanha] = useState(null);
  const [digitado, setDigitado] = useState(getUltimoCodigoSalvo());
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!codigo) { setCampanha(null); return; }
    entrarNaCampanha(codigo).then((c) => { setCampanha(c); setUltimoCodigoSalvo(c.codigo); setErro(''); }).catch((e) => setErro(e.message));
  }, [codigo]);

  if (!codigo || !campanha) {
    return (
      <Pagina>
        <div className="painel mx-auto max-w-md space-y-3">
          <span className="titulo-caixa">Sala</span>
          <p className="text-[13px] text-suave">Aqui todo mundo vê as fichas e as rolagens de todo mundo, em tempo real.</p>
          <label className="block"><span className="campo-label">Código da sala</span>
            <input className="entrada text-center text-lg uppercase tracking-[0.3em]" maxLength={6} value={digitado} onChange={(e) => setDigitado(e.target.value.toUpperCase())} placeholder="EX: 7K2QXP" /></label>
          <button type="button" className="btn btn-primario w-full" onClick={() => digitado && ir(`/sala/${digitado}`)}>Entrar</button>
          {erro && <p className="text-[13px] text-perigo" role="alert">{erro}</p>}
          <p className="text-[12px] text-mudo">Ainda não tem uma sala? <Link para="/fichas" className="text-ciano">Crie uma na tela de fichas</Link>.</p>
        </div>
      </Pagina>
    );
  }

  const souMestre = campanha.criador_id ? campanha.criador_id === usuario.id : false;
  return (
    <Pagina larga>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="legenda">Sala aberta</div>
          <h1 className="titulo-pagina">{campanha.nome}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right"><div className="legenda">Código</div><div className="text-xl font-bold tracking-[0.3em] text-ciano">{campanha.codigo}</div></div>
          <button type="button" className="btn btn-mini" onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/sala/${campanha.codigo}`).then(() => toast('Link da sala copiado!')); }}>Copiar link</button>
          {souMestre && <Link para={`/mestre/${campanha.codigo}`} className="btn btn-mini btn-ouro">Painel do mestre</Link>}
        </div>
      </div>
      <PainelAoVivo campanha={campanha} mestre={false} />
    </Pagina>
  );
}
