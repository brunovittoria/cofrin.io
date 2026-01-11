import { useState } from "react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { FinancialCard } from "@/components/FinancialCard";
import { IncomeExpenseChart } from "@/components/Charts/IncomeExpenseChart";
import { CategoryChart } from "@/components/Charts/CategoryChart";
import { BalanceChart } from "@/components/Charts/BalanceChart";
import { EntradaModal } from "@/components/dialogs/entry-modal";
import { SaidaModal } from "@/components/dialogs/expenses-modal";
import { MyCardsSection } from "@/components/MyCardsSection";
import { MonthPicker } from "@/components/MonthPicker";
import { PageSkeleton } from "@/components/PageSkeleton";
import { RefreshButton } from "@/components/RefreshButton";
import { useEntradasSummary, useEntradasSummaryPreviousMonth } from "@/hooks/api/useEntradas";
import { useSaidasSummary, useSaidasSummaryPreviousMonth } from "@/hooks/api/useSaidas";
import { useCartoes } from "@/hooks/api/useCartoes";
import { useLancamentosFuturosSummary, useLancamentosFuturosSummaryPreviousMonth } from "@/hooks/api/useLancamentosFuturos";
import { calculatePercentageChange } from "@/lib/trendUtils";
import { formatCurrency } from "@/lib/formatters";

const DashboardPage = () => {
  // Default to current month
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { from: firstDay, to: lastDay };
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: futurosSummary,
    isLoading: isLoadingFuturos,
    refetch: refetchFuturos,
  } = useLancamentosFuturosSummary(dateRange);

  const {
    data: entradasSummary,
    isLoading: isLoadingEntradas,
    refetch: refetchEntradas,
  } = useEntradasSummary(dateRange);

  const {
    data: saidasSummary,
    isLoading: isLoadingSaidas,
    refetch: refetchSaidas,
  } = useSaidasSummary(dateRange);

  const {
    data: cartoes,
    isLoading: isLoadingCartoes,
    refetch: refetchCartoes,
  } = useCartoes();

  // Previous month data
  const { data: entradasSummaryPrevious } = useEntradasSummaryPreviousMonth(dateRange);
  const { data: saidasSummaryPrevious } = useSaidasSummaryPreviousMonth(dateRange);
  const { data: futurosSummaryPrevious } = useLancamentosFuturosSummaryPreviousMonth(dateRange);

  const totalEntradas = entradasSummary?.total || 0;
  const totalSaidas = saidasSummary?.total || 0;
  const saldoAtual = totalEntradas - totalSaidas;

  // Calculate previous month values
  const totalEntradasPrevious = entradasSummaryPrevious?.total || 0;
  const totalSaidasPrevious = saidasSummaryPrevious?.total || 0;
  const saldoAtualPrevious = totalEntradasPrevious - totalSaidasPrevious;
  const aReceberPrevious = futurosSummaryPrevious?.aReceber || 0;
  const aPagarPrevious = futurosSummaryPrevious?.aPagar || 0;

  // Calculate trends
  const entradasTrend = calculatePercentageChange(totalEntradas, totalEntradasPrevious);
  const saidasTrend = calculatePercentageChange(totalSaidas, totalSaidasPrevious);
  const saldoTrend = calculatePercentageChange(saldoAtual, saldoAtualPrevious);
  const aReceberTrend = calculatePercentageChange(futurosSummary?.aReceber || 0, aReceberPrevious);
  const aPagarTrend = calculatePercentageChange(futurosSummary?.aPagar || 0, aPagarPrevious);

  // Create tooltip texts
  const entradasTooltip = `Comparado ao mês anterior: ${formatCurrency(totalEntradasPrevious)} → ${formatCurrency(totalEntradas)} (variação de ${entradasTrend.value})`;
  const saidasTooltip = `Comparado ao mês anterior: ${formatCurrency(totalSaidasPrevious)} → ${formatCurrency(totalSaidas)} (variação de ${saidasTrend.value})`;
  const saldoTooltip = `Comparado ao mês anterior: ${formatCurrency(saldoAtualPrevious)} → ${formatCurrency(saldoAtual)} (variação de ${saldoTrend.value})`;
  const aReceberTooltip = `Comparado ao mês anterior: ${formatCurrency(aReceberPrevious)} → ${formatCurrency(futurosSummary?.aReceber || 0)} (variação de ${aReceberTrend.value})`;
  const aPagarTooltip = `Comparado ao mês anterior: ${formatCurrency(aPagarPrevious)} → ${formatCurrency(futurosSummary?.aPagar || 0)} (variação de ${aPagarTrend.value})`;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchEntradas(), refetchSaidas(), refetchCartoes()]);
    setIsRefreshing(false);
  };

  const isLoading =
    isLoadingEntradas || isLoadingSaidas || isLoadingCartoes || isRefreshing;

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
              <EntradaModal
                trigger={
                  <Button className="h-12 rounded-2xl bg-[#0A84FF] px-6 text-sm font-semibold text-white shadow-[0px_20px_32px_-18px_rgba(10,132,255,0.6)] transition-transform hover:-translate-y-0.5 hover:bg-[#006FDB]">
                    + Nova Entrada
                    <TrendingUp className="h-4 w-4" />
                  </Button>
                }
              />
              <SaidaModal
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
              value={formatCurrency(totalEntradas)}
              icon={TrendingUp}
              variant="success"
              trend={{
                value: entradasTrend.value,
                isPositive: entradasTrend.isPositive,
                tooltipText: entradasTooltip,
              }}
            />
            <FinancialCard
              title="Total de Saídas"
              value={formatCurrency(totalSaidas)}
              icon={TrendingDown}
              variant="danger"
              trend={{
                value: saidasTrend.value,
                isPositive: saidasTrend.isPositive,
                tooltipText: saidasTooltip,
              }}
            />
            <FinancialCard
              title="Saldo Atual"
              value={formatCurrency(saldoAtual)}
              icon={Wallet}
              variant="info"
              trend={{
                value: saldoTrend.value,
                isPositive: saldoTrend.isPositive,
                tooltipText: saldoTooltip,
              }}
            />
            <FinancialCard
              title="A Receber (previsto)"
              value={formatCurrency(futurosSummary?.aReceber || 0)}
              icon={TrendingUp}
              variant="info"
              trend={{
                value: aReceberTrend.value,
                isPositive: aReceberTrend.isPositive,
                tooltipText: aReceberTooltip,
              }}
            />
            <FinancialCard
              title="A Pagar (previsto)"
              value={formatCurrency(futurosSummary?.aPagar || 0)}
              icon={TrendingDown}
              variant="danger"
              trend={{
                value: aPagarTrend.value,
                isPositive: aPagarTrend.isPositive,
                tooltipText: aPagarTooltip,
              }}
            />
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <IncomeExpenseChart dateRange={dateRange} />
            <MyCardsSection cartoes={cartoes || []} />
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
