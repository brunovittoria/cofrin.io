import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toLocalDateString } from "@/lib/formatters";
import { getPreviousMonthRange } from "@/lib/trendUtils";

export type Saida = {
  id: number;
  data: string;
  descricao?: string;
  valor: number;
  categoria_id?: number;
  created_at: string;
  categorias?: {
    id: number;
    nome: string;
    cor_hex: string | null;
  } | null;
};

export type NovaSaida = {
  data: string;
  descricao?: string;
  valor: number;
  categoria_id?: number;
};

export const useSaidas = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: [
      "saidas",
      dateRange?.from?.toISOString(),
      dateRange?.to?.toISOString(),
    ],
    queryFn: async () => {
      let query = supabase
        .from("saidas")
        .select("*, categorias(id, nome, cor_hex)")
        .order("data", { ascending: false });

      // Filter by date range if provided
      if (dateRange?.from && dateRange?.to) {
        const startDate = toLocalDateString(dateRange.from);
        const endDate = toLocalDateString(dateRange.to);
        query = query.gte("data", startDate).lte("data", endDate);
      } else if (dateRange?.from) {
        // Only from date provided
        const startDate = toLocalDateString(dateRange.from);
        query = query.gte("data", startDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });
};

export const useSaidasSummary = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: [
      "saidas-summary",
      dateRange?.from?.toISOString(),
      dateRange?.to?.toISOString(),
    ],
    queryFn: async () => {
      let query = supabase.from("saidas").select("valor");

      // Filter by date range if provided
      if (dateRange?.from && dateRange?.to) {
        const startDate = toLocalDateString(dateRange.from);
        const endDate = toLocalDateString(dateRange.to);
        query = query.gte("data", startDate).lte("data", endDate);
      } else if (dateRange?.from) {
        // Only from date provided
        const startDate = toLocalDateString(dateRange.from);
        query = query.gte("data", startDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      const total = data.reduce((sum, saida) => sum + Number(saida.valor), 0);
      const count = data.length;
      const average = count > 0 ? total / count : 0;

      return { total, count, average };
    },
  });
};

export const useSaidasSummaryPreviousMonth = (dateRange?: DateRange) => {
  const previousMonthRange = getPreviousMonthRange(dateRange);
  
  return useQuery({
    queryKey: [
      "saidas-summary-previous",
      previousMonthRange?.from?.toISOString(),
      previousMonthRange?.to?.toISOString(),
    ],
    queryFn: async () => {
      if (!previousMonthRange?.from || !previousMonthRange?.to) {
        return { total: 0, count: 0, average: 0 };
      }

      const startDate = toLocalDateString(previousMonthRange.from);
      const endDate = toLocalDateString(previousMonthRange.to);
      
      const { data, error } = await supabase
        .from("saidas")
        .select("valor")
        .gte("data", startDate)
        .lte("data", endDate);
      
      if (error) throw error;
      
      const total = data.reduce((sum, saida) => sum + Number(saida.valor), 0);
      const count = data.length;
      const average = count > 0 ? total / count : 0;
      
      return { total, count, average };
    },
    enabled: !!previousMonthRange?.from && !!previousMonthRange?.to,
  });
};

export const useCreateSaida = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (saida: NovaSaida) => {
      const { data, error } = await supabase
        .from("saidas")
        .insert(saida)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saidas"] });
      queryClient.invalidateQueries({ queryKey: ["saidas-summary"] });
      queryClient.invalidateQueries({ queryKey: ["chart-data"] });
      toast({
        title: "Saída criada",
        description: "A saída foi criada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar saída",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSaida = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Saida> & { id: number }) => {
      const { data, error } = await supabase
        .from("saidas")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saidas"] });
      queryClient.invalidateQueries({ queryKey: ["saidas-summary"] });
      queryClient.invalidateQueries({ queryKey: ["chart-data"] });
      toast({
        title: "Saída atualizada",
        description: "A saída foi atualizada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar saída",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteSaida = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("saidas").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saidas"] });
      queryClient.invalidateQueries({ queryKey: ["saidas-summary"] });
      queryClient.invalidateQueries({ queryKey: ["chart-data"] });
      toast({
        title: "Saída excluída",
        description: "A saída foi excluída com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir saída",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
