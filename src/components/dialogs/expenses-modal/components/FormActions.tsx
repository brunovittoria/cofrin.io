import { Button } from "@/components/ui/button";

interface FormActionsProps {
  mode: "create" | "edit";
  isCreating?: boolean;
  isUpdating?: boolean;
  onCancel: () => void;
}

export const FormActions = ({ mode, isCreating, isUpdating, onCancel }: FormActionsProps) => {
  const isSaving = mode === "edit" ? isUpdating : isCreating;

  return (
    <div className="flex justify-end gap-3 pt-4">
      <Button
        type="button"
        variant="ghost"
        className="h-11 rounded-xl border border-[#E5E7EB] bg-white px-5 text-sm font-semibold text-[#0F172A] hover:bg-[#F3F4F6]"
        onClick={onCancel}
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        variant="ghost"
        className="brand-cta-luxe h-11 rounded-xl px-6 text-sm font-semibold tracking-wide hover:scale-[1.01]"
        disabled={isSaving}
      >
        {mode === "edit"
          ? isUpdating
            ? "Salvando..."
            : "Salvar Alterações"
          : isCreating
            ? "Criando..."
            : "Criar Saída"}
      </Button>
    </div>
  );
};

