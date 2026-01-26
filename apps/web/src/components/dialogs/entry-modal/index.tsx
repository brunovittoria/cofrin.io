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
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/hooks/api/useCategories";
import {
  useCreateIncome,
  useUpdateIncome,
  type Income,
} from "@/hooks/api/useIncomes";
import { toLocalDateString } from "@/lib/formatters";
import { useIncomeForm } from "@/hooks/useIncomeForm";
import { DateField } from "./components/DateField";
import { DescriptionField } from "./components/DescriptionField";
import { CategoryField } from "./components/CategoryField";
import { ValueField } from "./components/ValueField";
import { TypeField } from "./components/TypeField";
import { FormActions } from "./components/FormActions";

interface IncomeModalProps {
  trigger?: React.ReactNode;
  mode?: "create" | "edit";
  income?: Income & { categories?: { name: string; hex_color?: string } };
}

export function IncomeModal({
  trigger,
  mode = "create",
  income,
}: IncomeModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { data: categories = [] } = useCategories("entrada");
  const createIncome = useCreateIncome();
  const updateIncome = useUpdateIncome();

  const {
    formData,
    date,
    setDate,
    updateField,
    resetForm,
    initializeEditMode,
  } = useIncomeForm({
    mode,
    income,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma data.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.categoria_id) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma categoria.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      date: toLocalDateString(date),
      description: formData.descricao || undefined,
      amount: parseFloat(formData.valor),
      category_id: parseInt(formData.categoria_id),
    };

    if (mode === "edit" && income?.id) {
      updateIncome.mutate(
        { id: income.id, ...payload },
        {
          onSuccess: () => {
            setOpen(false);
          },
        }
      );
    } else {
      createIncome.mutate(payload, {
        onSuccess: () => {
          setOpen(false);
          resetForm();
        },
      });
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (next && mode === "edit") {
      initializeEditMode();
    }
    setOpen(next);
  };

  const defaultTrigger = (
    <Button className="h-11 rounded-2xl bg-[#16A34A] px-6 text-sm font-semibold text-white shadow-[0_20px_36px_-20px_rgba(22,163,74,0.5)] transition-transform hover:-translate-y-0.5 hover:bg-[#15803D]">
      <Plus className="h-4 w-4" />
      Nova Entrada
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold tracking-tight text-[#0F172A]">
            {mode === "edit" ? "Editar Entrada" : "Nova Entrada"}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#6B7280]">
            Registre o movimento com data, categoria e valor mantendo a
            linguagem visual premium light.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <DateField value={date} onChange={setDate} />

          <DescriptionField
            value={formData.descricao}
            onChange={(value) => updateField("descricao", value)}
          />

          <CategoryField
            value={formData.categoria_id}
            onChange={(value) => updateField("categoria_id", value)}
            categories={categories}
          />

          <ValueField
            value={formData.valor}
            onChange={(value) => updateField("valor", value)}
          />

          <TypeField
            value={formData.tipo}
            onChange={(value) => updateField("tipo", value)}
          />

          <FormActions
            mode={mode}
            isCreating={createIncome.isPending}
            isUpdating={updateIncome.isPending}
            onCancel={() => setOpen(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
