import { useState } from "react";
import type { Category } from "@/hooks/api/useCategories";

interface CategoryFormData {
  nome: string;
  descricao: string;
  tipo: string;
  cor_hex: string;
}

interface UseCategoryFormProps {
  mode: "create" | "edit";
  category?: Category;
  defaultType?: string;
}

const getInitialFormState = (
  mode: "create" | "edit",
  category?: Category,
  defaultType?: string
): CategoryFormData => {
  if (mode === "edit" && category) {
    return {
      nome: category.nome || "",
      descricao: category.descricao || "",
      tipo: category.tipo || defaultType || "",
      cor_hex: category.cor_hex || "",
    };
  }

  return {
    nome: "",
    descricao: "",
    tipo: defaultType || "",
    cor_hex: "",
  };
};

export const useCategoryForm = ({
  mode,
  category,
  defaultType,
}: UseCategoryFormProps) => {
  const [formData, setFormData] = useState<CategoryFormData>(() =>
    getInitialFormState(mode, category, defaultType)
  );

  const updateField = (field: keyof CategoryFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(getInitialFormState("create", undefined, defaultType));
  };

  const initializeEditMode = () => {
    if (mode === "edit" && category) {
      setFormData(getInitialFormState("edit", category, defaultType));
    }
  };

  const getSubmitData = () => {
    if (mode === "edit" && category?.id) {
      return {
        id: category.id,
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
