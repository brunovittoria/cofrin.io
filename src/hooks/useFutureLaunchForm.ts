import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCategories } from "@/hooks/api/useCategories";
import {
  futureLaunchInputSchema,
  type FutureLaunchFormData,
} from "@/lib/validations";
import type { FutureLaunch } from "@/hooks/api/useFutureLaunches";

interface UseFutureLaunchFormProps {
  mode: "create" | "edit";
  launch?: FutureLaunch & {
    categorias?: { nome: string; cor_hex?: string };
  };
  open: boolean;
}

export const useFutureLaunchForm = ({
  mode,
  launch,
  open,
}: UseFutureLaunchFormProps) => {
  const { data: incomeCategories = [] } = useCategories("entrada");
  const { data: expenseCategories = [] } = useCategories("saida");

  const form = useForm<FutureLaunchFormData>({
    resolver: zodResolver(futureLaunchInputSchema),
    mode: "onChange",
    defaultValues: {
      data: launch ? new Date(launch.data) : undefined,
      tipo: launch?.tipo,
      descricao: launch?.descricao || "",
      categoria_id: launch?.categoria_id?.toString() || "",
      valor: launch?.valor.toString() || "",
    },
  });

  const tipo = form.watch("tipo");
  const categories =
    tipo === "entrada"
      ? incomeCategories
      : tipo === "saida"
      ? expenseCategories
      : [];

  // Reset form when launch changes (for edit mode)
  useEffect(() => {
    if (open && mode === "edit" && launch) {
      form.reset({
        data: new Date(launch.data + "T00:00:00"),
        tipo: launch.tipo,
        descricao: launch.descricao || "",
        categoria_id: launch.categoria_id?.toString() || "",
        valor: launch.valor.toString(),
      });
    }
  }, [open, mode, launch, form]);

  return {
    form,
    tipo,
    categories,
  };
};
