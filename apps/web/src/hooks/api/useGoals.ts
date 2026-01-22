import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export type GoalType = "economizar" | "reduzir" | "quitar" | "personalizada";
export type GoalStatus = "ativa" | "concluida" | "pausada";

export type Goal = {
  id: string;
  user_id: string | null;
  titulo: string;
  tipo: GoalType;
  descricao: string | null;
  valor_alvo: number;
  valor_atual: number;
  prazo: string;
  status: GoalStatus;
  categoria_id: number | null;
  cartao_id: number | null;
  reflexao_porque: string | null;
  reflexao_mudanca: string | null;
  reflexao_sentimento: string | null;
  created_at: string;
  updated_at: string;
};

export type NewGoal = {
  titulo: string;
  tipo: GoalType;
  descricao?: string;
  valor_alvo: number;
  valor_atual?: number;
  prazo: string;
  status?: GoalStatus;
  categoria_id?: number | null;
  cartao_id?: number | null;
  reflexao_porque?: string;
  reflexao_mudanca?: string;
  reflexao_sentimento?: string;
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
        .from("metas")
        .select(
          `
          *,
          categorias(nome, cor_hex),
          cartoes(nome_exibicao, emissor)
        `
        )
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as (Goal & {
        categorias?: { nome: string; cor_hex?: string } | null;
        cartoes?: { nome_exibicao: string; emissor?: string } | null;
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
        .from("metas")
        .select(
          `
          *,
          categorias(nome, cor_hex),
          cartoes(nome_exibicao, emissor)
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Goal & {
        categorias?: { nome: string; cor_hex?: string } | null;
        cartoes?: { nome_exibicao: string; emissor?: string } | null;
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
        .from("metas")
        .select("status, valor_alvo, valor_atual");

      if (error) throw error;

      const total = data.length;
      const active = data.filter((g) => g.status === "ativa").length;
      const completed = data.filter((g) => g.status === "concluida").length;
      const paused = data.filter((g) => g.status === "pausada").length;

      const totalTarget = data.reduce((sum, g) => sum + Number(g.valor_alvo), 0);
      const totalCurrent = data.reduce((sum, g) => sum + Number(g.valor_atual), 0);
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
        .from("metas")
        .insert({
          ...goal,
          user_id: usuario.id,
          valor_atual: goal.valor_atual || 0,
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
        .from("metas")
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
        .from("metas")
        .select("valor_atual, valor_alvo")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const newValue = Number(currentGoal.valor_atual) + valor_adicional;
      const isCompleted = newValue >= Number(currentGoal.valor_alvo);

      const { data, error } = await supabase
        .from("metas")
        .update({
          valor_atual: newValue,
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
      const { error } = await supabase.from("metas").delete().eq("id", id);

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
