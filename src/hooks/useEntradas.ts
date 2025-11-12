import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DateRange } from 'react-day-picker';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type Entrada = {
  id: number;
  data: string;
  descricao?: string;
  valor: number;
  categoria_id?: number;
  created_at: string;
};

export type NovaEntrada = {
  data: string;
  descricao?: string;
  valor: number;
  categoria_id?: number;
};

export const useEntradas = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ['entradas', dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      let query = supabase
        .from('entradas')
        .select(`
          *,
          categorias(nome, cor_hex)
        `)
        .order('data', { ascending: false });
      
      if (dateRange?.from && dateRange?.to) {
        const startDate = `${dateRange.from.getFullYear()}-${String(dateRange.from.getMonth() + 1).padStart(2, '0')}-${String(dateRange.from.getDate()).padStart(2, '0')}`;
        const endDate = `${dateRange.to.getFullYear()}-${String(dateRange.to.getMonth() + 1).padStart(2, '0')}-${String(dateRange.to.getDate()).padStart(2, '0')}`;
        
        query = query
          .gte('data', startDate)
          .lte('data', endDate);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as (Entrada & { categorias?: { nome: string; cor_hex?: string } })[];
    },
  });
};

export const useEntradasSummary = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ['entradas-summary', dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      let query = supabase.from('entradas').select('valor');
      
      // Filter by date range if provided
      if (dateRange?.from && dateRange?.to) {
        const startDate = `${dateRange.from.getFullYear()}-${String(dateRange.from.getMonth() + 1).padStart(2, '0')}-${String(dateRange.from.getDate()).padStart(2, '0')}`;
        const endDate = `${dateRange.to.getFullYear()}-${String(dateRange.to.getMonth() + 1).padStart(2, '0')}-${String(dateRange.to.getDate()).padStart(2, '0')}`;
        
        query = query
          .gte('data', startDate)
          .lte('data', endDate);
      } else if (dateRange?.from) {
        // Only from date provided
        const startDate = `${dateRange.from.getFullYear()}-${String(dateRange.from.getMonth() + 1).padStart(2, '0')}-${String(dateRange.from.getDate()).padStart(2, '0')}`;
        query = query.gte('data', startDate);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      const total = data.reduce((sum, entrada) => sum + Number(entrada.valor), 0);
      const count = data.length;
      const average = count > 0 ? total / count : 0;
      
      return { total, count, average };
    },
  });
};

export const useCreateEntrada = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (entrada: NovaEntrada) => {
      const { data, error } = await supabase
        .from('entradas')
        .insert(entrada)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entradas'] });
      queryClient.invalidateQueries({ queryKey: ['entradas-summary'] });
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

export const useUpdateEntrada = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Entrada> & { id: number }) => {
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
      queryClient.invalidateQueries({ queryKey: ['entradas'] });
      queryClient.invalidateQueries({ queryKey: ['entradas-summary'] });
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

export const useDeleteEntrada = () => {
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
      queryClient.invalidateQueries({ queryKey: ['entradas'] });
      queryClient.invalidateQueries({ queryKey: ['entradas-summary'] });
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