import { useCategoriasPage } from "@/hooks/useCategoriasPage";
import { PageHeader } from "./components/PageHeader";
import { SummaryCards } from "./components/SummaryCards";
import { CategoryTable } from "./components/CategoryTable";
import { PageSkeleton } from "@/components/PageSkeleton";

export default function Categorias() {
  const { 
    categoriasEntrada, 
    categoriasSaida, 
    deleteCategoria,
    isLoading,
    handleRefresh 
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
            <CategoryTable
              tipo="entrada"
              title="Categorias de Entrada"
              categories={categoriasEntrada}
              onDelete={deleteCategoria.mutate}
              isPending={deleteCategoria.isPending}
            />
            <CategoryTable
              tipo="saida"
              title="Categorias de Saída"
              categories={categoriasSaida}
              onDelete={deleteCategoria.mutate}
              isPending={deleteCategoria.isPending}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
