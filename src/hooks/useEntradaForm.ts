import { useState } from "react";
import { parseLocalDate } from "@/lib/formatters";
import type { Entrada } from "@/hooks/useEntradas";

interface EntradaFormData {
  descricao: string;
  categoria_id: string;
  valor: string;
  tipo: string;
}

interface UseEntradaFormProps {
  mode: "create" | "edit";
  entrada?: Entrada & { categorias?: { nome: string; cor_hex?: string } };
}

const getInitialFormState = (
  mode: "create" | "edit",
  entrada?: Entrada & { categorias?: { nome: string; cor_hex?: string } }
): EntradaFormData => {
  if (mode === "edit" && entrada) {
    return {
      descricao: entrada.descricao || "",
      categoria_id: entrada.categoria_id ? String(entrada.categoria_id) : "",
      valor: entrada.valor != null ? String(entrada.valor) : "",
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
  entrada?: Entrada & { categorias?: { nome: string; cor_hex?: string } }
): Date | undefined => {
  if (mode === "edit" && entrada?.data) {
    try {
      return parseLocalDate(entrada.data);
    } catch {
      return undefined;
    }
  }
  return undefined;
};

export const useEntradaForm = ({ mode, entrada }: UseEntradaFormProps) => {
  const [formData, setFormData] = useState<EntradaFormData>(() =>
    getInitialFormState(mode, entrada)
  );
  const [date, setDate] = useState<Date | undefined>(() =>
    getInitialDate(mode, entrada)
  );

  const updateField = (field: keyof EntradaFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(getInitialFormState("create"));
    setDate(undefined);
  };

  const initializeEditMode = () => {
    if (mode === "edit" && entrada) {
      setFormData(getInitialFormState("edit", entrada));
      setDate(getInitialDate("edit", entrada));
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
