import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cardProvidersMap } from "@/mocks/cardProviders";
import { useAuth } from "@/stores/auth.store";

type CardRow = {
  id: number;
  display_name: string;
  nickname: string | null;
  flag: string | null;
  card_last_four: string | null;
  total_limit: number | string;
  used_amount: number | string;
  available_amount: number | string | null;
  usage_percentage: number | string | null;
  is_primary: boolean | null;
  issuer: string | null;
  imagem_url: string | null;
  created_at: string | null;
  user_id?: string;
};

export type Card = {
  id: number;
  display_name: string;
  nickname: string | null;
  flag: string | null;
  card_last_four: string | null;
  total_limit: number;
  used_amount: number;
  available_amount: number;
  usage_percentage: number;
  is_primary: boolean;
  issuer: string | null;
  imagem_url: string | null;
  created_at: string | null;
};

export type NewCard = {
  display_name: string;
  nickname?: string | null;
  flag?: string | null;
  card_last_four?: string | null;
  total_limit: number;
  used_amount: number;
  available_amount: number;
  usage_percentage: number;
  is_primary?: boolean;
  issuer?: string | null;
};

const resolveImageUrl = (row: Pick<CardRow, "imagem_url" | "issuer">) => {
  if (row.imagem_url) return row.imagem_url;
  if (row.issuer && cardProvidersMap[row.issuer]) {
    return cardProvidersMap[row.issuer].imageUrl;
  }
  return null;
};

const parseNumeric = (value: number | string | null | undefined) => {
  if (value === null || value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const mapCard = (row: CardRow): Card => {
  const limit = Number(row.total_limit ?? 0);
  const used = Number(row.used_amount ?? 0);
  const availableCalculated = parseNumeric(row.available_amount);
  const availableBase = availableCalculated ?? Math.max(limit - used, 0);
  const percentageCalculated = parseNumeric(row.usage_percentage);
  const percentageBase =
    percentageCalculated ?? (limit > 0 ? (used / limit) * 100 : 0);
  const percentage = Math.min(percentageBase, 999);

  return {
    id: row.id,
    display_name: row.display_name,
    nickname: row.nickname ?? null,
    flag: row.flag ?? null,
    card_last_four: row.card_last_four ?? null,
    total_limit: limit,
    used_amount: used,
    available_amount: Number(availableBase.toFixed(2)),
    usage_percentage: Number(percentage.toFixed(2)),
    is_primary: row.is_primary ?? false,
    issuer: row.issuer ?? null,
    imagem_url: resolveImageUrl(row),
    created_at: row.created_at ?? null,
  };
};

export const useCards = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["cards", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as CardRow[]).map(mapCard);
    },
    enabled: !!user?.id,
  });
};

export const useCreateCard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (card: NewCard) => {
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
        .from("cards")
        .insert({
          display_name: card.display_name || "",
          nickname: card.nickname ?? null,
          flag: card.flag ?? null,
          card_last_four: card.card_last_four ?? null,
          total_limit: Number(card.total_limit) || 0,
          used_amount: Number(card.used_amount) || 0,
          available_amount: Number(card.available_amount) || 0,
          usage_percentage: Number(card.usage_percentage) || 0,
          is_primary: card.is_primary ?? false,
          issuer: card.issuer ?? null,
          user_id: usuario.id,
        })
        .select("*")
        .single();

      if (error) throw error;
      return mapCard(data as CardRow);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      toast({
        title: "Cartao cadastrado",
        description: "O cartao foi criado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao cadastrar cartao",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (card: Card) => {
      const { data, error } = await supabase
        .from("cards")
        .update({
          display_name: card.display_name || "",
          nickname: card.nickname ?? null,
          flag: card.flag ?? null,
          card_last_four: card.card_last_four ?? null,
          total_limit: Number(card.total_limit) || 0,
          used_amount: Number(card.used_amount) || 0,
          available_amount: Number(card.available_amount) || 0,
          usage_percentage: Number(card.usage_percentage) || 0,
          issuer: card.issuer ?? null,
          is_primary: card.is_primary ?? false,
        })
        .eq("id", card.id)
        .select("*")
        .single();

      if (error) throw error;
      return mapCard(data as CardRow);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      toast({
        title: "Cartao atualizado",
        description: "Os dados do cartao foram atualizados com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar cartao",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("cards").delete().eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      toast({
        title: "Cartao excluído",
        description: "O cartao foi excluído com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir cartao",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useSetPrimaryCard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      // First, set all cards as non-primary
      const { error: error1 } = await supabase
        .from("cards")
        .update({ is_primary: false })
        .neq("id", id);

      if (error1) throw error1;

      // Then, set the selected card as primary
      const { data, error: error2 } = await supabase
        .from("cards")
        .update({ is_primary: true })
        .eq("id", id)
        .select("*")
        .single();

      if (error2) throw error2;
      return mapCard(data as CardRow);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      toast({
        title: "Cartão principal atualizado",
        description: "O cartão principal foi definido com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao definir cartão principal",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
