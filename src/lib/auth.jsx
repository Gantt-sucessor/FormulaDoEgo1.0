import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase.js';

const AuthCtx = createContext({ usuario: null, carregando: true, sair: async () => {} });

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let vivo = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!vivo) return;
      setUsuario(data.session?.user ?? null);
      setCarregando(false);
    });
    const { data: assinatura } = supabase.auth.onAuthStateChange((_evento, sessao) => {
      setUsuario(sessao?.user ?? null);
    });
    return () => { vivo = false; assinatura.subscription.unsubscribe(); };
  }, []);

  const sair = async () => { await supabase.auth.signOut(); setUsuario(null); };
  return <AuthCtx.Provider value={{ usuario, carregando, sair }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
