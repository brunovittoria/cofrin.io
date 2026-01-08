import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";
import { useEntradasSummaryPreviousMonth } from "@/hooks/api/useEntradas";
import { useSaidasSummaryPreviousMonth } from "@/hooks/api/useSaidas";
import { calculatePercentageChange } from "@/lib/trendUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TransactionMetricsProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  incomeCount: number;
  expenseCount: number;
  dateRange?: DateRange;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  badgeClass: string;
  iconClass: string;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
    tooltipText?: string;
  };
}

const MetricCard = ({
  title,
  value,
  icon,
  badgeClass,
  iconClass,
  subtitle,
  trend,
}: MetricCardProps) => (
  <article className="surface-card p-6">
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-[#6B7280]">{title}</p>
        <p className="text-2xl font-semibold text-[#0F172A]">{value}</p>
        <div className="flex flex-col gap-1">
          {subtitle && (
            <p className="text-xs text-[#9CA3AF]">{subtitle}</p>
          )}
          {trend && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold cursor-help w-fit",
                    trend.isPositive 
                      ? "bg-[#ECFDF3] text-[#16A34A]" 
                      : "bg-[#FEF2F2] text-[#DC2626]"
                  )}
                  >
                    {trend.value}
                  </span>
                </TooltipTrigger>
                {trend.tooltipText && (
                  <TooltipContent>
                    <p className="text-sm">{trend.tooltipText}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      <span
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-2xl",
          badgeClass
        )}
      >
        <span className={iconClass}>{icon}</span>
      </span>
    </div>
  </article>
);

export const TransactionMetrics = ({
  totalIncome,
  totalExpenses,
  balance,
  incomeCount,
  expenseCount,
}: TransactionMetricsProps) => {
  const isPositiveBalance = balance >= 0;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <MetricCard
        title="Total de Entradas"
        value={formatCurrency(totalIncome)}
        icon={<TrendingUp className="h-6 w-6" />}
        badgeClass="bg-[#ECFDF3]"
        iconClass="text-[#16A34A]"
        subtitle={`${incomeCount} ${incomeCount === 1 ? "registro" : "registros"}`}
      />
      <MetricCard
        title="Total de Saídas"
        value={formatCurrency(totalExpenses)}
        icon={<TrendingDown className="h-6 w-6" />}
        badgeClass="bg-[#FEF2F2]"
        iconClass="text-[#DC2626]"
        subtitle={`${expenseCount} ${expenseCount === 1 ? "registro" : "registros"}`}
      />
      <MetricCard
        title="Saldo Líquido"
        value={formatCurrency(balance)}
        icon={<Wallet className="h-6 w-6" />}
        badgeClass={isPositiveBalance ? "bg-[#ECFDF3]" : "bg-[#FEF2F2]"}
        iconClass={isPositiveBalance ? "text-[#16A34A]" : "text-[#DC2626]"}
        subtitle="Saldo atual disponível"
      />
    </div>
  );
};

