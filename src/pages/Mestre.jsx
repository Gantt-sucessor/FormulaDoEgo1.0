import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../lib/auth.jsx';
import { useToast } from '../lib/toast.jsx';
import { Link, useRouter } from '../lib/router.jsx';
import { Pagina } from '../components/Layout.jsx';
import { PainelAoVivo } from '../components/PainelAoVivo.jsx';
import { Confirmar } from '../components/ui.jsx';
import { apagarCampanha, criarCampanha, entrarNaCampanha, listarCampanhasDoMestre } from '../api/campanhas.js';
import { getNomeSalvo, setNomeSalvo } from '../lib/local.js';

function Painel({ codigo }) {
  const toast = useToast();
  const { ir } = useRouter();
  const [campanha, setCampanha] = useState(null);
  const [erro, setErro] = useState('');
  useEffect(() => { entrarNaCampanha(codigo).then(setCampanha).catch((e) => setErro(e.message)); }, [codigo]);
  if (erro) return <Pagina><div className="painel text-center text-perigo">{erro}</div></Pagina>;
  if (!campanha) return <Pagina><p className="py-16 text-center text-mudo">Carregando…</p></Pagina>;

  const apagar = async () => {
    if (!Confirmar(`Apagar a campanha "${campanha.nome}" de vez? Isso apaga também todas as fichas, rolagens e o mapa dela. Essa ação não pode ser desfeita.`)) return;
    try { await apagarCampanha(campanha.id); toast('Campanha apagada.'); ir('/mestre'); } catch (e) { toast(e.message, 'erro'); }
  };
  return (
    <Pagina larga>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link para="/mestre" className="legenda text-ciano">← minhas campanhas</Link>
          <h1 className="titulo-pagina mt-1">{campanha.nome}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-right"><div className="legenda">Código para os jogadores</div><div className="text-2xl font-bold tracking-[0.3em] text-ouro">{campanha.codigo}</div></div>
          <button type="button" className="btn btn-mini" onClick={() => navigator.clipboard?.writeText(campanha.codigo).then(() => toast('Código copiado!'))}>Copiar</button>
          <button type="button" className="btn btn-mini btn-perigo" onClick={apagar}>Apagar campanha</button>
        </div>
      </div>
      <PainelAoVivo campanha={campanha} mestre />
    </Pagina>
  );
}

function Lista() {
  const { usuario } = useAuth();
  const toast = useToast();
  const { ir } = useRouter();
  const [nome, setNome] = useState(getNomeSalvo);
  const [nomeCampanha, setNomeCampanha] = useState('');
  const [campanhas, setCampanhas] = useState([]);
  const [erro, setErro] = useState('');

  const carregar = useCallback(() => {
    if (!nome.trim()) return setCampanhas([]);
    return listarCampanhasDoMestre(nome.trim()).then(setCampanhas).catch(() => setCampanhas([]));
  }, [nome]);
  useEffect(() => { carregar(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const criar = async () => {
    setErro('');
    if (!nome.trim()) return setErro('Preencha seu nome antes de criar a campanha.');
    if (!nomeCampanha.trim()) return setErro('Dê um nome à sua campanha.');
    try {
      setNomeSalvo(nome.trim());
      const c = await criarCampanha(nomeCampanha.trim(), nome.trim(), usuario.id);
      toast('Campanha criada com sucesso!');
      return ir(`/mestre/${c.codigo}`);
    } catch { return setErro('Não deu pra criar a campanha. Confira o Supabase.'); }
  };

  return (
    <Pagina>
      <div className="painel space-y-4">
        <div><div className="legenda text-ouro">Painel do mestre</div><h1 className="titulo-pagina">Suas campanhas</h1></div>
        <label className="block"><span className="campo-label">Seu nome</span>
          <input className="entrada" value={nome} onChange={(e) => setNome(e.target.value)} onBlur={() => { setNomeSalvo(nome.trim()); carregar(); }} /></label>
        {campanhas.length > 0 && (
          <ul className="space-y-2">
            {campanhas.map((c) => (
              <li key={c.id}><Link para={`/mestre/${c.codigo}`} className="cartao no-underline">
                <div className="text-[14px] font-bold uppercase tracking-[0.1em]">{c.nome}</div><div className="text-[11px] text-suave">código {c.codigo}</div>
              </Link></li>
            ))}
          </ul>
        )}
        <hr className="border-linha" />
        <p className="text-[13px] text-suave">Dê um nome para uma campanha nova. Um código é gerado para você compartilhar com os jogadores.</p>
        <label className="block"><span className="campo-label">Nome da campanha</span>
          <input className="entrada" placeholder="ex: Blue Lock — Segunda Seleção" value={nomeCampanha} onChange={(e) => setNomeCampanha(e.target.value)} /></label>
        <button type="button" className="btn btn-ouro w-full" onClick={criar}>Criar campanha</button>
        {erro && <p role="alert" className="text-[13px] text-perigo">{erro}</p>}
      </div>
    </Pagina>
  );
}

export default function Mestre({ codigo }) {
  return codigo ? <Painel codigo={codigo} /> : <Lista />;
}
