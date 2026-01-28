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
import { Form } from "@/components/ui/form";
import { toLocalDateString } from "@/lib/formatters";
import {
  useCreateFutureLaunch,
  useUpdateFutureLaunch,
  type FutureLaunch,
} from "@/hooks/api/useFutureLaunches";
import { useFutureLaunchForm } from "@/hooks/future-launches/useFutureLaunchForm";
import type { FutureLaunchFormData } from "@/lib/validations";
import { DateFormField } from "./components/DateFormField";
import { TypeFormField } from "./components/TypeFormField";
import { DescriptionFormField } from "./components/DescriptionFormField";
import { CategoryFormField } from "./components/CategoryFormField";
import { ValueFormField } from "./components/ValueFormField";
import { FormActions } from "./components/FormActions";

interface FutureLaunchModalProps {
  trigger?: React.ReactNode;
  mode?: "create" | "edit";
  launch?: FutureLaunch & {
    categories?: { name: string; hex_color?: string };
  };
}

export function FutureLaunchModal({
  trigger,
  mode = "create",
  launch,
}: FutureLaunchModalProps) {
  const [open, setOpen] = useState(false);
  const createLaunch = useCreateFutureLaunch();
  const updateLaunch = useUpdateFutureLaunch();

  const { form, tipo, categories } = useFutureLaunchForm({
    mode,
    launch,
    open,
  });

  const handleSubmit = (data: FutureLaunchFormData) => {
    const payload = {
      date: toLocalDateString(data.data),
      type: data.tipo,
      description: data.descricao,
      category_id: parseInt(data.categoria_id, 10),
      amount: parseFloat(data.valor.replace(",", ".")),
    };

    if (mode === "edit" && launch) {
      updateLaunch.mutate(
        { id: launch.id, ...payload },
        {
          onSuccess: () => {
            setOpen(false);
            form.reset();
          },
        }
      );
    } else {
      createLaunch.mutate(payload, {
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
    <Button className="h-12 rounded-2xl bg-[#0A84FF] px-6 text-sm font-semibold text-white shadow-[0px_20px_32px_-18px_rgba(10,132,255,0.6)] transition-transform hover:-translate-y-0.5 hover:bg-[#006FDB]">
      <Plus className="h-4 w-4 mr-2" />
      Novo Lançamento
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold tracking-tight text-[#0F172A]">
            {mode === "edit"
              ? "Editar Lançamento Futuro"
              : "Novo Lançamento Futuro"}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#6B7280]">
            Registre um lançamento previsto para o futuro com data, tipo,
            categoria e valor.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            <DateFormField control={form.control} />

            <TypeFormField control={form.control} setValue={form.setValue} />

            <DescriptionFormField control={form.control} />

            <CategoryFormField
              control={form.control}
              categories={categories}
              tipo={tipo}
            />

            <ValueFormField control={form.control} />

            <FormActions
              mode={mode}
              isSubmitting={form.formState.isSubmitting}
              isPending={
                createLaunch.isPending || updateLaunch.isPending
              }
              onCancel={() => setOpen(false)}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
