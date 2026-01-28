import { Edit, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IncomeModal } from "@/components/dialogs/entry-modal";
import { ExpenseModal } from "@/components/dialogs/expenses-modal";
import { DeleteTransactionDialog } from "./DeleteTransactionDialog";
import { formatCurrency, formatLocalDate } from "@/lib/formatters";
import {
  buildCategoryBadgeTokens,
  DEFAULT_CATEGORY_COLOR as INCOME_COLOR,
} from "@/lib/entryUtils";
import { DEFAULT_CATEGORY_COLOR as EXPENSE_COLOR } from "@/lib/expenseUtils";
import type { Transaction } from "@/hooks/transactions/useTransactionsPage";

interface TransactionRowProps {
  transaction: Transaction;
  onDelete: (id: number, type: "income" | "expense") => void;
  isPending: boolean;
}

export const TransactionRow = ({
  transaction,
  onDelete,
  isPending,
}: TransactionRowProps) => {
  const isIncome = transaction.type === "income";
  const defaultColor = isIncome ? INCOME_COLOR : EXPENSE_COLOR;

  const { accent: accentColor, style: badgeStyle } = buildCategoryBadgeTokens(
    transaction.categories?.hex_color,
    defaultColor
  );
  const categoryName = transaction.categories?.name || "Sem categoria";

  return (
    <TableRow
      className={`border-b border-[#F1F5F9] last:border-0 ${
        isIncome ? "hover:bg-[#F8FAFC]" : "hover:bg-[#FEF2F2]/50"
      }`}
    >
      <TableCell className="whitespace-nowrap text-sm font-semibold text-[#0F172A]">
        {formatLocalDate(transaction.date)}
      </TableCell>
      <TableCell className="px-6 py-4">
        {isIncome ? (
          <div className="flex items-center text-[#16A34A]">
            <ArrowUpCircle className="mr-1.5 h-4 w-4" />
            <span className="font-medium">Entrada</span>
          </div>
        ) : (
          <div className="flex items-center text-[#DC2626]">
            <ArrowDownCircle className="mr-1.5 h-4 w-4" />
            <span className="font-medium">Saída</span>
          </div>
        )}
      </TableCell>
      <TableCell className="max-w-[280px] text-sm text-[#4B5563]">
        {transaction.description}
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
      <TableCell
        className={`whitespace-nowrap text-right text-sm font-semibold ${
          isIncome ? "text-[#16A34A]" : "text-[#DC2626]"
        }`}
      >
        {isIncome ? "+ " : "- "}
        {formatCurrency(transaction.amount)}
      </TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-2">
          {isIncome ? (
            <IncomeModal
              mode="edit"
              income={transaction}
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`Editar ${transaction.description || "entrada"}`}
                  className="h-9 w-9 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-0 text-[#2563EB] transition-colors hover:bg-[#DBEAFE]"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />
          ) : (
            <ExpenseModal
              mode="edit"
              expense={transaction}
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`Editar ${transaction.description || "saída"}`}
                  className="h-9 w-9 rounded-xl border border-[#FB923C] bg-[#FFF7ED] p-0 text-[#EA580C] transition-colors hover:bg-[#FFEAD5]"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />
          )}
          <DeleteTransactionDialog
            transactionId={transaction.id}
            transactionType={transaction.type}
            transactionDescription={transaction.description}
            onDelete={onDelete}
            isPending={isPending}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};
