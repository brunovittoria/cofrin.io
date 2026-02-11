import { useCategoriesPage } from "@/hooks/categories/useCategoriesPage";
import { PageHeader } from "./components/PageHeader";
import { SummaryCards } from "./components/SummaryCards";
import { CategoryTable } from "./components/CategoryTable";
import { PageSkeleton } from "@/components/PageSkeleton";
import { PaginationButton } from "@/components/PaginationButton";

export default function Categories() {
  const { 
    incomeCategories, 
    expenseCategories,
    paginatedIncomeCategories,
    paginatedExpenseCategories,
    deleteCategory,
    isLoading,
    handleRefresh,
    currentPageIncome,
    setCurrentPageIncome,
    totalPagesIncome,
    currentPageExpense,
    setCurrentPageExpense,
    totalPagesExpense,
  } = useCategoriesPage();

  if (isLoading) {
    return <PageSkeleton hasCards cardCount={2} hasTable />;
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-colors sm:p-8">
          <PageHeader onRefresh={handleRefresh} />
          <div className="mt-8 space-y-6">
            <SummaryCards
              incomeCount={incomeCategories.length}
              expenseCount={expenseCategories.length}
            />
            <div>
              <CategoryTable
                tipo="entrada"
                title="Categorias de Entrada"
                categories={paginatedIncomeCategories}
                onDelete={deleteCategory.mutate}
                isPending={deleteCategory.isPending}
              />
              {totalPagesIncome > 1 && (
                <div className="mt-4">
                  <PaginationButton
                    currentPage={currentPageIncome}
                    totalPages={totalPagesIncome}
                    onPageChange={setCurrentPageIncome}
                  />
                </div>
              )}
            </div>
            <div>
              <CategoryTable
                tipo="saida"
                title="Categorias de Saída"
                categories={paginatedExpenseCategories}
                onDelete={deleteCategory.mutate}
                isPending={deleteCategory.isPending}
              />
              {totalPagesExpense > 1 && (
                <div className="mt-4">
                  <PaginationButton
                    currentPage={currentPageExpense}
                    totalPages={totalPagesExpense}
                    onPageChange={setCurrentPageExpense}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
