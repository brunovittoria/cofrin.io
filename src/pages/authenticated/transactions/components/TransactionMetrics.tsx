import { TrendingUp, TrendingDown, Wallet, Info } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";
import { useIncomesSummaryPreviousMonth } from "@/hooks/api/useIncomes";
import { useExpensesSummaryPreviousMonth } from "@/hooks/api/useExpenses";
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
        {subtitle && (
          <p className="text-xs text-[#9CA3AF]">{subtitle}</p>
        )}
        {trend && trend.tooltipText && (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-medium",
                trend.isPositive ? "text-[#16A34A]" : "text-[#DC2626]"
              )}
            >
              {trend.value}
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-5 w-5 items-center justify-center rounded-md hover:bg-accent transition-colors"
                  >
                    <Info size={14} className="text-[#9CA3AF]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm">{trend.tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
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
  dateRange,
}: TransactionMetricsProps) => {
  const isPositiveBalance = balance >= 0;

  // Fetch previous month data
  const { data: incomesSummaryPrevious } = useIncomesSummaryPreviousMonth(dateRange);
  const { data: expensesSummaryPrevious } = useExpensesSummaryPreviousMonth(dateRange);

  // Calculate previous month values
  const totalIncomePrevious = incomesSummaryPrevious?.total || 0;
  const totalExpensesPrevious = expensesSummaryPrevious?.total || 0;
  const balancePrevious = totalIncomePrevious - totalExpensesPrevious;

  // Calculate trends
  const incomeTrend = calculatePercentageChange(totalIncome, totalIncomePrevious);
  const expensesTrend = calculatePercentageChange(totalExpenses, totalExpensesPrevious);
  const balanceTrend = calculatePercentageChange(balance, balancePrevious);

  // Create tooltip texts
  const incomeTooltip = `Comparado ao mês anterior: ${formatCurrency(totalIncomePrevious)} → ${formatCurrency(totalIncome)} (variação de ${incomeTrend.value})`;
  const expensesTooltip = `Comparado ao mês anterior: ${formatCurrency(totalExpensesPrevious)} → ${formatCurrency(totalExpenses)} (variação de ${expensesTrend.value})`;
  const balanceTooltip = `Comparado ao mês anterior: ${formatCurrency(balancePrevious)} → ${formatCurrency(balance)} (variação de ${balanceTrend.value})`;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <MetricCard
        title="Total de Entradas"
        value={formatCurrency(totalIncome)}
        icon={<TrendingUp className="h-6 w-6" />}
        badgeClass="bg-[#ECFDF3]"
        iconClass="text-[#16A34A]"
        subtitle={`${incomeCount} ${incomeCount === 1 ? "registro" : "registros"}`}
        trend={{
          value: incomeTrend.value,
          isPositive: incomeTrend.isPositive,
          tooltipText: incomeTooltip,
        }}
      />
      <MetricCard
        title="Total de Saídas"
        value={formatCurrency(totalExpenses)}
        icon={<TrendingDown className="h-6 w-6" />}
        badgeClass="bg-[#FEF2F2]"
        iconClass="text-[#DC2626]"
        subtitle={`${expenseCount} ${expenseCount === 1 ? "registro" : "registros"}`}
        trend={{
          value: expensesTrend.value,
          isPositive: expensesTrend.isPositive,
          tooltipText: expensesTooltip,
        }}
      />
      <MetricCard
        title="Saldo Líquido"
        value={formatCurrency(balance)}
        icon={<Wallet className="h-6 w-6" />}
        badgeClass={isPositiveBalance ? "bg-[#ECFDF3]" : "bg-[#FEF2F2]"}
        iconClass={isPositiveBalance ? "text-[#16A34A]" : "text-[#DC2626]"}
        subtitle="Saldo atual disponível"
        trend={{
          value: balanceTrend.value,
          isPositive: balanceTrend.isPositive,
          tooltipText: balanceTooltip,
        }}
      />
    </div>
  );
};

