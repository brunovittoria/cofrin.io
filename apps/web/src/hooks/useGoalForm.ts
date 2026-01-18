import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { goalFormSchema, type GoalFormData } from "@/lib/validations";
import { GoalType, Goal } from "@/hooks/api/useGoals";
import { useCategories } from "@/hooks/api/useCategories";
import { useCards } from "@/hooks/api/useCards";

export type GoalFormStep = 1 | 2 | 3;

interface UseGoalFormProps {
  mode?: "create" | "edit";
  goal?: Goal;
  open?: boolean;
}

export const useGoalForm = ({ mode = "create", goal, open }: UseGoalFormProps = {}) => {
  const { data: expenseCategories = [] } = useCategories("saida");
  const { data: cards = [] } = useCards();

  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalFormSchema),
    mode: "onChange",
    defaultValues: {
      porque: "",
      mudanca: "",
      sentimento: "",
      tipo: undefined,
      titulo: "",
      descricao: "",
      valor_alvo: "",
      valor_atual: "0",
      prazo: "",
      categoria_id: "",
      cartao_id: "",
    },
  });

  const tipo = form.watch("tipo");
  const porque = form.watch("porque");
  const mudanca = form.watch("mudanca");

  // Reset form when goal changes (for edit mode)
  useEffect(() => {
    if (open && mode === "edit" && goal) {
      form.reset({
        porque: goal.reflexao_porque || "",
        mudanca: goal.reflexao_mudanca || "",
        sentimento: goal.reflexao_sentimento || "",
        tipo: goal.tipo,
        titulo: goal.titulo,
        descricao: goal.descricao || "",
        valor_alvo: String(goal.valor_alvo),
        valor_atual: String(goal.valor_atual),
        prazo: goal.prazo,
        categoria_id: goal.categoria_id?.toString() || "",
        cartao_id: goal.cartao_id?.toString() || "",
      });
    }
  }, [open, mode, goal, form]);

  // Step validation helpers
  const isStep1Valid = () => {
    const porqueValue = porque?.trim() || "";
    const mudancaValue = mudanca?.trim() || "";
    return porqueValue.length >= 10 && mudancaValue.length >= 10;
  };

  const isStep2Valid = () => {
    return tipo !== undefined;
  };

  const isStep3Valid = () => {
    const values = form.getValues();
    const valorAlvo = parseFloat(values.valor_alvo?.replace(",", ".") || "0");
    return (
      values.titulo?.trim().length >= 3 &&
      !isNaN(valorAlvo) &&
      valorAlvo > 0 &&
      values.prazo?.length > 0
    );
  };

  const canProceed = (step: GoalFormStep) => {
    switch (step) {
      case 1:
        return isStep1Valid();
      case 2:
        return isStep2Valid();
      case 3:
        return isStep3Valid();
      default:
        return false;
    }
  };

  // Get submit data formatted for API
  const getSubmitData = () => {
    const values = form.getValues();
    return {
      titulo: values.titulo.trim(),
      tipo: values.tipo as GoalType,
      descricao: values.descricao?.trim() || undefined,
      valor_alvo: parseFloat(values.valor_alvo.replace(",", ".")),
      valor_atual: parseFloat(values.valor_atual?.replace(",", ".") || "0"),
      prazo: values.prazo,
      categoria_id: values.categoria_id ? parseInt(values.categoria_id, 10) : null,
      cartao_id: values.cartao_id ? parseInt(values.cartao_id, 10) : null,
      reflexao_porque: values.porque.trim(),
      reflexao_mudanca: values.mudanca.trim(),
      reflexao_sentimento: values.sentimento?.trim() || undefined,
    };
  };

  // Reset form to initial state
  const resetForm = () => {
    form.reset({
      porque: "",
      mudanca: "",
      sentimento: "",
      tipo: undefined,
      titulo: "",
      descricao: "",
      valor_alvo: "",
      valor_atual: "0",
      prazo: "",
      categoria_id: "",
      cartao_id: "",
    });
  };

  return {
    form,
    tipo,
    expenseCategories,
    cards,
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,
    canProceed,
    getSubmitData,
    resetForm,
  };
};

// Re-export types for convenience
export type { GoalFormData } from "@/lib/validations";
