import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  useCreateCategory,
  useUpdateCategory,
  type Category,
} from "@/hooks/api/useCategories";
import { useCategoryForm } from "@/hooks/categories/useCategoryForm";
import { CategoryNameField } from "./components/CategoryNameField";
import { CategoryDescriptionField } from "./components/CategoryDescriptionField";
import { CategoryTypeField } from "./components/CategoryTypeField";
import { CategoryColorField } from "./components/CategoryColorField";
import { FormActions } from "./components/FormActions";

interface CategoryModalProps {
  trigger?: React.ReactNode;
  defaultType?: string;
  mode?: "create" | "edit";
  category?: Category;
}

export function CategoryModal({
  trigger,
  defaultType,
  mode = "create",
  category,
}: CategoryModalProps) {
  const [open, setOpen] = useState(false);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const {
    formData,
    updateField,
    resetForm,
    initializeEditMode,
    getSubmitData,
  } = useCategoryForm({
    mode,
    category,
    defaultType,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = getSubmitData();

    if (mode === "edit") {
      updateCategory.mutate(submitData, {
        onSuccess: () => {
          setOpen(false);
        },
      });
      return;
    }

    createCategory.mutate(submitData, {
      onSuccess: () => {
        setOpen(false);
        resetForm();
      },
    });
  };

  const handleOpenChange = (next: boolean) => {
    if (next && mode === "edit") {
      initializeEditMode();
    }
    setOpen(next);
  };

  const defaultTrigger = (
    <Button className="h-11 rounded-2xl border border-[#CBD5F5] bg-white px-5 text-sm font-semibold text-[#0F172A] shadow-[0_18px_32px_-24px_rgba(15,23,42,0.18)] transition-transform hover:-translate-y-0.5 hover:bg-[#EEF2FF]">
      <Plus className="h-4 w-4" />
      Nova Categoria
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold tracking-tight text-[#0F172A]">
            {mode === "edit" ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#6B7280]">
            Defina nome, tipo e cor das categorias mantendo o visual leve e
            sofisticado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <CategoryNameField
            value={formData.name}
            onChange={(value) => updateField("name", value)}
          />

          <CategoryDescriptionField
            value={formData.description}
            onChange={(value) => updateField("description", value)}
          />

          <CategoryTypeField
            value={formData.type}
            onChange={(value) => updateField("type", value)}
          />

          <CategoryColorField
            value={formData.hex_color}
            onChange={(value) => updateField("hex_color", value)}
          />

          <FormActions
            mode={mode}
            isCreating={createCategory.isPending}
            isUpdating={updateCategory.isPending}
            onCancel={() => setOpen(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
