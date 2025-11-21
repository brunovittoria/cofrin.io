import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cardProvidersMap } from "@/data/cardProviders";

type CartaoRow = {
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
};

export type Cartao = {
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

export type NovoCartao = {
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

const resolveImageUrl = (row: Pick<CartaoRow, "imagem_url" | "emissor">) => {
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

const mapCartao = (row: CartaoRow): Cartao => {
  const limite = Number(row.limite_total ?? 0);
  const utilizado = Number(row.valor_utilizado ?? 0);
  const disponivelCalculado = parseNumeric(row.valor_disponivel);
  const disponivelBase = disponivelCalculado ?? Math.max(limite - utilizado, 0);
  const percentualCalculado = parseNumeric(row.uso_percentual);
  const percentualBase = percentualCalculado ?? (limite > 0 ? (utilizado / limite) * 100 : 0);
  const percentual = Math.min(percentualBase, 999);

  return {
    id: row.id,
    nome_exibicao: row.nome_exibicao,
    apelido: row.apelido ?? null,
    bandeira: row.bandeira ?? null,
    final_cartao: row.final_cartao ?? null,
    limite_total: limite,
    valor_utilizado: utilizado,
    valor_disponivel: Number(disponivelBase.toFixed(2)),
    uso_percentual: Number(percentual.toFixed(2)),
    is_principal: row.is_principal ?? false,
    emissor: row.emissor ?? null,
    imagem_url: resolveImageUrl(row),
    criado_em: row.criado_em ?? null,
  };
};

export const useCartoes = () => {
  return useQuery({
    queryKey: ["cartoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cartoes")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) throw error;
      return (data as CartaoRow[]).map(mapCartao);
    },
  });
};

export const useCreateCartao = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (cartao: NovoCartao) => {
      const { data, error } = await supabase
        .from("cartoes")
        .insert({
          nome_exibicao: cartao.nome_exibicao || "",
          apelido: cartao.apelido ?? null,
          bandeira: cartao.bandeira ?? null,
          final_cartao: cartao.final_cartao ?? null,
          limite_total: Number(cartao.limite_total) || 0,
          valor_utilizado: Number(cartao.valor_utilizado) || 0,
          valor_disponivel: Number(cartao.valor_disponivel) || 0,
          uso_percentual: Number(cartao.uso_percentual) || 0,
          is_principal: cartao.is_principal ?? false,
          emissor: cartao.emissor ?? null,
        })
        .select("*")
        .single();

      if (error) throw error;
      return mapCartao(data as CartaoRow);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartoes"] });
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

export const useUpdateCartao = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (cartao: Cartao) => {
      const { data, error } = await supabase
        .from("cartoes")
        .update({
          nome_exibicao: cartao.nome_exibicao || "",
          apelido: cartao.apelido ?? null,
          bandeira: cartao.bandeira ?? null,
          final_cartao: cartao.final_cartao ?? null,
          limite_total: Number(cartao.limite_total) || 0,
          valor_utilizado: Number(cartao.valor_utilizado) || 0,
          valor_disponivel: Number(cartao.valor_disponivel) || 0,
          uso_percentual: Number(cartao.uso_percentual) || 0,
          emissor: cartao.emissor ?? null,
          is_principal: cartao.is_principal ?? false,
        })
        .eq("id", cartao.id)
        .select("*")
        .single();

      if (error) throw error;
      return mapCartao(data as CartaoRow);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartoes"] });
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

export const useDeleteCartao = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("cartoes")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartoes"] });
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

export const useSetCartaoPrincipal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      // Primeiro, define todos os cartões como não principais
      const { error: error1 } = await supabase
        .from("cartoes")
        .update({ is_principal: false })
        .neq("id", id); // Não atualiza o cartão selecionado

      if (error1) throw error1;

      // Depois, define o cartão selecionado como principal
      const { data, error: error2 } = await supabase
        .from("cartoes")
        .update({ is_principal: true })
        .eq("id", id)
        .select("*")
        .single();

      if (error2) throw error2;
      return mapCartao(data as CartaoRow);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartoes"] });
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



