import { Toaster } from "@/components/ui/toaster";
import { useEntradasPage } from "@/hooks/useEntradasPage";
import { PageHeader } from "./components/PageHeader";
import { SummaryCards } from "./components/SummaryCards";
import { FilterBar } from "./components/FilterBar";
import { EntriesTable } from "./components/EntriesTable";
import { LoadingSkeleton } from "./components/LoadingSkeleton";

export default function Entradas() {
  const {
    dateRange,
    setDateRange,
    searchTerm,
    setSearchTerm,
    filteredEntradas,
    summary,
    deleteEntrada,
    isLoading,
  } = useEntradasPage();

  if (isLoading) {
    return (
      <LoadingSkeleton dateRange={dateRange} onDateRangeChange={setDateRange} />
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
        <section className="muted-card p-6 sm:p-8">
          <PageHeader dateRange={dateRange} onDateRangeChange={setDateRange} />

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <SummaryCards
              total={summary?.total || 0}
              count={summary?.count || 0}
              average={summary?.average || 0}
            />
          </div>

          <div className="mt-8 space-y-6">
            <FilterBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <EntriesTable
              entries={filteredEntradas}
              searchTerm={searchTerm}
              onDelete={deleteEntrada.mutate}
              isPending={deleteEntrada.isPending}
            />
          </div>
        </section>
      </div>
      <Toaster />
    </div>
  );
}
