import { useState } from "react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FinancialCard } from "@/components/FinancialCard";
import { IncomeExpenseChart } from "@/components/Charts/IncomeExpenseChart";
import { CategoryChart } from "@/components/Charts/CategoryChart";
import { BalanceChart } from "@/components/Charts/BalanceChart";
import { IncomeModal } from "@/components/dialogs/entry-modal";
import { ExpenseModal } from "@/components/dialogs/expenses-modal";
import { MyCardsSection } from "@/components/MyCardsSection";
import { MonthPicker } from "@/components/MonthPicker";
import { PageSkeleton } from "@/components/PageSkeleton";
import { RefreshButton } from "@/components/RefreshButton";
import { useIncomesSummary, useIncomesSummaryPreviousMonth } from "@/hooks/api/useIncomes";
import { useExpensesSummary, useExpensesSummaryPreviousMonth } from "@/hooks/api/useExpenses";
import { useCards } from "@/hooks/api/useCards";
import { useFutureLaunchesSummary, useFutureLaunchesSummaryPreviousMonth } from "@/hooks/api/useFutureLaunches";
import { calculatePercentageChange } from "@/lib/trendUtils";
import { formatCurrency } from "@/lib/formatters";
import { useFiltersStore } from "@/stores";

const DashboardPage = () => {
  const dateRange = useFiltersStore((state) => state.dashboardDateRange);
  const setDateRange = useFiltersStore((state) => state.setDashboardDateRange);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: futureSummary,
    isLoading: isLoadingFuture,
    refetch: refetchFuture,
  } = useFutureLaunchesSummary(dateRange);

  const {
    data: incomesSummary,
    isLoading: isLoadingIncomes,
    refetch: refetchIncomes,
  } = useIncomesSummary(dateRange);

  const {
    data: expensesSummary,
    isLoading: isLoadingExpenses,
    refetch: refetchExpenses,
  } = useExpensesSummary(dateRange);

  const {
    data: cards,
    isLoading: isLoadingCards,
    refetch: refetchCards,
  } = useCards();

  // Previous month data
  const { data: incomesSummaryPrevious } = useIncomesSummaryPreviousMonth(dateRange);
  const { data: expensesSummaryPrevious } = useExpensesSummaryPreviousMonth(dateRange);
  const { data: futureSummaryPrevious } = useFutureLaunchesSummaryPreviousMonth(dateRange);

  const totalIncomes = incomesSummary?.total || 0;
  const totalExpenses = expensesSummary?.total || 0;
  const currentBalance = totalIncomes - totalExpenses;

  // Calculate previous month values
  const totalIncomesPrevious = incomesSummaryPrevious?.total || 0;
  const totalExpensesPrevious = expensesSummaryPrevious?.total || 0;
  const currentBalancePrevious = totalIncomesPrevious - totalExpensesPrevious;
  const toReceivePrevious = futureSummaryPrevious?.toReceive || 0;
  const toPayPrevious = futureSummaryPrevious?.toPay || 0;

  // Calculate trends
  const incomesTrend = calculatePercentageChange(totalIncomes, totalIncomesPrevious);
  const expensesTrend = calculatePercentageChange(totalExpenses, totalExpensesPrevious);
  const balanceTrend = calculatePercentageChange(currentBalance, currentBalancePrevious);
  const toReceiveTrend = calculatePercentageChange(futureSummary?.toReceive || 0, toReceivePrevious);
  const toPayTrend = calculatePercentageChange(futureSummary?.toPay || 0, toPayPrevious);

  // Create tooltip texts
  const incomesTooltip = `Comparado ao mês anterior: ${formatCurrency(totalIncomesPrevious)} → ${formatCurrency(totalIncomes)} (variação de ${incomesTrend.value})`;
  const expensesTooltip = `Comparado ao mês anterior: ${formatCurrency(totalExpensesPrevious)} → ${formatCurrency(totalExpenses)} (variação de ${expensesTrend.value})`;
  const balanceTooltip = `Comparado ao mês anterior: ${formatCurrency(currentBalancePrevious)} → ${formatCurrency(currentBalance)} (variação de ${balanceTrend.value})`;
  const toReceiveTooltip = `Comparado ao mês anterior: ${formatCurrency(toReceivePrevious)} → ${formatCurrency(futureSummary?.toReceive || 0)} (variação de ${toReceiveTrend.value})`;
  const toPayTooltip = `Comparado ao mês anterior: ${formatCurrency(toPayPrevious)} → ${formatCurrency(futureSummary?.toPay || 0)} (variação de ${toPayTrend.value})`;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchIncomes(), refetchExpenses(), refetchCards()]);
    setIsRefreshing(false);
  };

  const isLoading =
    isLoadingIncomes || isLoadingExpenses || isLoadingCards || isRefreshing;

  if (isLoading) {
    return <PageSkeleton hasCards cardCount={3} hasChart hasTable={false} />;
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <header className="flex flex-col gap-6 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Visão Geral
              </p>
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold text-foreground">
                  Dashboard Financeira
                </h1>
                <p className="text-sm text-muted-foreground">
                  Visão completa e organizada das suas finanças
                </p>
              </div>
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <RefreshButton
                onRefresh={handleRefresh}
                isLoading={isRefreshing}
              />
              <MonthPicker dateRange={dateRange} onSelect={setDateRange} />
              <IncomeModal
                trigger={
                  <Button className="h-12 rounded-2xl bg-[#0A84FF] px-6 text-sm font-semibold text-white shadow-[0px_20px_32px_-18px_rgba(10,132,255,0.6)] transition-transform hover:-translate-y-0.5 hover:bg-[#006FDB]">
                    + Nova Entrada
                    <TrendingUp className="h-4 w-4" />
                  </Button>
                }
              />
              <ExpenseModal
                trigger={
                  <Button
                    variant="outline"
                    className="h-12 rounded-2xl border-border bg-card px-6 text-sm font-semibold text-foreground shadow-[0px_20px_32px_-24px_rgba(15,23,42,0.16)] transition-transform hover:-translate-y-0.5 hover:bg-accent"
                  >
                    + Nova Saída
                    <TrendingDown className="h-4 w-4" />
                  </Button>
                }
              />
            </div>
          </header>

          <div className="flex mt-8 gap-6">
            <FinancialCard
              title="Total de Entradas"
              value={formatCurrency(totalIncomes)}
              icon={TrendingUp}
              variant="success"
              trend={{
                value: incomesTrend.value,
                isPositive: incomesTrend.isPositive,
                tooltipText: incomesTooltip,
              }}
            />
            <FinancialCard
              title="Total de Saídas"
              value={formatCurrency(totalExpenses)}
              icon={TrendingDown}
              variant="danger"
              trend={{
                value: expensesTrend.value,
                isPositive: expensesTrend.isPositive,
                tooltipText: expensesTooltip,
              }}
            />
            <FinancialCard
              title="Saldo Atual"
              value={formatCurrency(currentBalance)}
              icon={Wallet}
              variant="info"
              trend={{
                value: balanceTrend.value,
                isPositive: balanceTrend.isPositive,
                tooltipText: balanceTooltip,
              }}
            />
            <FinancialCard
              title="A Receber (previsto)"
              value={formatCurrency(futureSummary?.toReceive || 0)}
              icon={TrendingUp}
              variant="info"
              trend={{
                value: toReceiveTrend.value,
                isPositive: toReceiveTrend.isPositive,
                tooltipText: toReceiveTooltip,
              }}
            />
            <FinancialCard
              title="A Pagar (previsto)"
              value={formatCurrency(futureSummary?.toPay || 0)}
              icon={TrendingDown}
              variant="danger"
              trend={{
                value: toPayTrend.value,
                isPositive: toPayTrend.isPositive,
                tooltipText: toPayTooltip,
              }}
            />
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <IncomeExpenseChart dateRange={dateRange} />
            <MyCardsSection cards={cards || []} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <CategoryChart dateRange={dateRange} type="saidas" />
            <BalanceChart dateRange={dateRange} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
