import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/stores/auth.store";

export type GoalType = "economizar" | "reduzir" | "quitar" | "personalizada";
export type GoalStatus = "ativa" | "concluida" | "pausada";

export type Goal = {
  id: string;
  user_id: string | null;
  title: string;
  type: GoalType;
  description: string | null;
  target_amount: number;
  current_amount: number;
  deadline: string;
  status: GoalStatus;
  category_id: number | null;
  card_id: number | null;
  reflection_why: string | null;
  reflection_change: string | null;
  reflection_feeling: string | null;
  created_at: string;
  updated_at: string;
};

export type NewGoal = {
  title: string;
  type: GoalType;
  description?: string;
  target_amount: number;
  current_amount?: number;
  deadline: string;
  status?: GoalStatus;
  category_id?: number | null;
  card_id?: number | null;
  reflection_why?: string;
  reflection_change?: string;
  reflection_feeling?: string;
};

export const useGoals = (status?: GoalStatus) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["goals", status, user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }

      let query = supabase
        .from("goals")
        .select(
          `
          *,
          categories(name, hex_color),
          cards(display_name, issuer)
        `
        )
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as (Goal & {
        categories?: { name: string; hex_color?: string } | null;
        cards?: { display_name: string; issuer?: string } | null;
      })[];
    },
    enabled: !!user?.id,
  });
};

export const useGoal = (id: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["goal", id, user?.id],
    queryFn: async () => {
      if (!user?.id || !id) {
        return null;
      }

      const { data, error } = await supabase
        .from("goals")
        .select(
          `
          *,
          categories(name, hex_color),
          cards(display_name, issuer)
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Goal & {
        categories?: { name: string; hex_color?: string } | null;
        cards?: { display_name: string; issuer?: string } | null;
      };
    },
    enabled: !!user?.id && !!id,
  });
};

export const useGoalsSummary = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["goals-summary", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return { total: 0, active: 0, completed: 0, paused: 0, totalProgress: 0 };
      }

      const { data, error } = await supabase
        .from("goals")
        .select("status, target_amount, current_amount");

      if (error) throw error;

      const total = data.length;
      const active = data.filter((g) => g.status === "ativa").length;
      const completed = data.filter((g) => g.status === "concluida").length;
      const paused = data.filter((g) => g.status === "pausada").length;

      const totalTarget = data.reduce((sum, g) => sum + Number(g.target_amount), 0);
      const totalCurrent = data.reduce((sum, g) => sum + Number(g.current_amount), 0);
      const totalProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

      return { total, active, completed, paused, totalProgress };
    },
    enabled: !!user?.id,
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (goal: NewGoal) => {
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
        .from("goals")
        .insert({
          ...goal,
          user_id: usuario.id,
          current_amount: goal.current_amount || 0,
          status: goal.status || "ativa",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["goals-summary"] });
      toast({
        title: "Meta criada",
        description: "Sua meta foi criada com sucesso. Boa sorte!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar meta",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Goal> & { id: string }) => {
      const { data, error } = await supabase
        .from("goals")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["goal", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["goals-summary"] });
      toast({
        title: "Meta atualizada",
        description: "Sua meta foi atualizada com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar meta",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateGoalProgress = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, valor_adicional }: { id: string; valor_adicional: number }) => {
      // First get current value
      const { data: currentGoal, error: fetchError } = await supabase
        .from("goals")
        .select("current_amount, target_amount")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const newValue = Number(currentGoal.current_amount) + valor_adicional;
      const isCompleted = newValue >= Number(currentGoal.target_amount);

      const { data, error } = await supabase
        .from("goals")
        .update({
          current_amount: newValue,
          status: isCompleted ? "concluida" : "ativa",
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { data, isCompleted };
    },
    onSuccess: ({ isCompleted }, variables) => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["goal", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["goals-summary"] });
      
      if (isCompleted) {
        toast({
          title: "🎉 Parabéns!",
          description: "Você atingiu sua meta! Que conquista incrível!",
        });
      } else {
        toast({
          title: "Progresso registrado",
          description: "Continue assim, você está no caminho certo!",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar progresso",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("goals").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["goals-summary"] });
      toast({
        title: "Meta excluída",
        description: "A meta foi excluída com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir meta",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
