import { useGoalsPage } from "@/hooks/useGoalsPage";
import { PageSkeleton } from "@/components/PageSkeleton";
import { PaginationButton } from "@/components/PaginationButton";
import {
  PageHeader,
  SummaryCards,
  GoalsGrid,
  EmptyState,
  FilterTabs,
  KakeiboTip,
} from "./components";

export default function GoalsPage() {
  const {
    paginatedGoals,
    summary,
    isLoading,
    handleRefresh,
    currentPage,
    setCurrentPage,
    totalPages,
    statusFilter,
    setStatusFilter,
  } = useGoalsPage();

  if (isLoading) {
    return <PageSkeleton hasCards cardCount={4} hasTable />;
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-colors sm:p-8">
          <PageHeader onRefresh={handleRefresh} isLoading={isLoading} />

          <div className="mt-8 space-y-6">
            <SummaryCards
              total={summary.total}
              active={summary.active}
              completed={summary.completed}
              paused={summary.paused}
              totalProgress={summary.totalProgress}
            />

            <FilterTabs activeFilter={statusFilter} onFilterChange={setStatusFilter} />

            {paginatedGoals.length > 0 ? (
              <>
                <GoalsGrid goals={paginatedGoals} />
                {totalPages > 1 && (
                  <div className="mt-6">
                    <PaginationButton
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState />
            )}

            <KakeiboTip />
          </div>
        </section>
      </div>
    </div>
  );
}
