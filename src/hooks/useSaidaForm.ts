import { useState } from "react";
import { parseLocalDate } from "@/lib/formatters";
import type { Saida } from "@/hooks/api/useSaidas";

interface SaidaFormData {
  descricao: string;
  categoria_id: string;
  valor: string;
  tipo: string;
}

interface UseSaidaFormProps {
  mode: "create" | "edit";
  saida?: Saida & { categorias?: { nome: string; cor_hex?: string } };
}

const getInitialFormState = (
  mode: "create" | "edit",
  saida?: Saida & { categorias?: { nome: string; cor_hex?: string } }
): SaidaFormData => {
  if (mode === "edit" && saida) {
    return {
      descricao: saida.descricao || "",
      categoria_id: saida.categoria_id ? String(saida.categoria_id) : "",
      valor: saida.valor != null ? String(saida.valor) : "",
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
  saida?: Saida & { categorias?: { nome: string; cor_hex?: string } }
): Date | undefined => {
  if (mode === "edit" && saida?.data) {
    try {
      return parseLocalDate(saida.data);
    } catch {
      return undefined;
    }
  }
  return undefined;
};

export const useSaidaForm = ({ mode, saida }: UseSaidaFormProps) => {
  const [formData, setFormData] = useState<SaidaFormData>(() =>
    getInitialFormState(mode, saida)
  );
  const [date, setDate] = useState<Date | undefined>(() =>
    getInitialDate(mode, saida)
  );

  const updateField = (field: keyof SaidaFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(getInitialFormState("create"));
    setDate(undefined);
  };

  const initializeEditMode = () => {
    if (mode === "edit" && saida) {
      setFormData(getInitialFormState("edit", saida));
      setDate(getInitialDate("edit", saida));
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

