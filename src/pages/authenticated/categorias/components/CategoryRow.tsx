import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { CategoryModal } from "@/components/dialogs/category-modal";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { colorStyle } from "@/lib/categoryUtils";
import { type Categoria } from "@/hooks/api/useCategories";

interface CategoryRowProps {
  categoria: Categoria;
  onDelete: (id: number) => void;
  isPending: boolean;
}

export const CategoryRow = ({
  categoria,
  onDelete,
  isPending,
}: CategoryRowProps) => {
  return (
    <TableRow
      key={categoria.id}
      className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]"
    >
      <TableCell className="text-sm font-semibold text-[#0F172A]">
        <div className="flex items-center gap-3">
          <span
            className="h-3 w-3 rounded-full"
            style={colorStyle(categoria.cor_hex || undefined)}
          />
          {categoria.nome}
        </div>
      </TableCell>
      <TableCell className="text-sm text-[#4B5563]">
        {categoria.descricao || "Sem descrição"}
      </TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-2">
          <CategoryModal
            mode="edit"
            categoria={categoria}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-0 text-[#2563EB] transition-colors hover:bg-[#DBEAFE]"
              >
                <Edit className="h-4 w-4" />
              </Button>
            }
          />
          <DeleteCategoryDialog
            categoria={categoria}
            onDelete={onDelete}
            isPending={isPending}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

