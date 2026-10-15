import { useCallback, useEffect, useRef, useState } from 'react';
import { buscarFicha, criarFicha, atualizarFicha } from '../api/fichas.js';
import { entrarNaCampanha } from '../api/campanhas.js';
import { rolarEEnviar, buscarUltimasRolagens, registrarAcao } from '../api/rolagens.js';
import { camposParaBanco, fichaDoBanco, fichaVazia } from './ficha.js';
import { getNomeSalvo } from './local.js';

/**
 * Estado completo da ficha aberta: edição local, salvamento automático (600 ms depois da última
 * mudança), fita de rolagens da sessão e envio para a sala quando a ficha pertence a uma campanha.
 */
export function useFicha(idOuNova, usuario) {
  const nova = idOuNova === 'nova';
  const [f, setF] = useState(fichaVazia);
  const [registro, setRegistro] = useState(null);
  const [campanha, setCampanha] = useState(null);
  const [carregando, setCarregando] = useState(!nova);
  const [erroCarga, setErroCarga] = useState('');
  const [status, setStatus] = useState(nova ? 'nova' : 'salvo');
  const [historico, setHistorico] = useState([]);

  const fRef = useRef(f);
  const registroRef = useRef(null);
  const ultimoSalvo = useRef('');
  const timer = useRef(null);
  const fila = useRef(Promise.resolve());
  const pronto = useRef(false);
  fRef.current = f;
  registroRef.current = registro;

  // Carga inicial
  useEffect(() => {
    let vivo = true;
    pronto.current = false;
    (async () => {
      try {
        if (nova) {
          const codigo = new URLSearchParams(window.location.search).get('codigo');
          const camp = codigo ? await entrarNaCampanha(codigo).catch(() => null) : null;
          if (!vivo) return;
          setCampanha(camp);
          setF(fichaVazia());
          setRegistro(null);
          ultimoSalvo.current = '';
        } else {
          const row = await buscarFicha(idOuNova);
          if (!vivo) return;
          const estado = fichaDoBanco(row);
          setF(estado);
          setRegistro(row);
          setCampanha(row.campanhas || null);
          ultimoSalvo.current = JSON.stringify(camposParaBanco(estado));
          setStatus('salvo');
          if (row.campanha_id) {
            buscarUltimasRolagens(row.id, 12)
              .then((lista) => vivo && setHistorico(lista.map((r) => ({ jogada: r.jogada, resultado: r.resultado, detalhe: r.detalhe, hora: r.criada_em }))))
              .catch(() => {});
          }
        }
      } catch (e) {
        if (vivo) setErroCarga(e.message || 'Não achei essa ficha.');
      } finally {
        if (vivo) { setCarregando(false); setTimeout(() => { pronto.current = true; }, 0); }
      }
    })();
    return () => { vivo = false; clearTimeout(timer.current); };
  }, [idOuNova, nova]);

  const salvar = useCallback(async () => {
    const atual = fRef.current;
    const reg = registroRef.current;
    if (!reg?.id) return;
    const campos = camposParaBanco(atual);
    if (!campos.nome_personagem) { setStatus('sem-nome'); return; }
    const json = JSON.stringify(campos);
    if (json === ultimoSalvo.current) { setStatus('salvo'); return; }
    setStatus('salvando');
    try {
      const nova_ = await atualizarFicha(reg.id, campos);
      ultimoSalvo.current = json;
      setRegistro(nova_);
      setStatus(timer.current ? 'pendente' : 'salvo');
    } catch {
      setStatus('erro');
    }
  }, []);

  const agendar = useCallback(() => {
    clearTimeout(timer.current);
    setStatus('pendente');
    timer.current = setTimeout(() => {
      timer.current = null;
      fila.current = fila.current.then(salvar);
    }, 600);
  }, [salvar]);

  // Qualquer mudança no estado agenda o salvamento (depois que a ficha existe)
  useEffect(() => {
    if (!pronto.current || !registro?.id) return;
    if (JSON.stringify(camposParaBanco(f)) === ultimoSalvo.current) return;
    agendar();
  }, [f, registro?.id, agendar]);

  const salvarAgora = useCallback(async () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
      fila.current = fila.current.then(salvar);
    }
    await fila.current;
  }, [salvar]);

  useEffect(() => {
    const aoEsconder = () => { if (document.visibilityState === 'hidden') salvarAgora(); };
    document.addEventListener('visibilitychange', aoEsconder);
    return () => { document.removeEventListener('visibilitychange', aoEsconder); salvarAgora(); };
  }, [salvarAgora]);

  const atualizar = useCallback((patch) => {
    setF((atual) => ({ ...atual, ...(typeof patch === 'function' ? patch(atual) : patch) }));
  }, []);

  const criar = useCallback(async () => {
    const atual = fRef.current;
    if (!atual.nome.trim()) throw new Error('Dê um nome ao personagem antes de criar a ficha.');
    const nomeJogador = getNomeSalvo() || usuario?.email?.split('@')[0] || 'jogador';
    const row = await criarFicha({
      ...camposParaBanco(atual),
      campanha_id: campanha?.id || null,
      jogador_id: usuario?.id || null,
      nome_jogador: nomeJogador,
    });
    ultimoSalvo.current = JSON.stringify(camposParaBanco(atual));
    setRegistro(row);
    setCampanha(row.campanhas || campanha);
    setStatus('salvo');
    return row;
  }, [campanha, usuario]);

  const empurrarHistorico = (item) => setHistorico((h) => [item, ...h].slice(0, 60));

  const rolar = useCallback(async ({ nomeJogada, valorAtributo, valorPericia, atributoNome, periciaNome, vantagens = 0, desvantagens = 0, bonus = 0, notas = null }) => {
    const reg = registroRef.current;
    if (!reg?.id) throw new Error('Crie a ficha primeiro (aba Personagem → Criar ficha).');
    const resultado = await rolarEEnviar({
      campanhaId: reg.campanha_id || null, fichaId: reg.id, nomePersonagem: reg.nome_personagem,
      nomeJogada, valorAtributo, valorPericia, atributoNome, periciaNome, vantagens, desvantagens, bonus, notas,
    });
    empurrarHistorico({ jogada: nomeJogada, resultado: resultado.resultado, detalhe: resultado, hora: new Date().toISOString() });
    return resultado;
  }, []);

  const registrar = useCallback((nomeAcao, texto = '', detalhe = null) => {
    const reg = registroRef.current;
    empurrarHistorico({ jogada: nomeAcao, resultado: 0, detalhe: detalhe || { tipo: 'acao', texto }, hora: new Date().toISOString() });
    if (reg?.campanha_id) {
      registrarAcao({ campanhaId: reg.campanha_id, fichaId: reg.id, nomePersonagem: reg.nome_personagem, nomeAcao, texto }).catch(() => {});
    }
  }, []);

  const rolarAvulso = useCallback(({ nome, soma, texto }) => {
    const reg = registroRef.current;
    empurrarHistorico({ jogada: nome, resultado: soma, detalhe: { tipo: 'avulso', texto }, hora: new Date().toISOString() });
    if (reg?.campanha_id) {
      registrarAcao({ campanhaId: reg.campanha_id, fichaId: reg.id, nomePersonagem: reg.nome_personagem, nomeAcao: nome, texto: `Resultado: ${soma} — ${texto}` }).catch(() => {});
    }
  }, []);

  return { rolarAvulso, f, atualizar, registro, campanha, carregando, erroCarga, status, historico, setHistorico, criar, rolar, registrar, salvarAgora, existe: !!registro?.id, empurrarHistorico };
}
