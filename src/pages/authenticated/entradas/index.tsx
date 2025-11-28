import { Toaster } from "@/components/ui/toaster";
import { useEntradasPage } from "@/hooks/useEntradasPage";
import { PageHeader } from "./components/PageHeader";
import { SummaryCards } from "./components/SummaryCards";
import { FilterBar } from "./components/FilterBar";
import { EntriesTable } from "./components/EntriesTable";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export default function Entradas() {
  const [searchParams] = useSearchParams();
  const {
    dateRange,
    setDateRange,
    searchTerm,
    setSearchTerm,
    filteredEntradas,
    summary,
    deleteEntrada,
    isLoading,
    handleRefresh,
  } = useEntradasPage();

  useEffect(() => {
    const categoria = searchParams.get("categoria");
    if (categoria) {
      setSearchTerm(categoria);
    }
  }, [searchParams, setSearchTerm]);

  if (isLoading) {
    return (
      <LoadingSkeleton dateRange={dateRange} onDateRangeChange={setDateRange} />
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-colors sm:p-8">
          <PageHeader
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onRefresh={handleRefresh}
          />

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
