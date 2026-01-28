import { Toaster } from "@/components/ui/toaster";
import { useTransactionsPage } from "@/hooks/transactions/useTransactionsPage";
import { PageHeader } from "./components/PageHeader";
import { TransactionMetrics } from "./components/TransactionMetrics";
import { FilterBar } from "./components/FilterBar";
import { TransactionTable } from "./components/TransactionTable";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { getRouteApi } from "@tanstack/react-router";
import { useEffect } from "react";
import { Pagination } from "@/components/ui/pagination";
import { PaginationButton } from "@/components/PaginationButton";

const routeApi = getRouteApi("/_authenticated/transactions");

export default function Transactions() {
  const search = routeApi.useSearch();
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
    deleteIncome,
    deleteExpense,
    isLoading,
    handleRefresh,
    paginatedTransactions,
    totalPages,
    currentPage,
    setCurrentPage,
  } = useTransactionsPage();

  useEffect(() => {
    if (search.categoria) {
      setSearchTerm(search.categoria);
    }
  }, [search.categoria, setSearchTerm]);

  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [searchTerm, activeFilter, dateRange, setCurrentPage]);

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
              dateRange={dateRange}
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
              transactions={paginatedTransactions}
              searchTerm={searchTerm}
              onDelete={handleDelete}
              isPending={deleteIncome.isPending || deleteExpense.isPending}
            />
          </div>


          {totalPages > 1 && (
            <div className="mt-4">
              <PaginationButton currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
            </div>
          )}
        </section>
      </div>
      <Toaster />
    </div>
  );
}
