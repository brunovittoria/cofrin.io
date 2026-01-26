import { useQuery } from '@tanstack/react-query';
import { DateRange } from 'react-day-picker';
import { supabase } from '@/integrations/supabase/client';
import { toLocalDateString } from '@/lib/formatters';

export const useIncomeExpenseData = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ['chart-data', 'income-expense', dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      let query = supabase
        .from('vw_monthly_income_expense')
        .select('*')
        .order('month');
      
      // Filter by date range if provided
      if (dateRange?.from && dateRange?.to) {
        const startDate = toLocalDateString(dateRange.from);
        const endDate = toLocalDateString(dateRange.to);
        query = query.gte('month', startDate).lte('month', endDate);
      } else if (dateRange?.from) {
        const startDate = toLocalDateString(dateRange.from);
        query = query.gte('month', startDate);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data.map((item: any) => ({
        mes: new Date(item.month).toLocaleDateString('pt-BR', { month: 'short' }),
        entradas: Number(item.total_incomes || 0),
        saidas: Number(item.total_expenses || 0),
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
        const startDate = toLocalDateString(dateRange.from);
        const endDate = toLocalDateString(dateRange.to);
        
        const { data, error } = await supabase
          .from('expenses')
          .select(`
            amount,
            category_id,
            categories(name)
          `)
          .gte('date', startDate)
          .lte('date', endDate);
        
        if (error) throw error;
        
        // Group by category
        const categoryMap = new Map<string, number>();
        data.forEach((item: any) => {
          const categoryName = item.categories?.name || 'Sem categoria';
          const currentValue = categoryMap.get(categoryName) || 0;
          categoryMap.set(categoryName, currentValue + Number(item.amount || 0));
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
        const startDate = toLocalDateString(dateRange.from);
        
        const { data, error } = await supabase
          .from('expenses')
          .select(`
            amount,
            category_id,
            categories(name)
          `)
          .gte('date', startDate);
        
        if (error) throw error;
        
        // Group by category
        const categoryMap = new Map<string, number>();
        data.forEach((item: any) => {
          const categoryName = item.categories?.name || 'Sem categoria';
          const currentValue = categoryMap.get(categoryName) || 0;
          categoryMap.set(categoryName, currentValue + Number(item.amount || 0));
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
          .from('vw_expenses_by_category')
          .select('*')
          .order('total_expenses', { ascending: false });
        
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
          name: item.category || 'Sem categoria',
          value: Number(item.total_expenses),
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
        .from('vw_daily_balance')
        .select('*')
        .order('day');
      
      // Filter by date range if provided
      if (dateRange?.from && dateRange?.to) {
        const startDate = toLocalDateString(dateRange.from);
        const endDate = toLocalDateString(dateRange.to);
        query = query.gte('day', startDate).lte('day', endDate);
      } else if (dateRange?.from) {
        // Only from date provided
        const startDate = toLocalDateString(dateRange.from);
        query = query.gte('day', startDate);
      } else {
        // Limit to last 30 days if no filter
        query = query.limit(30);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data.map((item: any) => ({
        dia: new Date(item.day).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        saldo: Number(item.accumulated_balance || 0),
      }));
    },
  });
};