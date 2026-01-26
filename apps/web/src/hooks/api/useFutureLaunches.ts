import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toLocalDateString } from "@/lib/formatters";
import { useAuth } from "@/contexts/AuthContext";
import { getPreviousMonthRange } from "@/lib/trendUtils";

export type FutureLaunch = {
  id: number;
  date: string;
  type: "entrada" | "saida";
  description?: string;
  amount: number;
  category_id?: number;
  status: "pendente" | "efetivado";
  user_id?: string;
  created_at: string;
  updated_at?: string;
};

export type NewFutureLaunch = {
  date: string;
  type: "entrada" | "saida";
  description?: string;
  amount: number;
  category_id?: number;
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
        .from("future_transactions")
        .select(
          `
          *,
          categories(name, hex_color)
        `
        )
        .order("date", { ascending: true });

      // Filter by date range if provided
      if (dateRange?.from && dateRange?.to) {
        const startDate = toLocalDateString(dateRange.from);
        const endDate = toLocalDateString(dateRange.to);
        query = query.gte("date", startDate).lte("date", endDate);
      } else if (dateRange?.from) {
        // Only from date provided
        const startDate = toLocalDateString(dateRange.from);
        query = query.gte("date", startDate);
      }

      // Filter by status if provided
      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as (FutureLaunch & {
        categories?: { name: string; hex_color?: string };
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
        .from("future_transactions")
        .select("amount, type, status");

      // Filter by date range if provided
      if (dateRange?.from && dateRange?.to) {
        const startDate = toLocalDateString(dateRange.from);
        const endDate = toLocalDateString(dateRange.to);
        query = query.gte("date", startDate).lte("date", endDate);
      } else if (dateRange?.from) {
        // Only from date provided
        const startDate = toLocalDateString(dateRange.from);
        query = query.gte("date", startDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Calculate totals
      const toReceive = data
        .filter((item) => item.type === "entrada" && item.status === "pendente")
        .reduce((sum, item) => sum + Number(item.amount), 0);

      const toPay = data
        .filter((item) => item.type === "saida" && item.status === "pendente")
        .reduce((sum, item) => sum + Number(item.amount), 0);

      const completed = data
        .filter((item) => item.status === "efetivado")
        .reduce((sum, item) => {
          const value = Number(item.amount);
          return sum + (item.type === "entrada" ? value : -value);
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
        .from("future_transactions")
        .select("amount, type, status")
        .gte("date", startDate)
        .lte("date", endDate);
      
      if (error) throw error;
      
      // Calculate totals
      const toReceive = data
        .filter((item) => item.type === "entrada" && item.status === "pendente")
        .reduce((sum, item) => sum + Number(item.amount), 0);

      const toPay = data
        .filter((item) => item.type === "saida" && item.status === "pendente")
        .reduce((sum, item) => sum + Number(item.amount), 0);

      const completed = data
        .filter((item) => item.status === "efetivado")
        .reduce((sum, item) => {
          const value = Number(item.amount);
          return sum + (item.type === "entrada" ? value : -value);
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

      // Get user_id from 'users' table based on auth_user_id
      const { data: usuario, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (userError) {
        throw new Error("Usuário não encontrado na tabela users");
      }

      const { data, error } = await supabase
        .from("future_transactions")
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
        .from("future_transactions")
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
        .from("future_transactions")
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
        .from("future_transactions")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Get user_id from 'users' table
      const { data: usuario, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (userError) {
        throw new Error("Usuário não encontrado na tabela users");
      }

      // Create corresponding income or expense
      const table = launch.type === "entrada" ? "incomes" : "expenses";
      const { error: insertError } = await supabase.from(table).insert({
        date: launch.date,
        description: launch.description,
        amount: launch.amount,
        category_id: launch.category_id,
        user_id: usuario.id,
      });

      if (insertError) throw insertError;

      // Update launch status
      const { error: updateError } = await supabase
        .from("future_transactions")
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
