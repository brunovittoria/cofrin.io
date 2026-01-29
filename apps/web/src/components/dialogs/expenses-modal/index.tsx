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
import { useCreateExpense, useUpdateExpense, type Expense } from "@/hooks/api/useExpenses";
import { toLocalDateString, parseLocalDate } from "@/lib/formatters";
import { expenseSchema, type ExpenseFormData } from "@/lib/validations";
import { DateField } from "./components/DateField";
import { DescriptionField } from "./components/DescriptionField";
import { CategoryField } from "./components/CategoryField";
import { ValueField } from "./components/ValueField";
import { TypeField } from "./components/TypeField";
import { FormActions } from "./components/FormActions";

interface ExpenseModalProps {
  trigger?: React.ReactNode;
  mode?: "create" | "edit";
  expense?: Expense & { categories?: { name: string; hex_color?: string } };
}

export function ExpenseModal({ trigger, mode = "create", expense }: ExpenseModalProps) {
  const [open, setOpen] = useState(false);
  const { data: categories = [] } = useCategories("saida");
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    mode: "onChange",
    defaultValues: {
      date: undefined,
      descricao: "",
      categoria_id: "",
      valor: "",
      tipo: "",
    },
  });

  // Reset form when expense changes (for edit mode)
  useEffect(() => {
    if (open && mode === "edit" && expense) {
      try {
        const expenseDate = expense.date ? parseLocalDate(expense.date) : undefined;
        form.reset({
          date: expenseDate,
          descricao: expense.description || "",
          categoria_id: expense.category_id ? String(expense.category_id) : "",
          valor: expense.amount != null ? String(expense.amount) : "",
          tipo: "",
        });
      } catch {
        form.reset({
          date: undefined,
          descricao: expense.description || "",
          categoria_id: expense.category_id ? String(expense.category_id) : "",
          valor: expense.amount != null ? String(expense.amount) : "",
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
  }, [open, mode, expense, form]);

  const handleSubmit = (data: ExpenseFormData) => {
    const payload = {
      date: toLocalDateString(data.date),
      description: data.descricao || undefined,
      amount: parseFloat(data.valor.replace(",", ".")),
      category_id: parseInt(data.categoria_id, 10),
    };

    if (mode === "edit" && expense?.id) {
      updateExpense.mutate(
        { id: expense.id, ...payload },
        {
          onSuccess: () => {
            setOpen(false);
            form.reset();
          },
        }
      );
    } else {
      createExpense.mutate(payload, {
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
    <Button className="h-11 rounded-2xl bg-[#DC2626] px-6 text-sm font-semibold text-white shadow-[0_20px_36px_-20px_rgba(220,38,38,0.5)] transition-transform hover:-translate-y-0.5 hover:bg-[#B91C1C]">
      <Plus className="h-4 w-4" />
      Nova Saída
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold tracking-tight text-[#0F172A]">
            {mode === "edit" ? "Editar Saída" : "Nova Saída"}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#6B7280]">
            Registre despesas com o mesmo visual premium e claro aplicado no restante do sistema.
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
              isCreating={createExpense.isPending}
              isUpdating={updateExpense.isPending}
              onCancel={() => setOpen(false)}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
