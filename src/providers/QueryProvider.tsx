import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  useEffect(() => {
    if (import.meta.env.DEV) {
      const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
      const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
      // Log somente em dev para diagnosticar envs carregadas pelo Vite
      console.info('[Env Check] VITE_SUPABASE_URL =', url);
      console.info(
        '[Env Check] VITE_SUPABASE_PUBLISHABLE_KEY prefix =',
        key ? key.slice(0, 8) + '…' : 'undefined'
      );
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
