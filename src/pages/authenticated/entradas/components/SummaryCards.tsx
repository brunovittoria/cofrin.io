import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";

interface SummaryCardsProps {
  total: number;
  count: number;
  average: number;
}

const SummaryCard = ({
  title,
  value,
  badgeClass = "bg-[#ECFDF3] text-[#16A34A]",
}: {
  title: string;
  value: string | number;
  badgeClass?: string;
}) => (
  <article className="surface-card p-6">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-[#6B7280]">{title}</p>
        <p className="mt-2 text-2xl font-semibold text-[#0F172A]">{value}</p>
      </div>
      <span
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-2xl",
          badgeClass
        )}
      >
        <TrendingUp className="h-6 w-6" />
      </span>
    </div>
  </article>
);

export const SummaryCards = ({ total, count, average }: SummaryCardsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <SummaryCard
        title="Total de Entradas"
        value={formatCurrency(total)}
        badgeClass="bg-[#ECFDF3] text-[#16A34A]"
      />
      <SummaryCard
        title="Quantidade"
        value={count}
        badgeClass="bg-[#EEF2FF] text-[#0A84FF]"
      />
      <SummaryCard
        title="Média por Entrada"
        value={formatCurrency(average)}
        badgeClass="bg-[#F5F3FF] text-[#7C3AED]"
      />
    </div>
  );
};

