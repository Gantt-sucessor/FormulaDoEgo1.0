import { createContext, useCallback, useContext, useState } from 'react';

const ToastCtx = createContext(() => {});

export function ToastProvider({ children }) {
  const [itens, setItens] = useState([]);
  const mostrar = useCallback((mensagem, tipo = 'sucesso') => {
    const id = Math.random().toString(36).slice(2);
    setItens((l) => [...l, { id, mensagem, tipo }]);
    setTimeout(() => setItens((l) => l.filter((i) => i.id !== id)), tipo === 'erro' ? 4500 : 2800);
  }, []);
  return (
    <ToastCtx.Provider value={mostrar}>
      {children}
      <div className="toast-caixa" aria-live="polite">
        {itens.map((i) => <div key={i.id} className={`toast ${i.tipo === 'erro' ? 'erro' : ''}`}>{i.mensagem}</div>)}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
