import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCountLabel } from "@/lib/categoryUtils";

interface SummaryCardsProps {
  incomeCount: number;
  expenseCount: number;
}

export const SummaryCards = ({
  incomeCount,
  expenseCount,
}: SummaryCardsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <article className="surface-card p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#6B7280]">
              Categorias de Entrada
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#0F172A]">
              {incomeCount}
            </p>
            <p className="text-xs text-[#94A3B8]">
              {formatCountLabel(incomeCount)}
            </p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECFDF3] text-[#16A34A]">
            <TrendingUp className="h-6 w-6" />
          </span>
        </div>
      </article>
      <article className="surface-card p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#6B7280]">
              Categorias de Saída
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#0F172A]">
              {expenseCount}
            </p>
            <p className="text-xs text-[#94A3B8]">
              {formatCountLabel(expenseCount)}
            </p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FEF2F2] text-[#DC2626]">
            <TrendingDown className="h-6 w-6" />
          </span>
        </div>
      </article>
    </div>
  );
};
