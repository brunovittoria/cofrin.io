import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteTransactionDialogProps {
  transactionId: number;
  transactionType: "income" | "expense";
  transactionDescription?: string;
  onDelete: (id: number, type: "income" | "expense") => void;
  isPending: boolean;
}

export const DeleteTransactionDialog = ({
  transactionId,
  transactionType,
  transactionDescription,
  onDelete,
  isPending,
}: DeleteTransactionDialogProps) => {
  const typeLabel = transactionType === "income" ? "entrada" : "saída";

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Excluir ${transactionDescription || typeLabel}`}
          className="h-9 w-9 rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-0 text-[#DC2626] transition-colors hover:bg-[#FEE2E2]"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza de que deseja excluir esta {typeLabel}? Esta ação não
            pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-[#DC2626] text-white hover:bg-[#B91C1C]"
            onClick={() => onDelete(transactionId, transactionType)}
          >
            {isPending ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

