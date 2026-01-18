import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/clerk-react";

export type CheckInMood = "positivo" | "neutro" | "negativo";

export type CheckIn = {
  id: string;
  meta_id: string;
  clerk_id: string;
  data: string;
  humor: CheckInMood | null;
  obstaculos: string | null;
  valor_adicionado: number;
  nota: string | null;
  created_at: string;
};

export type NewCheckIn = {
  meta_id: string;
  data?: string;
  humor?: CheckInMood;
  obstaculos?: string;
  valor_adicionado?: number;
  nota?: string;
};

export const useCheckIns = (metaId: string) => {
  const { user: clerkUser } = useUser();

  return useQuery({
    queryKey: ["checkins", metaId, clerkUser?.id],
    queryFn: async () => {
      if (!clerkUser?.id || !metaId) {
        return [];
      }

      const { data, error } = await supabase
        .from("meta_checkins")
        .select("*")
        .eq("meta_id", metaId)
        .eq("clerk_id", clerkUser.id)
        .order("data", { ascending: false });

      if (error) throw error;
      return data as CheckIn[];
    },
    enabled: !!clerkUser?.id && !!metaId,
  });
};

export const useRecentCheckIns = (limit: number = 5) => {
  const { user: clerkUser } = useUser();

  return useQuery({
    queryKey: ["checkins-recent", clerkUser?.id, limit],
    queryFn: async () => {
      if (!clerkUser?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from("meta_checkins")
        .select(
          `
          *,
          metas(titulo, tipo)
        `
        )
        .eq("clerk_id", clerkUser.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as (CheckIn & {
        metas?: { titulo: string; tipo: string } | null;
      })[];
    },
    enabled: !!clerkUser?.id,
  });
};

export const useCreateCheckIn = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user: clerkUser } = useUser();

  return useMutation({
    mutationFn: async (checkIn: NewCheckIn) => {
      if (!clerkUser?.id) {
        throw new Error("Usuário não autenticado");
      }

      const { data, error } = await supabase
        .from("meta_checkins")
        .insert({
          ...checkIn,
          clerk_id: clerkUser.id,
          data: checkIn.data || new Date().toISOString().split("T")[0],
          valor_adicionado: checkIn.valor_adicionado || 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["checkins", variables.meta_id] });
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
    mutationFn: async ({ id, meta_id, ...updates }: Partial<CheckIn> & { id: string; meta_id: string }) => {
      const { data, error } = await supabase
        .from("meta_checkins")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { data, meta_id };
    },
    onSuccess: ({ meta_id }) => {
      queryClient.invalidateQueries({ queryKey: ["checkins", meta_id] });
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
    mutationFn: async ({ id, meta_id }: { id: string; meta_id: string }) => {
      const { error } = await supabase.from("meta_checkins").delete().eq("id", id);

      if (error) throw error;
      return { meta_id };
    },
    onSuccess: ({ meta_id }) => {
      queryClient.invalidateQueries({ queryKey: ["checkins", meta_id] });
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
