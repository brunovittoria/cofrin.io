import { Toaster } from "@/components/ui/toaster";
import { MonthPicker } from "@/components/MonthPicker";
import { useFuturosPage } from "@/hooks/useFuturosPage";
import { PageHeader } from "./components/PageHeader";
import { SummaryCards } from "./components/SummaryCards";
import { PendingLaunchesTable } from "./components/PendingLaunchesTable";
import { CompletedLaunchesTable } from "./components/CompletedLaunchesTable";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { TableSectionHeader } from "./components/TableSectionHeader";
import { PaginationButton } from "@/components/PaginationButton";

export default function Futuros() {
  const {
    searchTerm,
    dateRange,
    setDateRange,
    paginatedPendentes,
    paginatedEfetivados,
    summary,
    efetivarLancamento,
    deleteLancamento,
    loadingPendentes,
    loadingEfetivados,
    handleRefresh,
    currentPagePendentes,
    setCurrentPagePendentes,
    totalPagesPendentes,
    currentPageEfetivados,
    setCurrentPageEfetivados,
    totalPagesEfetivados,
  } = useFuturosPage();

  if (loadingPendentes || loadingEfetivados) {
    return <LoadingSkeleton onRefresh={handleRefresh} />;
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-colors sm:p-8">
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
            <section className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-colors">
              <div className="flex flex-col gap-4">
                <TableSectionHeader
                  title="Lista de Lançamentos Futuros"
                  description="Gerenciamento de todos os lançamentos previstos"
                />
                <div>
                  <PendingLaunchesTable
                    launches={paginatedPendentes}
                    searchTerm={searchTerm}
                    onEfetivar={efetivarLancamento.mutate}
                    onDelete={deleteLancamento.mutate}
                    isPendingEfetivar={efetivarLancamento.isPending}
                    isPendingDelete={deleteLancamento.isPending}
                  />
                  {totalPagesPendentes > 1 && (
                    <div className="mt-4">
                      <PaginationButton
                        currentPage={currentPagePendentes}
                        totalPages={totalPagesPendentes}
                        onPageChange={setCurrentPagePendentes}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <CompletedLaunchesTable launches={paginatedEfetivados} />
                  {totalPagesEfetivados > 1 && (
                    <div className="mt-4">
                      <PaginationButton
                        currentPage={currentPageEfetivados}
                        totalPages={totalPagesEfetivados}
                        onPageChange={setCurrentPageEfetivados}
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
      <Toaster />
    </div>
  );
}
