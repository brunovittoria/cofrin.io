import { useState } from "react";
import { parseLocalDate } from "@/lib/formatters";
import type { Expense } from "@/hooks/api/useExpenses";

interface ExpenseFormData {
  descricao: string;
  categoria_id: string;
  valor: string;
  tipo: string;
}

interface UseExpenseFormProps {
  mode: "create" | "edit";
  expense?: Expense & { categorias?: { nome: string; cor_hex?: string } };
}

const getInitialFormState = (
  mode: "create" | "edit",
  expense?: Expense & { categorias?: { nome: string; cor_hex?: string } }
): ExpenseFormData => {
  if (mode === "edit" && expense) {
    return {
      descricao: expense.descricao || "",
      categoria_id: expense.categoria_id ? String(expense.categoria_id) : "",
      valor: expense.valor != null ? String(expense.valor) : "",
      tipo: "",
    };
  }

  return {
    descricao: "",
    categoria_id: "",
    valor: "",
    tipo: "",
  };
};

const getInitialDate = (
  mode: "create" | "edit",
  expense?: Expense & { categorias?: { nome: string; cor_hex?: string } }
): Date | undefined => {
  if (mode === "edit" && expense?.data) {
    try {
      return parseLocalDate(expense.data);
    } catch {
      return undefined;
    }
  }
  return undefined;
};

export const useExpenseForm = ({ mode, expense }: UseExpenseFormProps) => {
  const [formData, setFormData] = useState<ExpenseFormData>(() =>
    getInitialFormState(mode, expense)
  );
  const [date, setDate] = useState<Date | undefined>(() =>
    getInitialDate(mode, expense)
  );

  const updateField = (field: keyof ExpenseFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(getInitialFormState("create"));
    setDate(undefined);
  };

  const initializeEditMode = () => {
    if (mode === "edit" && expense) {
      setFormData(getInitialFormState("edit", expense));
      setDate(getInitialDate("edit", expense));
    }
  };

  return {
    formData,
    date,
    setDate,
    updateField,
    resetForm,
    initializeEditMode,
  };
};
