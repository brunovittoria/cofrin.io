import { Toaster } from "@/components/ui/toaster";
import { MonthPicker } from "@/components/MonthPicker";
import { useFutureLaunchesPage } from "@/hooks/useFutureLaunchesPage";
import { PageHeader } from "./components/PageHeader";
import { SummaryCards } from "./components/SummaryCards";
import { PendingLaunchesTable } from "./components/PendingLaunchesTable";
import { CompletedLaunchesTable } from "./components/CompletedLaunchesTable";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { TableSectionHeader } from "./components/TableSectionHeader";
import { PaginationButton } from "@/components/PaginationButton";

export default function FutureLaunches() {
  const {
    searchTerm,
    dateRange,
    setDateRange,
    paginatedPending,
    paginatedCompleted,
    summary,
    completeLaunch,
    deleteLaunch,
    loadingPending,
    loadingCompleted,
    handleRefresh,
    currentPagePending,
    setCurrentPagePending,
    totalPagesPending,
    currentPageCompleted,
    setCurrentPageCompleted,
    totalPagesCompleted,
  } = useFutureLaunchesPage();

  if (loadingPending || loadingCompleted) {
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
              toReceive={summary?.toReceive || 0}
              toPay={summary?.toPay || 0}
              projectedBalance={summary?.projectedBalance || 0}
              completed={summary?.completed || 0}
            />
            <section className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-colors">
              <div className="flex flex-col gap-4">
                <TableSectionHeader
                  title="Lista de Lançamentos Futuros"
                  description="Gerenciamento de todos os lançamentos previstos"
                />
                <div>
                  <PendingLaunchesTable
                    launches={paginatedPending}
                    searchTerm={searchTerm}
                    onComplete={completeLaunch.mutate}
                    onDelete={deleteLaunch.mutate}
                    isPendingComplete={completeLaunch.isPending}
                    isPendingDelete={deleteLaunch.isPending}
                  />
                  {totalPagesPending > 1 && (
                    <div className="mt-4">
                      <PaginationButton
                        currentPage={currentPagePending}
                        totalPages={totalPagesPending}
                        onPageChange={setCurrentPagePending}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <CompletedLaunchesTable launches={paginatedCompleted} />
                  {totalPagesCompleted > 1 && (
                    <div className="mt-4">
                      <PaginationButton
                        currentPage={currentPageCompleted}
                        totalPages={totalPagesCompleted}
                        onPageChange={setCurrentPageCompleted}
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
