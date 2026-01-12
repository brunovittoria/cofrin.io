import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DateRange } from 'react-day-picker';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toLocalDateString } from '@/lib/formatters';
import { getPreviousMonthRange } from '@/lib/trendUtils';

export type Income = {
  id: number;
  data: string;
  descricao?: string;
  valor: number;
  categoria_id?: number;
  created_at: string;
};

export type NewIncome = {
  data: string;
  descricao?: string;
  valor: number;
  categoria_id?: number;
};

export const useIncomes = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ['incomes', dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      let query = supabase
        .from('entradas')
        .select(`
          *,
          categorias(nome, cor_hex)
        `)
        .order('data', { ascending: false });
      
      // Filter by date range if provided
      if (dateRange?.from && dateRange?.to) {
        const startDate = toLocalDateString(dateRange.from);
        const endDate = toLocalDateString(dateRange.to);
        query = query.gte('data', startDate).lte('data', endDate);
      } else if (dateRange?.from) {
        // Only from date provided
        const startDate = toLocalDateString(dateRange.from);
        query = query.gte('data', startDate);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as (Income & { categorias?: { nome: string; cor_hex?: string } })[];
    },
  });
};

export const useIncomesSummary = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ['incomes-summary', dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      let query = supabase.from('entradas').select('valor');
      
      // Filter by date range if provided
      if (dateRange?.from && dateRange?.to) {
        const startDate = toLocalDateString(dateRange.from);
        const endDate = toLocalDateString(dateRange.to);
        query = query.gte('data', startDate).lte('data', endDate);
      } else if (dateRange?.from) {
        // Only from date provided
        const startDate = toLocalDateString(dateRange.from);
        query = query.gte('data', startDate);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      const total = data.reduce((sum, income) => sum + Number(income.valor), 0);
      const count = data.length;
      const average = count > 0 ? total / count : 0;
      
      return { total, count, average };
    },
  });
};

export const useIncomesSummaryPreviousMonth = (dateRange?: DateRange) => {
  const previousMonthRange = getPreviousMonthRange(dateRange);
  
  return useQuery({
    queryKey: ['incomes-summary-previous', previousMonthRange?.from?.toISOString(), previousMonthRange?.to?.toISOString()],
    queryFn: async () => {
      if (!previousMonthRange?.from || !previousMonthRange?.to) {
        return { total: 0, count: 0, average: 0 };
      }

      const startDate = toLocalDateString(previousMonthRange.from);
      const endDate = toLocalDateString(previousMonthRange.to);
      
      const { data, error } = await supabase
        .from('entradas')
        .select('valor')
        .gte('data', startDate)
        .lte('data', endDate);
      
      if (error) throw error;
      
      const total = data.reduce((sum, income) => sum + Number(income.valor), 0);
      const count = data.length;
      const average = count > 0 ? total / count : 0;
      
      return { total, count, average };
    },
    enabled: !!previousMonthRange?.from && !!previousMonthRange?.to,
  });
};

export const useCreateIncome = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (income: NewIncome) => {
      const { data, error } = await supabase
        .from('entradas')
        .insert(income)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      queryClient.invalidateQueries({ queryKey: ['incomes-summary'] });
      queryClient.invalidateQueries({ queryKey: ['chart-data'] });
      toast({
        title: "Entrada criada",
        description: "A entrada foi criada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar entrada",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateIncome = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Income> & { id: number }) => {
      const { data, error } = await supabase
        .from('entradas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      queryClient.invalidateQueries({ queryKey: ['incomes-summary'] });
      queryClient.invalidateQueries({ queryKey: ['chart-data'] });
      toast({
        title: "Entrada atualizada",
        description: "A entrada foi atualizada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar entrada",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteIncome = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('entradas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      queryClient.invalidateQueries({ queryKey: ['incomes-summary'] });
      queryClient.invalidateQueries({ queryKey: ['chart-data'] });
      toast({
        title: "Entrada excluída",
        description: "A entrada foi excluída com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir entrada",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
