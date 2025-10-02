import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useIncomeExpenseData = () => {
  return useQuery({
    queryKey: ['chart-data', 'income-expense'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vw_entradas_saidas_mensal')
        .select('*')
        .order('mes');
      
      if (error) throw error;
      
      return data.map((item: any) => ({
        mes: new Date(item.mes).toLocaleDateString('pt-BR', { month: 'short' }),
        entradas: Number(item.total_entradas || 0),
        saidas: Number(item.total_saidas || 0),
      }));
    },
  });
};

export const useCategoryData = () => {
  return useQuery({
    queryKey: ['chart-data', 'category'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vw_saidas_por_categoria')
        .select('*')
        .order('total_saidas', { ascending: false });
      
      if (error) throw error;
      
      const colors = [
        'hsl(var(--success))',
        'hsl(var(--danger))',
        'hsl(var(--warning))',
        'hsl(var(--info))',
        'hsl(var(--primary))',
        'hsl(var(--secondary))',
      ];
      
      return data.map((item: any, index: number) => ({
        name: item.categoria || 'Sem categoria',
        value: Number(item.total_saidas),
        fill: colors[index % colors.length],
      }));
    },
  });
};

export const useBalanceData = () => {
  return useQuery({
    queryKey: ['chart-data', 'balance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vw_saldo_diario')
        .select('*')
        .order('dia')
        .limit(30); // Últimos 30 dias
      
      if (error) throw error;
      
      return data.map((item: any) => ({
        dia: new Date(item.dia).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        saldo: Number(item.saldo_acumulado || 0),
      }));
    },
  });
};