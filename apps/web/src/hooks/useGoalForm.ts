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
        porque: goal.reflection_why || "",
        mudanca: goal.reflection_change || "",
        sentimento: goal.reflection_feeling || "",
        tipo: goal.type,
        titulo: goal.title,
        descricao: goal.description || "",
        valor_alvo: String(goal.target_amount),
        valor_atual: String(goal.current_amount),
        prazo: goal.deadline,
        categoria_id: goal.category_id?.toString() || "",
        cartao_id: goal.card_id?.toString() || "",
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
      title: values.titulo.trim(),
      type: values.tipo as GoalType,
      description: values.descricao?.trim() || undefined,
      target_amount: parseFloat(values.valor_alvo.replace(",", ".")),
      current_amount: parseFloat(values.valor_atual?.replace(",", ".") || "0"),
      deadline: values.prazo,
      category_id: values.categoria_id ? parseInt(values.categoria_id, 10) : null,
      card_id: values.cartao_id ? parseInt(values.cartao_id, 10) : null,
      reflection_why: values.porque.trim(),
      reflection_change: values.mudanca.trim(),
      reflection_feeling: values.sentimento?.trim() || undefined,
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
