import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  isLoading: boolean;
}

export const FormActions = ({ onCancel, isLoading }: FormActionsProps) => {
  return (
    <div className="flex gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
        className="flex-1"
      >
        Cancelar
      </Button>
      <Button type="submit" disabled={isLoading} className="flex-1">
        {isLoading ? "Salvando..." : "Registrar Check-in"}
      </Button>
    </div>
  );
};
