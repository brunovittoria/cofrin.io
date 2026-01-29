import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  useCreateCategory,
  useUpdateCategory,
  type Category,
} from "@/hooks/api/useCategories";
import {
  categorySchema,
  type CategoryFormData,
} from "@/lib/validations";
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

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      type: defaultType as "entrada" | "saida" | undefined,
      hex_color: "",
    },
  });

  // Reset form when category changes (for edit mode)
  useEffect(() => {
    if (open && mode === "edit" && category) {
      form.reset({
        name: category.name || "",
        description: category.description || "",
        type: (category.type as "entrada" | "saida") || defaultType as "entrada" | "saida" | undefined,
        hex_color: category.hex_color || "",
      });
    } else if (open && mode === "create") {
      form.reset({
        name: "",
        description: "",
        type: defaultType as "entrada" | "saida" | undefined,
        hex_color: "",
      });
    }
  }, [open, mode, category, form, defaultType]);

  const handleSubmit = (data: CategoryFormData) => {
    const submitData = {
      name: data.name,
      description: data.description || undefined,
      type: data.type,
      hex_color: data.hex_color,
    };

    if (mode === "edit" && category?.id) {
      updateCategory.mutate(
        { id: category.id, ...submitData },
        {
          onSuccess: () => {
            setOpen(false);
            form.reset();
          },
        }
      );
      return;
    }

    createCategory.mutate(submitData, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      form.reset();
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <CategoryNameField control={form.control} />

            <CategoryDescriptionField control={form.control} />

            <CategoryTypeField control={form.control} />

            <CategoryColorField control={form.control} />

            <FormActions
              mode={mode}
              isCreating={createCategory.isPending}
              isUpdating={updateCategory.isPending}
              onCancel={() => setOpen(false)}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
