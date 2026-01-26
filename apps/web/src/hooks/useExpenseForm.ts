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
  expense?: Expense & { categories?: { name: string; hex_color?: string } };
}

const getInitialFormState = (
  mode: "create" | "edit",
  expense?: Expense & { categories?: { name: string; hex_color?: string } }
): ExpenseFormData => {
  if (mode === "edit" && expense) {
    return {
      descricao: expense.description || "",
      categoria_id: expense.category_id ? String(expense.category_id) : "",
      valor: expense.amount != null ? String(expense.amount) : "",
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
  expense?: Expense & { categories?: { name: string; hex_color?: string } }
): Date | undefined => {
  if (mode === "edit" && expense?.date) {
    try {
      return parseLocalDate(expense.date);
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
