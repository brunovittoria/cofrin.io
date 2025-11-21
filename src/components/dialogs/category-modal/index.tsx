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
import { useCreateCategoria, useUpdateCategoria, type Categoria } from "@/hooks/useCategories";
import { useCategoryForm } from "@/hooks/useCategoryForm";
import { CategoryNameField } from "./components/CategoryNameField";
import { CategoryDescriptionField } from "./components/CategoryDescriptionField";
import { CategoryTypeField } from "./components/CategoryTypeField";
import { CategoryColorField } from "./components/CategoryColorField";
import { FormActions } from "./components/FormActions";

interface CategoryModalProps {
  trigger?: React.ReactNode;
  defaultTipo?: string;
  mode?: "create" | "edit";
  categoria?: Categoria;
}

export function CategoryModal({
  trigger,
  defaultTipo,
  mode = "create",
  categoria,
}: CategoryModalProps) {
  const [open, setOpen] = useState(false);
  const createCategoria = useCreateCategoria();
  const updateCategoria = useUpdateCategoria();

  const { formData, updateField, resetForm, initializeEditMode, getSubmitData } = useCategoryForm({
    mode,
    categoria,
    defaultTipo,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = getSubmitData();

    if (mode === "edit") {
      updateCategoria.mutate(submitData, {
        onSuccess: () => {
          setOpen(false);
        },
      });
      return;
    }

    createCategoria.mutate(submitData, {
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
            Defina nome, tipo e cor das categorias mantendo o visual leve e sofisticado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <CategoryNameField
            value={formData.nome}
            onChange={(value) => updateField("nome", value)}
          />

          <CategoryDescriptionField
            value={formData.descricao}
            onChange={(value) => updateField("descricao", value)}
          />

          <CategoryTypeField
            value={formData.tipo}
            onChange={(value) => updateField("tipo", value)}
          />

          <CategoryColorField
            value={formData.cor_hex}
            onChange={(value) => updateField("cor_hex", value)}
          />

          <FormActions
            mode={mode}
            isCreating={createCategoria.isPending}
            isUpdating={updateCategoria.isPending}
            onCancel={() => setOpen(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

