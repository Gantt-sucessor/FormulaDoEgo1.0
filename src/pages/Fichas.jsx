import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../lib/auth.jsx';
import { useToast } from '../lib/toast.jsx';
import { Link, useRouter } from '../lib/router.jsx';
import { Pagina } from '../components/Layout.jsx';
import { ListaFichas } from '../components/ListaFichas.jsx';
import { Confirmar } from '../components/ui.jsx';
import { apagarFicha, listarTodasFichasDoJogador, vincularFichaACampanha } from '../api/fichas.js';
import { criarCampanha, entrarNaCampanha } from '../api/campanhas.js';
import { getNomeSalvo, getUltimoCodigoSalvo, setNomeSalvo, setUltimoCodigoSalvo } from '../lib/local.js';

export default function Fichas() {
  const { usuario } = useAuth();
  const toast = useToast();
  const { params, ir } = useRouter();
  const codigoNaUrl = (params.get('codigo') || '').toUpperCase();
  const [nome, setNome] = useState(getNomeSalvo);
  const [codigo, setCodigo] = useState(codigoNaUrl || getUltimoCodigoSalvo());
  const [nomeSala, setNomeSala] = useState('');
  const [campanha, setCampanha] = useState(null);
  const [fichas, setFichas] = useState([]);
  const [erro, setErro] = useState('');

  const carregar = useCallback(() => listarTodasFichasDoJogador(usuario.id).then(setFichas).catch(() => setFichas([])), [usuario.id]);
  useEffect(() => { carregar(); }, [carregar]);
  useEffect(() => {
    if (!codigoNaUrl) { setCampanha(null); return; }
    entrarNaCampanha(codigoNaUrl).then(setCampanha).catch((e) => { setErro(e.message); setCampanha(null); });
  }, [codigoNaUrl]);

  const entrar = async () => {
    setErro('');
    if (!codigo.trim()) return setErro('Digite o código da campanha.');
    try {
      const c = await entrarNaCampanha(codigo);
      setNomeSalvo(nome.trim()); setUltimoCodigoSalvo(c.codigo);
      toast('Campanha adicionada com sucesso!');
      return ir(`/fichas?codigo=${c.codigo}`);
    } catch (e) { return setErro(e.message); }
  };

  const criarSala = async () => {
    setErro('');
    if (!nome.trim()) return setErro('Preencha seu nome antes de criar a sala.');
    if (!nomeSala.trim()) return setErro('Dê um nome à sua sala.');
    try {
      setNomeSalvo(nome.trim());
      const c = await criarCampanha(nomeSala.trim(), nome.trim(), usuario.id);
      setUltimoCodigoSalvo(c.codigo);
      toast('Sala criada com sucesso!');
      ir(`/fichas?codigo=${c.codigo}`);
    } catch { setErro('Não deu pra criar a sala. Confira a configuração do Supabase.'); }
  };

  const apagar = async (f) => {
    if (!Confirmar(`Apagar a ficha "${f.nome_personagem}" de vez? Essa ação não pode ser desfeita.`)) return;
    try { await apagarFicha(f.id); toast('Ficha apagada.'); carregar(); } catch (e) { toast(e.message, 'erro'); }
  };
  const adicionar = async (f) => {
    try { await vincularFichaACampanha(f.id, campanha.id); toast('Ficha adicionada à campanha!'); carregar(); } catch (e) { toast(e.message, 'erro'); }
  };

  const daCampanha = campanha ? fichas.filter((f) => f.campanha_id === campanha.id) : [];
  const soltas = fichas.filter((f) => !f.campanha_id);
  const outras = campanha ? fichas.filter((f) => f.campanha_id && f.campanha_id !== campanha.id) : fichas.filter((f) => f.campanha_id);

  return (
    <Pagina>
      <h1 className="titulo-pagina mb-5">{campanha ? campanha.nome : 'Fichas e salas'}</h1>
      {campanha && (
        <div className="painel painel-neon mb-4 flex flex-wrap items-center justify-between gap-3">
          <div><div className="legenda">Código da sala</div><div className="text-2xl font-bold tracking-[0.3em] text-ciano glow-ciano">{campanha.codigo}</div></div>
          <div className="flex gap-2">
            <Link para={`/sala/${campanha.codigo}`} className="btn">Abrir sala ao vivo</Link>
            <Link para={`/ficha/nova?codigo=${campanha.codigo}`} className="btn btn-primario">Nova ficha aqui</Link>
          </div>
        </div>
      )}

      {!campanha && (
        <div className="grid gap-4 sm:grid-cols-2">
          <section className="painel space-y-3">
            <span className="titulo-caixa">Entrar numa sala</span>
            <label className="block"><span className="campo-label">Seu nome</span><input className="entrada" value={nome} onChange={(e) => setNome(e.target.value)} /></label>
            <label className="block"><span className="campo-label">Código da campanha</span>
              <input className="entrada text-center text-lg uppercase tracking-[0.3em]" maxLength={6} placeholder="EX: 7K2QXP" value={codigo} onChange={(e) => setCodigo(e.target.value.toUpperCase())} /></label>
            <button type="button" className="btn btn-primario w-full" onClick={entrar}>Entrar</button>
          </section>
          <section className="painel space-y-3">
            <span className="titulo-caixa">Criar uma sala</span>
            <p className="text-[12px] text-suave">Quem cria a sala vira o mestre: acompanha fichas e rolagens em tempo real.</p>
            <label className="block"><span className="campo-label">Nome da sala</span><input className="entrada" placeholder="ex: Blue Lock — Segunda Seleção" value={nomeSala} onChange={(e) => setNomeSala(e.target.value)} /></label>
            <button type="button" className="btn btn-ouro w-full" onClick={criarSala}>Criar sala</button>
          </section>
        </div>
      )}
      {erro && <p role="alert" className="mt-3 text-[13px] text-perigo">{erro}</p>}

      <section className="painel mt-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="titulo-caixa">{campanha ? 'Minhas fichas nesta campanha' : 'Fichas soltas'}</span>
          {!campanha && <Link para="/ficha/nova" className="btn btn-mini btn-primario">+ Nova ficha</Link>}
        </div>
        <ListaFichas fichas={campanha ? daCampanha : soltas} aoApagar={apagar} mostrarCampanha={false} />
      </section>
      {campanha && soltas.length > 0 && (
        <section className="painel mt-4">
          <span className="titulo-caixa mb-3 inline-block">Adicionar ficha solta a esta campanha</span>
          <ListaFichas fichas={soltas} aoAdicionar={adicionar} mostrarCampanha={false} />
        </section>
      )}
      {outras.length > 0 && (
        <section className="painel mt-4"><span className="titulo-caixa mb-3 inline-block">Em outras campanhas</span><ListaFichas fichas={outras} aoApagar={apagar} /></section>
      )}
    </Pagina>
  );
}
