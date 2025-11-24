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
import { type Categoria } from "@/hooks/api/useCategories";

interface DeleteCategoryDialogProps {
  categoria: Categoria;
  onDelete: (id: number) => void;
  isPending: boolean;
}

export const DeleteCategoryDialog = ({
  categoria,
  onDelete,
  isPending,
}: DeleteCategoryDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-0 text-[#DC2626] transition-colors hover:bg-[#FEE2E2]"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza de que deseja excluir esta categoria? Esta ação não
            pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-[#DC2626] text-white hover:bg-[#B91C1C]"
            onClick={() => onDelete(Number(categoria.id))}
          >
            {isPending ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

