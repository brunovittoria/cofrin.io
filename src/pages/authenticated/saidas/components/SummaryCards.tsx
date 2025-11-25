import { type LucideIcon, TrendingDown } from "lucide-react";
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
  icon: Icon,
  badgeClass = "bg-[#FEF2F2] text-[#DC2626]",
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
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
        <Icon className="h-6 w-6" />
      </span>
    </div>
  </article>
);

export const SummaryCards = ({ total, count, average }: SummaryCardsProps) => {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-3">
      <SummaryCard
        title="Total de Saídas"
        value={formatCurrency(total)}
        icon={TrendingDown}
      />
      <SummaryCard
        title="Quantidade"
        value={count}
        icon={TrendingDown}
        badgeClass="bg-[#FFF7ED] text-[#EA580C]"
      />
      <SummaryCard
        title="Média por Saída"
        value={formatCurrency(average)}
        icon={TrendingDown}
        badgeClass="bg-[#FEE2E2] text-[#DC2626]"
      />
    </div>
  );
};

