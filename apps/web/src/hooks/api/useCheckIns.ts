import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export type CheckInMood = "positivo" | "neutro" | "negativo";

export type CheckIn = {
  id: string;
  goal_id: string;
  user_id: string;
  date: string;
  mood: CheckInMood | null;
  obstacles: string | null;
  added_value: number;
  note: string | null;
  created_at: string;
};

export type NewCheckIn = {
  goal_id: string;
  date?: string;
  mood?: CheckInMood;
  obstacles?: string;
  added_value?: number;
  note?: string;
};

export const useCheckIns = (metaId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["checkins", metaId, user?.id],
    queryFn: async () => {
      if (!user?.id || !metaId) {
        return [];
      }

      const { data, error } = await supabase
        .from("goal_checkins")
        .select("*")
        .eq("goal_id", metaId)
        .order("date", { ascending: false });

      if (error) throw error;
      return data as CheckIn[];
    },
    enabled: !!user?.id && !!metaId,
  });
};

export const useRecentCheckIns = (limit: number = 5) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["checkins-recent", user?.id, limit],
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from("goal_checkins")
        .select(
          `
          *,
          goals(title, type)
        `
        )
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as (CheckIn & {
        goals?: { title: string; type: string } | null;
      })[];
    },
    enabled: !!user?.id,
  });
};

export const useCreateCheckIn = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (checkIn: NewCheckIn) => {
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
        .from("goal_checkins")
        .insert({
          ...checkIn,
          user_id: usuario.id,
          date: checkIn.date || new Date().toISOString().split("T")[0],
          added_value: checkIn.added_value || 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["checkins", variables.goal_id] });
      queryClient.invalidateQueries({ queryKey: ["checkins-recent"] });
      toast({
        title: "Check-in registrado",
        description: "Seu check-in foi salvo. Continue acompanhando seu progresso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao registrar check-in",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCheckIn = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, goal_id, ...updates }: Partial<CheckIn> & { id: string; goal_id: string }) => {
      const { data, error } = await supabase
        .from("goal_checkins")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { data, goal_id };
    },
    onSuccess: ({ goal_id }) => {
      queryClient.invalidateQueries({ queryKey: ["checkins", goal_id] });
      queryClient.invalidateQueries({ queryKey: ["checkins-recent"] });
      toast({
        title: "Check-in atualizado",
        description: "O check-in foi atualizado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar check-in",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCheckIn = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, goal_id }: { id: string; goal_id: string }) => {
      const { error } = await supabase.from("goal_checkins").delete().eq("id", id);

      if (error) throw error;
      return { goal_id };
    },
    onSuccess: ({ goal_id }) => {
      queryClient.invalidateQueries({ queryKey: ["checkins", goal_id] });
      queryClient.invalidateQueries({ queryKey: ["checkins-recent"] });
      toast({
        title: "Check-in excluído",
        description: "O check-in foi excluído com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir check-in",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
