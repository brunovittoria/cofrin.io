import { useState } from "react";
import { parseLocalDate } from "@/lib/formatters";
import type { Income } from "@/hooks/api/useIncomes";

interface IncomeFormData {
  descricao: string;
  categoria_id: string;
  valor: string;
  tipo: string;
}

interface UseIncomeFormProps {
  mode: "create" | "edit";
  income?: Income & { categories?: { name: string; hex_color?: string } };
}

const getInitialFormState = (
  mode: "create" | "edit",
  income?: Income & { categories?: { name: string; hex_color?: string } }
): IncomeFormData => {
  if (mode === "edit" && income) {
    return {
      descricao: income.description || "",
      categoria_id: income.category_id ? String(income.category_id) : "",
      valor: income.amount != null ? String(income.amount) : "",
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
  income?: Income & { categories?: { name: string; hex_color?: string } }
): Date | undefined => {
  if (mode === "edit" && income?.date) {
    try {
      return parseLocalDate(income.date);
    } catch {
      return undefined;
    }
  }
  return undefined;
};

export const useIncomeForm = ({ mode, income }: UseIncomeFormProps) => {
  const [formData, setFormData] = useState<IncomeFormData>(() =>
    getInitialFormState(mode, income)
  );
  const [date, setDate] = useState<Date | undefined>(() =>
    getInitialDate(mode, income)
  );

  const updateField = (field: keyof IncomeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(getInitialFormState("create"));
    setDate(undefined);
  };

  const initializeEditMode = () => {
    if (mode === "edit" && income) {
      setFormData(getInitialFormState("edit", income));
      setDate(getInitialDate("edit", income));
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
