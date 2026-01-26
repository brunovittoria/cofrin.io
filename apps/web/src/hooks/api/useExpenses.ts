import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toLocalDateString } from "@/lib/formatters";
import { getPreviousMonthRange } from "@/lib/trendUtils";
import { useAuth } from "@/contexts/AuthContext";

export type Expense = {
  id: number;
  date: string;
  description?: string;
  amount: number;
  category_id?: number;
  user_id?: string;
  created_at: string;
  categories?: {
    id: number;
    name: string;
    hex_color: string | null;
  } | null;
};

export type NewExpense = {
  date: string;
  description?: string;
  amount: number;
  category_id?: number;
};

export const useExpenses = (dateRange?: DateRange) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [
      "expenses",
      dateRange?.from?.toISOString(),
      dateRange?.to?.toISOString(),
      user?.id,
    ],
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }

      let query = supabase
        .from("expenses")
        .select("*, categories(id, name, hex_color)")
        .order("date", { ascending: false });

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
      return data;
    },
    enabled: !!user?.id,
  });
};

export const useExpensesSummary = (dateRange?: DateRange) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [
      "expenses-summary",
      dateRange?.from?.toISOString(),
      dateRange?.to?.toISOString(),
      user?.id,
    ],
    queryFn: async () => {
      if (!user?.id) {
        return { total: 0, count: 0, average: 0 };
      }

      let query = supabase.from("expenses").select("amount");

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

      const total = data.reduce((sum, expense) => sum + Number(expense.amount), 0);
      const count = data.length;
      const average = count > 0 ? total / count : 0;

      return { total, count, average };
    },
    enabled: !!user?.id,
  });
};

export const useExpensesSummaryPreviousMonth = (dateRange?: DateRange) => {
  const previousMonthRange = getPreviousMonthRange(dateRange);
  const { user } = useAuth();
  
  return useQuery({
    queryKey: [
      "expenses-summary-previous",
      previousMonthRange?.from?.toISOString(),
      previousMonthRange?.to?.toISOString(),
      user?.id,
    ],
    queryFn: async () => {
      if (!previousMonthRange?.from || !previousMonthRange?.to || !user?.id) {
        return { total: 0, count: 0, average: 0 };
      }

      const startDate = toLocalDateString(previousMonthRange.from);
      const endDate = toLocalDateString(previousMonthRange.to);
      
      const { data, error } = await supabase
        .from("expenses")
        .select("amount")
        .gte("date", startDate)
        .lte("date", endDate);
      
      if (error) throw error;
      
      const total = data.reduce((sum, expense) => sum + Number(expense.amount), 0);
      const count = data.length;
      const average = count > 0 ? total / count : 0;
      
      return { total, count, average };
    },
    enabled: !!previousMonthRange?.from && !!previousMonthRange?.to && !!user?.id,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (expense: NewExpense) => {
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
        .from("expenses")
        .insert({
          ...expense,
          user_id: usuario.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-summary"] });
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

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Expense> & { id: number }) => {
      const { data, error } = await supabase
        .from("expenses")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-summary"] });
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

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("expenses").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-summary"] });
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
