import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCategories } from "@/hooks/api/useCategories";
import {
  lancamentoFuturoInputSchema,
  type LancamentoFuturoFormData,
} from "@/lib/validations";
import type { LancamentoFuturo } from "@/hooks/api/useLancamentosFuturos";

interface UseLancamentoFuturoFormProps {
  mode: "create" | "edit";
  lancamento?: LancamentoFuturo & {
    categorias?: { nome: string; cor_hex?: string };
  };
  open: boolean;
}

export const useLancamentoFuturoForm = ({
  mode,
  lancamento,
  open,
}: UseLancamentoFuturoFormProps) => {
  const { data: categoriasEntrada = [] } = useCategories("entrada");
  const { data: categoriasSaida = [] } = useCategories("saida");

  const form = useForm<LancamentoFuturoFormData>({
    resolver: zodResolver(lancamentoFuturoInputSchema),
    mode: "onChange",
    defaultValues: {
      data: lancamento ? new Date(lancamento.data) : undefined,
      tipo: lancamento?.tipo,
      descricao: lancamento?.descricao || "",
      categoria_id: lancamento?.categoria_id?.toString() || "",
      valor: lancamento?.valor.toString() || "",
    },
  });

  const tipo = form.watch("tipo");
  const categorias =
    tipo === "entrada"
      ? categoriasEntrada
      : tipo === "saida"
      ? categoriasSaida
      : [];

  // Reset form when lancamento changes (for edit mode)
  useEffect(() => {
    if (open && mode === "edit" && lancamento) {
      form.reset({
        data: new Date(lancamento.data + "T00:00:00"),
        tipo: lancamento.tipo,
        descricao: lancamento.descricao || "",
        categoria_id: lancamento.categoria_id?.toString() || "",
        valor: lancamento.valor.toString(),
      });
    }
  }, [open, mode, lancamento, form]);

  return {
    form,
    tipo,
    categorias,
  };
};
