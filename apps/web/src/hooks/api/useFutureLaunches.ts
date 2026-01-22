import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toLocalDateString } from "@/lib/formatters";
import { useAuth } from "@/contexts/AuthContext";
import { getPreviousMonthRange } from "@/lib/trendUtils";

export type FutureLaunch = {
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

export type NewFutureLaunch = {
  data: string;
  tipo: "entrada" | "saida";
  descricao?: string;
  valor: number;
  categoria_id?: number;
  status?: "pendente" | "efetivado";
};

export const useFutureLaunches = (
  dateRange?: DateRange,
  status?: "pendente" | "efetivado"
) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [
      "future-launches",
      dateRange?.from?.toISOString(),
      dateRange?.to?.toISOString(),
      status,
      user?.id,
    ],
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }

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
      return data as (FutureLaunch & {
        categorias?: { nome: string; cor_hex?: string };
      })[];
    },
    enabled: !!user?.id,
  });
};

export const useFutureLaunchesSummary = (dateRange?: DateRange) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [
      "future-launches-summary",
      dateRange?.from?.toISOString(),
      dateRange?.to?.toISOString(),
      user?.id,
    ],
    queryFn: async () => {
      if (!user?.id) {
        return { toReceive: 0, toPay: 0, projectedBalance: 0, completed: 0 };
      }

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

      // Calculate totals
      const toReceive = data
        .filter((item) => item.tipo === "entrada" && item.status === "pendente")
        .reduce((sum, item) => sum + Number(item.valor), 0);

      const toPay = data
        .filter((item) => item.tipo === "saida" && item.status === "pendente")
        .reduce((sum, item) => sum + Number(item.valor), 0);

      const completed = data
        .filter((item) => item.status === "efetivado")
        .reduce((sum, item) => {
          const value = Number(item.valor);
          return sum + (item.tipo === "entrada" ? value : -value);
        }, 0);

      const projectedBalance = toReceive - toPay;

      return { toReceive, toPay, projectedBalance, completed };
    },
    enabled: !!user?.id,
  });
};

export const useFutureLaunchesSummaryPreviousMonth = (dateRange?: DateRange) => {
  const previousMonthRange = getPreviousMonthRange(dateRange);
  const { user } = useAuth();
  
  return useQuery({
    queryKey: [
      "future-launches-summary-previous",
      previousMonthRange?.from?.toISOString(),
      previousMonthRange?.to?.toISOString(),
      user?.id,
    ],
    queryFn: async () => {
      if (!previousMonthRange?.from || !previousMonthRange?.to || !user?.id) {
        return { toReceive: 0, toPay: 0, projectedBalance: 0, completed: 0 };
      }

      const startDate = toLocalDateString(previousMonthRange.from);
      const endDate = toLocalDateString(previousMonthRange.to);
      
      const { data, error } = await supabase
        .from("lancamentos_futuros")
        .select("valor, tipo, status")
        .gte("data", startDate)
        .lte("data", endDate);
      
      if (error) throw error;
      
      // Calculate totals
      const toReceive = data
        .filter((item) => item.tipo === "entrada" && item.status === "pendente")
        .reduce((sum, item) => sum + Number(item.valor), 0);

      const toPay = data
        .filter((item) => item.tipo === "saida" && item.status === "pendente")
        .reduce((sum, item) => sum + Number(item.valor), 0);

      const completed = data
        .filter((item) => item.status === "efetivado")
        .reduce((sum, item) => {
          const value = Number(item.valor);
          return sum + (item.tipo === "entrada" ? value : -value);
        }, 0);

      const projectedBalance = toReceive - toPay;

      return { toReceive, toPay, projectedBalance, completed };
    },
    enabled: !!previousMonthRange?.from && !!previousMonthRange?.to && !!user?.id,
  });
};

export const useCreateFutureLaunch = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (launch: NewFutureLaunch) => {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }

      // Get user_id from 'usuarios' table based on auth_user_id
      const { data: usuario, error: userError } = await supabase
        .from("usuarios")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (userError) {
        throw new Error("Usuário não encontrado na tabela usuarios");
      }

      const { data, error } = await supabase
        .from("lancamentos_futuros")
        .insert({
          ...launch,
          user_id: usuario.id,
          status: launch.status || "pendente",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["future-launches"] });
      queryClient.invalidateQueries({
        queryKey: ["future-launches-summary"],
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

export const useUpdateFutureLaunch = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<FutureLaunch> & { id: number }) => {
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
      queryClient.invalidateQueries({ queryKey: ["future-launches"] });
      queryClient.invalidateQueries({
        queryKey: ["future-launches-summary"],
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

export const useDeleteFutureLaunch = () => {
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
      queryClient.invalidateQueries({ queryKey: ["future-launches"] });
      queryClient.invalidateQueries({
        queryKey: ["future-launches-summary"],
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

export const useCompleteFutureLaunch = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }

      // Fetch the launch
      const { data: launch, error: fetchError } = await supabase
        .from("lancamentos_futuros")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Get user_id from 'usuarios' table
      const { data: usuario, error: userError } = await supabase
        .from("usuarios")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (userError) {
        throw new Error("Usuário não encontrado na tabela usuarios");
      }

      // Create corresponding income or expense
      const table = launch.tipo === "entrada" ? "entradas" : "saidas";
      const { error: insertError } = await supabase.from(table).insert({
        data: launch.data,
        descricao: launch.descricao,
        valor: launch.valor,
        categoria_id: launch.categoria_id,
        user_id: usuario.id,
      });

      if (insertError) throw insertError;

      // Update launch status
      const { error: updateError } = await supabase
        .from("lancamentos_futuros")
        .update({ status: "efetivado" })
        .eq("id", id);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["future-launches"] });
      queryClient.invalidateQueries({
        queryKey: ["future-launches-summary"],
      });
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
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
