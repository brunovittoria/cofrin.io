import { useQuery } from '@tanstack/react-query';
import { DateRange } from 'react-day-picker';
import { supabase } from '@/integrations/supabase/client';

// Helper function to format date without timezone conversion
const formatDateToLocal = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const useIncomeExpenseData = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ['chart-data', 'income-expense', dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      let query = supabase
        .from('vw_entradas_saidas_mensal')
        .select('*')
        .order('mes');
      
      // Filter by date range if provided
      if (dateRange?.from && dateRange?.to) {
        const startDate = formatDateToLocal(dateRange.from);
        const endDate = formatDateToLocal(dateRange.to);
        
        query = query
          .gte('mes', startDate)
          .lte('mes', endDate);
      } else if (dateRange?.from) {
        const startDate = formatDateToLocal(dateRange.from);
        query = query.gte('mes', startDate);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data.map((item: any) => ({
        mes: new Date(item.mes).toLocaleDateString('pt-BR', { month: 'short' }),
        entradas: Number(item.total_entradas || 0),
        saidas: Number(item.total_saidas || 0),
      }));
    },
  });
};

export const useCategoryData = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ['chart-data', 'category', dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      // For category data, we need to query the saidas table directly if filtering by date range
      // since views might not support filtering
      if (dateRange?.from && dateRange?.to) {
        const startDate = formatDateToLocal(dateRange.from);
        const endDate = formatDateToLocal(dateRange.to);
        
        const { data, error } = await supabase
          .from('saidas')
          .select(`
            valor,
            categoria_id,
            categorias(nome)
          `)
          .gte('data', startDate)
          .lte('data', endDate);
        
        if (error) throw error;
        
        // Group by category
        const categoryMap = new Map<string, number>();
        data.forEach((item: any) => {
          const categoryName = item.categorias?.nome || 'Sem categoria';
          const currentValue = categoryMap.get(categoryName) || 0;
          categoryMap.set(categoryName, currentValue + Number(item.valor || 0));
        });
        
        const colors = [
          'hsl(var(--success))',
          'hsl(var(--danger))',
          'hsl(var(--warning))',
          'hsl(var(--info))',
          'hsl(var(--primary))',
          'hsl(var(--secondary))',
        ];
        
        return Array.from(categoryMap.entries())
          .map(([name, value], index) => ({
            name,
            value,
            fill: colors[index % colors.length],
          }))
          .sort((a, b) => b.value - a.value);
      } else if (dateRange?.from) {
        // Only from date provided
        const startDate = formatDateToLocal(dateRange.from);
        
        const { data, error } = await supabase
          .from('saidas')
          .select(`
            valor,
            categoria_id,
            categorias(nome)
          `)
          .gte('data', startDate);
        
        if (error) throw error;
        
        // Group by category
        const categoryMap = new Map<string, number>();
        data.forEach((item: any) => {
          const categoryName = item.categorias?.nome || 'Sem categoria';
          const currentValue = categoryMap.get(categoryName) || 0;
          categoryMap.set(categoryName, currentValue + Number(item.valor || 0));
        });
        
        const colors = [
          'hsl(var(--success))',
          'hsl(var(--danger))',
          'hsl(var(--warning))',
          'hsl(var(--info))',
          'hsl(var(--primary))',
          'hsl(var(--secondary))',
        ];
        
        return Array.from(categoryMap.entries())
          .map(([name, value], index) => ({
            name,
            value,
            fill: colors[index % colors.length],
          }))
          .sort((a, b) => b.value - a.value);
      } else {
        // Use view when no filter
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
      }
    },
  });
};

export const useBalanceData = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ['chart-data', 'balance', dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      let query = supabase
        .from('vw_saldo_diario')
        .select('*')
        .order('dia');
      
      // Filter by date range if provided
      if (dateRange?.from && dateRange?.to) {
        const startDate = formatDateToLocal(dateRange.from);
        const endDate = formatDateToLocal(dateRange.to);
        
        query = query
          .gte('dia', startDate)
          .lte('dia', endDate);
      } else if (dateRange?.from) {
        // Only from date provided
        const startDate = formatDateToLocal(dateRange.from);
        query = query.gte('dia', startDate);
      } else {
        // Limit to last 30 days if no filter
        query = query.limit(30);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data.map((item: any) => ({
        dia: new Date(item.dia).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        saldo: Number(item.saldo_acumulado || 0),
      }));
    },
  });
};