import { Toaster } from "@/components/ui/toaster";
import { useSaidasPage } from "@/hooks/useSaidasPage";
import { PageHeader } from "./components/PageHeader";
import { SummaryCards } from "./components/SummaryCards";
import { FilterBar } from "./components/FilterBar";
import { ExpensesTable } from "./components/ExpensesTable";
import { LoadingSkeleton } from "./components/LoadingSkeleton";

export default function Saidas() {
  const {
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    filteredSaidas,
    summary,
    deleteSaida,
    isLoading,
  } = useSaidasPage();

  if (isLoading) {
    return (
      <LoadingSkeleton
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
        <section className="muted-card p-6 sm:p-8">
          <PageHeader dateRange={dateRange} onDateRangeChange={setDateRange} />

          <SummaryCards
            total={summary?.total || 0}
            count={summary?.count || 0}
            average={summary?.average || 0}
          />

          <div className="mt-8 space-y-6">
            <FilterBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <ExpensesTable
              expenses={filteredSaidas}
              searchTerm={searchTerm}
              onDelete={deleteSaida.mutate}
              isPendingDelete={deleteSaida.isPending}
            />
          </div>
        </section>
      </div>
      <Toaster />
    </div>
  );
}

