import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toLocalDateString } from "@/lib/formatters";
import { useUser } from "@clerk/clerk-react";

export type LancamentoFuturo = {
  id: number;
  data: string;
  tipo: "entrada" | "saida";
  descricao?: string;
  valor: number;
  categoria_id?: number;
  status: "pendente" | "efetivado";
  user_id?: string;
  created_at: string;
  updated_at?: string;
};

export type NovoLancamentoFuturo = {
  data: string;
  tipo: "entrada" | "saida";
  descricao?: string;
  valor: number;
  categoria_id?: number;
  status?: "pendente" | "efetivado";
};

export const useLancamentosFuturos = (
  dateRange?: DateRange,
  status?: "pendente" | "efetivado"
) => {
  return useQuery({
    queryKey: [
      "lancamentos-futuros",
      dateRange?.from?.toISOString(),
      dateRange?.to?.toISOString(),
      status,
    ],
    queryFn: async () => {
      let query = supabase
        .from("lancamentos_futuros")
        .select(
          `
          *,
          categorias(nome, cor_hex)
        `
        )
        .order("data", { ascending: true });

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

      // Filter by status if provided
      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as (LancamentoFuturo & {
        categorias?: { nome: string; cor_hex?: string };
      })[];
    },
  });
};

export const useLancamentosFuturosSummary = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: [
      "lancamentos-futuros-summary",
      dateRange?.from?.toISOString(),
      dateRange?.to?.toISOString(),
    ],
    queryFn: async () => {
      let query = supabase
        .from("lancamentos_futuros")
        .select("valor, tipo, status");

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

      // Calcular totais
      const aReceber = data
        .filter((item) => item.tipo === "entrada" && item.status === "pendente")
        .reduce((sum, item) => sum + Number(item.valor), 0);

      const aPagar = data
        .filter((item) => item.tipo === "saida" && item.status === "pendente")
        .reduce((sum, item) => sum + Number(item.valor), 0);

      const efetivado = data
        .filter((item) => item.status === "efetivado")
        .reduce((sum, item) => {
          const valor = Number(item.valor);
          return sum + (item.tipo === "entrada" ? valor : -valor);
        }, 0);

      const saldoPrevisto = aReceber - aPagar;

      return { aReceber, aPagar, saldoPrevisto, efetivado };
    },
  });
};

export const useCreateLancamentoFuturo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (lancamento: NovoLancamentoFuturo) => {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }

      const { data, error } = await supabase
        .from("lancamentos_futuros")
        .insert({
          ...lancamento,
          user_id: user.id,
          status: lancamento.status || "pendente",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lancamentos-futuros"] });
      queryClient.invalidateQueries({
        queryKey: ["lancamentos-futuros-summary"],
      });
      toast({
        title: "Lançamento criado",
        description: "O lançamento futuro foi criado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar lançamento",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateLancamentoFuturo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<LancamentoFuturo> & { id: number }) => {
      const { data, error } = await supabase
        .from("lancamentos_futuros")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lancamentos-futuros"] });
      queryClient.invalidateQueries({
        queryKey: ["lancamentos-futuros-summary"],
      });
      toast({
        title: "Lançamento atualizado",
        description: "O lançamento futuro foi atualizado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar lançamento",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteLancamentoFuturo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("lancamentos_futuros")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lancamentos-futuros"] });
      queryClient.invalidateQueries({
        queryKey: ["lancamentos-futuros-summary"],
      });
      toast({
        title: "Lançamento excluído",
        description: "O lançamento futuro foi excluído com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir lançamento",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useEfetivarLancamentoFuturo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }

      // Buscar o lançamento
      const { data: lancamento, error: fetchError } = await supabase
        .from("lancamentos_futuros")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Criar entrada ou saída correspondente
      const tabela = lancamento.tipo === "entrada" ? "entradas" : "saidas";
      const { error: insertError } = await supabase.from(tabela).insert({
        data: lancamento.data,
        descricao: lancamento.descricao,
        valor: lancamento.valor,
        categoria_id: lancamento.categoria_id,
      });

      if (insertError) throw insertError;

      // Atualizar status do lançamento
      const { error: updateError } = await supabase
        .from("lancamentos_futuros")
        .update({ status: "efetivado" })
        .eq("id", id);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lancamentos-futuros"] });
      queryClient.invalidateQueries({
        queryKey: ["lancamentos-futuros-summary"],
      });
      queryClient.invalidateQueries({ queryKey: ["entradas"] });
      queryClient.invalidateQueries({ queryKey: ["saidas"] });
      queryClient.invalidateQueries({ queryKey: ["chart-data"] });
      toast({
        title: "Lançamento efetivado",
        description: "O lançamento foi efetivado e registrado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao efetivar lançamento",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
