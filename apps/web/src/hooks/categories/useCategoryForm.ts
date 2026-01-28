import { useState } from "react";
import type { Category } from "@/hooks/api/useCategories";

interface CategoryFormData {
  name: string;
  description: string;
  type: string;
  hex_color: string;
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
      name: category.name || "",
      description: category.description || "",
      type: category.type || defaultType || "",
      hex_color: category.hex_color || "",
    };
  }

  return {
    name: "",
    description: "",
    type: defaultType || "",
    hex_color: "",
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
        name: formData.name,
        description: formData.description || undefined,
        type: formData.type,
        hex_color: formData.hex_color,
      };
    }

    return {
      name: formData.name,
      description: formData.description || undefined,
      type: formData.type,
      hex_color: formData.hex_color,
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
