import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TransactionRow } from "./TransactionRow";
import type { Transaction } from "@/hooks/transactions/useTransactionsPage";

interface TransactionTableProps {
  transactions: Transaction[];
  searchTerm: string;
  onDelete: (id: number, type: "income" | "expense") => void;
  isPending: boolean;
}

export const TransactionTable = ({
  transactions,
  searchTerm,
  onDelete,
  isPending,
}: TransactionTableProps) => {
  return (
    <section className="surface-card p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Registros de Transações
            </h2>
            <span className="text-sm text-[#6B7280]">
              Mostrando {transactions.length}{" "}
              {transactions.length === 1 ? "registro" : "registros"}
            </span>
          </div>
          <p className="text-sm text-[#6B7280]">
            Acompanhe suas entradas e saídas em um só lugar
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#E5E7EB]">
                <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                  Data
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                  Tipo
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                  Descrição
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                  Categoria
                </TableHead>
                <TableHead className="text-right text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                  Valor
                </TableHead>
                <TableHead className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-sm text-[#6B7280]"
                  >
                    {searchTerm
                      ? "Nenhuma transação corresponde à busca."
                      : "Nenhuma transação cadastrada ainda."}
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TransactionRow
                    key={`${transaction.type}-${transaction.id}`}
                    transaction={transaction}
                    onDelete={onDelete}
                    isPending={isPending}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

