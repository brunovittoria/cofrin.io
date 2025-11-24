import { Toaster } from "@/components/ui/toaster";
import { MonthPicker } from "@/components/MonthPicker";
import { useFuturosPage } from "@/hooks/useFuturosPage";
import { PageHeader } from "./components/PageHeader";
import { SummaryCards } from "./components/SummaryCards";
import { PendingLaunchesTable } from "./components/PendingLaunchesTable";
import { CompletedLaunchesTable } from "./components/CompletedLaunchesTable";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { TableSectionHeader } from "./components/TableSectionHeader";

export default function Futuros() {
  const {
    searchTerm,
    dateRange,
    setDateRange,
    filteredPendentes,
    lancamentosEfetivados,
    summary,
    efetivarLancamento,
    deleteLancamento,
    loadingPendentes,
    loadingEfetivados,
    handleRefresh,
  } = useFuturosPage();

  if (loadingPendentes || loadingEfetivados) {
    return <LoadingSkeleton onRefresh={handleRefresh} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
        <section className="muted-card p-6 sm:p-8">
          <PageHeader onRefresh={handleRefresh} />
          <MonthPicker
            dateRange={dateRange}
            onSelect={setDateRange}
            className="mt-2"
          />
          <div className="mt-8 space-y-6">
            <SummaryCards
              aReceber={summary?.aReceber || 0}
              aPagar={summary?.aPagar || 0}
              saldoPrevisto={summary?.saldoPrevisto || 0}
              efetivado={summary?.efetivado || 0}
            />
            <section className="surface-card p-6">
              <div className="flex flex-col gap-4">
                <TableSectionHeader
                  title="Lista de Lançamentos Futuros"
                  description="Gerenciamento de todos os lançamentos previstos"
                />
                <PendingLaunchesTable
                  launches={filteredPendentes}
                  searchTerm={searchTerm}
                  onEfetivar={efetivarLancamento.mutate}
                  onDelete={deleteLancamento.mutate}
                  isPendingEfetivar={efetivarLancamento.isPending}
                  isPendingDelete={deleteLancamento.isPending}
                />
                <CompletedLaunchesTable launches={lancamentosEfetivados} />
              </div>
            </section>
          </div>
        </section>
      </div>
      <Toaster />
    </div>
  );
}
