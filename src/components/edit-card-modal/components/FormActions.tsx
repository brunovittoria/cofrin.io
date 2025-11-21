import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isSaving?: boolean;
  onCancel: () => void;
}

export const FormActions = ({ isSaving, onCancel }: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        variant="ghost"
        className="h-9 rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm font-medium text-[#0F172A] hover:bg-[#F3F4F6]"
        onClick={onCancel}
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        className="brand-cta-luxe h-9 rounded-lg px-5 text-sm font-semibold"
        disabled={isSaving}
      >
        {isSaving ? "Salvando..." : "Salvar"}
      </Button>
    </div>
  );
};

