import { useState } from "react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { FinancialCard } from "@/components/FinancialCard";
import { IncomeExpenseChart } from "@/components/charts/IncomeExpenseChart";
import { CategoryChart } from "@/components/charts/CategoryChart";
import { BalanceChart } from "@/components/charts/BalanceChart";
import { EntradaModal } from "@/components/dialogs/entry-modal";
import { SaidaModal } from "@/components/dialogs/expenses-modal";
import { MyCardsSection } from "@/components/MyCardsSection";
import { MonthPicker } from "@/components/MonthPicker";
import { useEntradasSummary } from "@/hooks/api/useEntradas";
import { useSaidasSummary } from "@/hooks/api/useSaidas";
import { useCartoes } from "@/hooks/api/useCartoes";

const Index = () => {
  // Default to current month
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { from: firstDay, to: lastDay };
  });

  const { data: entradasSummary } = useEntradasSummary(dateRange);
  const { data: saidasSummary } = useSaidasSummary(dateRange);
  const { data: cartoes, isLoading: isLoadingCartoes } = useCartoes();

  const totalEntradas = entradasSummary?.total || 0;
  const totalSaidas = saidasSummary?.total || 0;
  const saldoAtual = totalEntradas - totalSaidas;

  return (
    <div className="min-h-screen bg-[#F5F7FA] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
        <section className="muted-card p-6 sm:p-8">
          <header className="flex flex-col gap-6 border-b border-[#E5E7EB] pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#94A3B8]">
                Visão Geral
              </p>
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold text-[#0F172A]">
                  Dashboard Financeira
                </h1>
                <p className="text-sm text-[#4B5563]">
                  Visão completa e organizada das suas finanças
                </p>
              </div>
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
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
                    className="h-12 rounded-2xl border-[#CBD5F5] bg-white px-6 text-sm font-semibold text-[#0F172A] shadow-[0px_20px_32px_-24px_rgba(15,23,42,0.16)] transition-transform hover:-translate-y-0.5 hover:bg-[#EEF2FF]"
                  >
                    + Nova Saída
                    <TrendingDown className="h-4 w-4" />
                  </Button>
                }
              />
            </div>
          </header>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <FinancialCard
              title="Total de Entradas"
              value={`R$ ${totalEntradas.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}`}
              icon={TrendingUp}
              variant="success"
              trend={{ value: "12,5%", isPositive: true }}
            />
            <FinancialCard
              title="Total de Saídas"
              value={`R$ ${totalSaidas.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}`}
              icon={TrendingDown}
              variant="danger"
              trend={{ value: "3,2%", isPositive: false }}
            />
            <FinancialCard
              title="Saldo Atual"
              value={`R$ ${saldoAtual.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}`}
              icon={Wallet}
              variant="info"
              trend={{ value: "15,8%", isPositive: saldoAtual >= 0 }}
            />
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <IncomeExpenseChart dateRange={dateRange} />
            <MyCardsSection cartoes={cartoes || []} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <CategoryChart dateRange={dateRange} />
            <BalanceChart dateRange={dateRange} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
