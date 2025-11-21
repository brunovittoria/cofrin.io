import { useState } from "react";
import type { Categoria } from "@/hooks/useCategories";

interface CategoryFormData {
  nome: string;
  descricao: string;
  tipo: string;
  cor_hex: string;
}

interface UseCategoryFormProps {
  mode: "create" | "edit";
  categoria?: Categoria;
  defaultTipo?: string;
}

const getInitialFormState = (
  mode: "create" | "edit",
  categoria?: Categoria,
  defaultTipo?: string
): CategoryFormData => {
  if (mode === "edit" && categoria) {
    return {
      nome: categoria.nome || "",
      descricao: categoria.descricao || "",
      tipo: categoria.tipo || defaultTipo || "",
      cor_hex: categoria.cor_hex || "",
    };
  }

  return {
    nome: "",
    descricao: "",
    tipo: defaultTipo || "",
    cor_hex: "",
  };
};

export const useCategoryForm = ({ mode, categoria, defaultTipo }: UseCategoryFormProps) => {
  const [formData, setFormData] = useState<CategoryFormData>(() =>
    getInitialFormState(mode, categoria, defaultTipo)
  );

  const updateField = (field: keyof CategoryFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(getInitialFormState("create", undefined, defaultTipo));
  };

  const initializeEditMode = () => {
    if (mode === "edit" && categoria) {
      setFormData(getInitialFormState("edit", categoria, defaultTipo));
    }
  };

  const getSubmitData = () => {
    if (mode === "edit" && categoria?.id) {
      return {
        id: categoria.id,
        nome: formData.nome,
        descricao: formData.descricao || undefined,
        tipo: formData.tipo,
        cor_hex: formData.cor_hex,
      };
    }

    return {
      nome: formData.nome,
      descricao: formData.descricao || undefined,
      tipo: formData.tipo,
      cor_hex: formData.cor_hex,
    };
  };

  return {
    formData,
    updateField,
    resetForm,
    initializeEditMode,
    getSubmitData,
  };
};

