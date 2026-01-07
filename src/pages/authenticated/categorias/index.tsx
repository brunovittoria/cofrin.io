import { useCategoriasPage } from "@/hooks/useCategoriasPage";
import { PageHeader } from "./components/PageHeader";
import { SummaryCards } from "./components/SummaryCards";
import { CategoryTable } from "./components/CategoryTable";
import { PageSkeleton } from "@/components/PageSkeleton";
import { PaginationButton } from "@/components/PaginationButton";

export default function Categorias() {
  const { 
    categoriasEntrada, 
    categoriasSaida,
    paginatedCategoriasEntrada,
    paginatedCategoriasSaida,
    deleteCategoria,
    isLoading,
    handleRefresh,
    currentPageEntrada,
    setCurrentPageEntrada,
    totalPagesEntrada,
    currentPageSaida,
    setCurrentPageSaida,
    totalPagesSaida,
  } = useCategoriasPage();

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
              entradaCount={categoriasEntrada.length}
              saidaCount={categoriasSaida.length}
            />
            <div>
              <CategoryTable
                tipo="entrada"
                title="Categorias de Entrada"
                categories={paginatedCategoriasEntrada}
                onDelete={deleteCategoria.mutate}
                isPending={deleteCategoria.isPending}
              />
              {totalPagesEntrada > 1 && (
                <div className="mt-4">
                  <PaginationButton
                    currentPage={currentPageEntrada}
                    totalPages={totalPagesEntrada}
                    onPageChange={setCurrentPageEntrada}
                  />
                </div>
              )}
            </div>
            <div>
              <CategoryTable
                tipo="saida"
                title="Categorias de Saída"
                categories={paginatedCategoriasSaida}
                onDelete={deleteCategoria.mutate}
                isPending={deleteCategoria.isPending}
              />
              {totalPagesSaida > 1 && (
                <div className="mt-4">
                  <PaginationButton
                    currentPage={currentPageSaida}
                    totalPages={totalPagesSaida}
                    onPageChange={setCurrentPageSaida}
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
