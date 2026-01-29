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
import { useCategories } from "@/hooks/api/useCategories";
import {
  useCreateIncome,
  useUpdateIncome,
  type Income,
} from "@/hooks/api/useIncomes";
import { toLocalDateString, parseLocalDate } from "@/lib/formatters";
import { incomeSchema, type IncomeFormData } from "@/lib/validations";
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
  const { data: categories = [] } = useCategories("entrada");
  const createIncome = useCreateIncome();
  const updateIncome = useUpdateIncome();

  const form = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    mode: "onChange",
    defaultValues: {
      date: undefined,
      descricao: "",
      categoria_id: "",
      valor: "",
      tipo: "",
    },
  });

  // Reset form when income changes (for edit mode)
  useEffect(() => {
    if (open && mode === "edit" && income) {
      try {
        const incomeDate = income.date ? parseLocalDate(income.date) : undefined;
        form.reset({
          date: incomeDate,
          descricao: income.description || "",
          categoria_id: income.category_id ? String(income.category_id) : "",
          valor: income.amount != null ? String(income.amount) : "",
          tipo: "",
        });
      } catch {
        form.reset({
          date: undefined,
          descricao: income.description || "",
          categoria_id: income.category_id ? String(income.category_id) : "",
          valor: income.amount != null ? String(income.amount) : "",
          tipo: "",
        });
      }
    } else if (open && mode === "create") {
      form.reset({
        date: undefined,
        descricao: "",
        categoria_id: "",
        valor: "",
        tipo: "",
      });
    }
  }, [open, mode, income, form]);

  const handleSubmit = (data: IncomeFormData) => {
    const payload = {
      date: toLocalDateString(data.date),
      description: data.descricao || undefined,
      amount: parseFloat(data.valor.replace(",", ".")),
      category_id: parseInt(data.categoria_id, 10),
    };

    if (mode === "edit" && income?.id) {
      updateIncome.mutate(
        { id: income.id, ...payload },
        {
          onSuccess: () => {
            setOpen(false);
            form.reset();
          },
        }
      );
    } else {
      createIncome.mutate(payload, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      });
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      form.reset();
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <DateField control={form.control} />

            <DescriptionField control={form.control} />

            <CategoryField control={form.control} categories={categories} />

            <ValueField control={form.control} />

            <TypeField control={form.control} />

            <FormActions
              mode={mode}
              isCreating={createIncome.isPending}
              isUpdating={updateIncome.isPending}
              onCancel={() => setOpen(false)}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
