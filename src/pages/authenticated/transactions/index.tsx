import { Toaster } from "@/components/ui/toaster";
import { useTransactionsPage } from "@/hooks/useTransactionsPage";
import { PageHeader } from "./components/PageHeader";
import { TransactionMetrics } from "./components/TransactionMetrics";
import { FilterBar } from "./components/FilterBar";
import { TransactionTable } from "./components/TransactionTable";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export default function Transactions() {
  const [searchParams] = useSearchParams();
  const {
    dateRange,
    setDateRange,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    filteredTransactions,
    metrics,
    handleDelete,
    deleteEntrada,
    deleteSaida,
    isLoading,
    handleRefresh,
  } = useTransactionsPage();

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

          <div className="mt-8">
            <TransactionMetrics
              totalIncome={metrics.totalIncome}
              totalExpenses={metrics.totalExpenses}
              balance={metrics.balance}
              incomeCount={metrics.incomeCount}
              expenseCount={metrics.expenseCount}
            />
          </div>

          <div className="mt-8 space-y-6">
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
            <TransactionTable
              transactions={filteredTransactions}
              searchTerm={searchTerm}
              onDelete={handleDelete}
              isPending={deleteEntrada.isPending || deleteSaida.isPending}
            />
          </div>
        </section>
      </div>
      <Toaster />
    </div>
  );
}

