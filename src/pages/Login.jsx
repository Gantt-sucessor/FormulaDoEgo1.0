import { useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { Logo } from '../components/Layout.jsx';

export default function Login() {
  const [cadastro, setCadastro] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [msg, setMsg] = useState('');
  const [ocupado, setOcupado] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setOcupado(true); setMsg('');
    const r = cadastro
      ? await supabase.auth.signUp({ email: email.trim(), password: senha, options: { emailRedirectTo: window.location.origin } })
      : await supabase.auth.signInWithPassword({ email: email.trim(), password: senha });
    setOcupado(false);
    if (r.error) {
      setMsg(/rate limit/i.test(r.error.message) ? 'Muitas tentativas com esse e-mail. Espere alguns minutos e tente novamente.' : r.error.message);
      return;
    }
    if (cadastro && !r.data.session) { setMsg('Conta criada. Confirme seu e-mail e depois entre.'); setCadastro(false); setSenha(''); }
  };

  return (
    <div className="pt-seguro flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="mb-8 text-center">
        <div className="legenda mb-3">Sistema de RPG · versão 1.0</div>
        <h1 className="text-[clamp(34px,10vw,64px)] font-bold uppercase leading-[1.05] tracking-[0.18em] glow-azul">
          Fórmula<br />do <span className="text-ciano glow-ciano">Ego</span>
        </h1>
      </div>
      <form onSubmit={enviar} className="painel painel-neon w-full max-w-sm space-y-4">
        <div className="titulo-caixa">{cadastro ? 'Criar conta' : 'Entrar na arena'}</div>
        <label className="block"><span className="campo-label">E-mail</span>
          <input className="entrada" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="block"><span className="campo-label">Senha</span>
          <input className="entrada" type="password" autoComplete={cadastro ? 'new-password' : 'current-password'} minLength={8} required value={senha} onChange={(e) => setSenha(e.target.value)} /></label>
        <button className="btn btn-primario w-full" disabled={ocupado}>{ocupado ? 'Aguarde…' : cadastro ? 'Criar conta' : 'Entrar'}</button>
        <button type="button" className="w-full text-center text-[12px] uppercase tracking-[0.14em] text-suave hover:text-ciano" onClick={() => { setCadastro(!cadastro); setMsg(''); }}>
          {cadastro ? 'Já tenho uma conta' : 'Criar conta'}
        </button>
        {msg && <p role="status" className="text-[12px] text-laranja">{msg}</p>}
      </form>
      <div className="mt-8 opacity-60"><Logo /></div>
    </div>
  );
}
