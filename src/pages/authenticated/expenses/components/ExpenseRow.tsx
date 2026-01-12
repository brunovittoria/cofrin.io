import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ExpenseModal } from "@/components/dialogs/expenses-modal";
import { DeleteExpenseDialog } from "./DeleteExpenseDialog";
import { formatCurrency, formatLocalDate } from "@/lib/formatters";
import {
  buildCategoryBadgeTokens,
  DEFAULT_CATEGORY_COLOR,
} from "@/lib/expenseUtils";

interface ExpenseRowProps {
  expense: {
    id: number;
    data: string;
    descricao?: string;
    valor: number;
    categorias?: {
      nome?: string;
      cor_hex?: string;
    } | null;
  };
  onDelete: (id: number) => void;
  isPendingDelete: boolean;
}

export const ExpenseRow = ({
  expense,
  onDelete,
  isPendingDelete,
}: ExpenseRowProps) => {
  const { accent: accentColor, style: badgeStyle } = buildCategoryBadgeTokens(
    expense.categorias?.cor_hex,
    DEFAULT_CATEGORY_COLOR
  );
  const categoryName = expense.categorias?.nome || "Sem categoria";

  return (
    <TableRow className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#FEF2F2]">
      <TableCell className="whitespace-nowrap text-sm font-semibold text-[#0F172A]">
        {formatLocalDate(expense.data)}
      </TableCell>
      <TableCell className="max-w-[280px] text-sm text-[#4B5563]">
        {expense.descricao}
      </TableCell>
      <TableCell className="w-[220px]">
        <Badge
          variant="outline"
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0F172A]"
          style={badgeStyle}
        >
          <span className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: accentColor,
                boxShadow: "0 0 0 4px " + accentColor + "22",
              }}
            />
            <span className="whitespace-nowrap">{categoryName}</span>
          </span>
        </Badge>
      </TableCell>
      <TableCell className="whitespace-nowrap text-right text-sm font-semibold text-[#DC2626]">
        {formatCurrency(expense.valor)}
      </TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-2">
          <ExpenseModal
            mode="edit"
            expense={expense}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                aria-label={`Editar ${expense.descricao || "saída"}`}
                className="h-9 w-9 rounded-xl border border-[#FB923C] bg-[#FFF7ED] p-0 text-[#EA580C] transition-colors hover:bg-[#FFEAD5]"
              >
                <Edit className="h-4 w-4" />
              </Button>
            }
          />
          <DeleteExpenseDialog
            expenseId={expense.id}
            expenseDescription={expense.descricao}
            onDelete={onDelete}
            isPending={isPendingDelete}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};
