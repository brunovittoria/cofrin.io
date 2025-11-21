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
import { useCategories } from "@/hooks/useCategories";
import { useCreateEntrada, useUpdateEntrada, type Entrada } from "@/hooks/useEntradas";
import { toLocalDateString } from "@/lib/formatters";
import { useEntradaForm } from "@/hooks/useEntradaForm";
import { DateField } from "./components/DateField";
import { DescriptionField } from "./components/DescriptionField";
import { CategoryField } from "./components/CategoryField";
import { ValueField } from "./components/ValueField";
import { TypeField } from "./components/TypeField";
import { FormActions } from "./components/FormActions";

interface EntradaModalProps {
  trigger?: React.ReactNode;
  mode?: "create" | "edit";
  entrada?: Entrada & { categorias?: { nome: string; cor_hex?: string } };
}

export function EntradaModal({ trigger, mode = "create", entrada }: EntradaModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { data: categorias = [] } = useCategories("entrada");
  const createEntrada = useCreateEntrada();
  const updateEntrada = useUpdateEntrada();

  const { formData, date, setDate, updateField, resetForm, initializeEditMode } = useEntradaForm({
    mode,
    entrada,
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
      data: toLocalDateString(date),
      descricao: formData.descricao || undefined,
      valor: parseFloat(formData.valor),
      categoria_id: parseInt(formData.categoria_id),
    };

    if (mode === "edit" && entrada?.id) {
      updateEntrada.mutate(
        { id: entrada.id, ...payload },
        {
          onSuccess: () => {
            setOpen(false);
          },
        }
      );
    } else {
      createEntrada.mutate(payload, {
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
            Registre o movimento com data, categoria e valor mantendo a linguagem visual premium
            light.
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
            categorias={categorias}
          />

          <ValueField
            value={formData.valor}
            onChange={(value) => updateField("valor", value)}
          />

          <TypeField value={formData.tipo} onChange={(value) => updateField("tipo", value)} />

          <FormActions
            mode={mode}
            isCreating={createEntrada.isPending}
            isUpdating={updateEntrada.isPending}
            onCancel={() => setOpen(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

