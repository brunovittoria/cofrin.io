import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cardProvidersMap } from "@/mocks/cardProviders";
import { useAuth } from "@/contexts/AuthContext";

type CardRow = {
  id: number;
  nome_exibicao: string;
  apelido: string | null;
  bandeira: string | null;
  final_cartao: string | null;
  limite_total: number | string;
  valor_utilizado: number | string;
  valor_disponivel: number | string | null;
  uso_percentual: number | string | null;
  is_principal: boolean | null;
  emissor: string | null;
  imagem_url: string | null;
  criado_em: string | null;
  user_id?: string;
};

export type Card = {
  id: number;
  nome_exibicao: string;
  apelido: string | null;
  bandeira: string | null;
  final_cartao: string | null;
  limite_total: number;
  valor_utilizado: number;
  valor_disponivel: number;
  uso_percentual: number;
  is_principal: boolean;
  emissor: string | null;
  imagem_url: string | null;
  criado_em: string | null;
};

export type NewCard = {
  nome_exibicao: string;
  apelido?: string | null;
  bandeira?: string | null;
  final_cartao?: string | null;
  limite_total: number;
  valor_utilizado: number;
  valor_disponivel: number;
  uso_percentual: number;
  is_principal?: boolean;
  emissor?: string | null;
};

const resolveImageUrl = (row: Pick<CardRow, "imagem_url" | "emissor">) => {
  if (row.imagem_url) return row.imagem_url;
  if (row.emissor && cardProvidersMap[row.emissor]) {
    return cardProvidersMap[row.emissor].imageUrl;
  }
  return null;
};

const parseNumeric = (value: number | string | null | undefined) => {
  if (value === null || value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const mapCard = (row: CardRow): Card => {
  const limit = Number(row.limite_total ?? 0);
  const used = Number(row.valor_utilizado ?? 0);
  const availableCalculated = parseNumeric(row.valor_disponivel);
  const availableBase = availableCalculated ?? Math.max(limit - used, 0);
  const percentageCalculated = parseNumeric(row.uso_percentual);
  const percentageBase =
    percentageCalculated ?? (limit > 0 ? (used / limit) * 100 : 0);
  const percentage = Math.min(percentageBase, 999);

  return {
    id: row.id,
    nome_exibicao: row.nome_exibicao,
    apelido: row.apelido ?? null,
    bandeira: row.bandeira ?? null,
    final_cartao: row.final_cartao ?? null,
    limite_total: limit,
    valor_utilizado: used,
    valor_disponivel: Number(availableBase.toFixed(2)),
    uso_percentual: Number(percentage.toFixed(2)),
    is_principal: row.is_principal ?? false,
    emissor: row.emissor ?? null,
    imagem_url: resolveImageUrl(row),
    criado_em: row.criado_em ?? null,
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
        .from("cartoes")
        .select("*")
        .order("criado_em", { ascending: false });

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
        .from("cartoes")
        .insert({
          nome_exibicao: card.nome_exibicao || "",
          apelido: card.apelido ?? null,
          bandeira: card.bandeira ?? null,
          final_cartao: card.final_cartao ?? null,
          limite_total: Number(card.limite_total) || 0,
          valor_utilizado: Number(card.valor_utilizado) || 0,
          valor_disponivel: Number(card.valor_disponivel) || 0,
          uso_percentual: Number(card.uso_percentual) || 0,
          is_principal: card.is_principal ?? false,
          emissor: card.emissor ?? null,
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
        .from("cartoes")
        .update({
          nome_exibicao: card.nome_exibicao || "",
          apelido: card.apelido ?? null,
          bandeira: card.bandeira ?? null,
          final_cartao: card.final_cartao ?? null,
          limite_total: Number(card.limite_total) || 0,
          valor_utilizado: Number(card.valor_utilizado) || 0,
          valor_disponivel: Number(card.valor_disponivel) || 0,
          uso_percentual: Number(card.uso_percentual) || 0,
          emissor: card.emissor ?? null,
          is_principal: card.is_principal ?? false,
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
      const { error } = await supabase.from("cartoes").delete().eq("id", id);

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
        .from("cartoes")
        .update({ is_principal: false })
        .neq("id", id);

      if (error1) throw error1;

      // Then, set the selected card as primary
      const { data, error: error2 } = await supabase
        .from("cartoes")
        .update({ is_principal: true })
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
