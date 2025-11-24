import { useCategoriasPage } from "@/hooks/useCategoriasPage";
import { PageHeader } from "./components/PageHeader";
import { SummaryCards } from "./components/SummaryCards";
import { CategoryTable } from "./components/CategoryTable";

export default function Categorias() {
  const { categoriasEntrada, categoriasSaida, deleteCategoria } =
    useCategoriasPage();

  return (
    <div className="min-h-screen bg-[#F5F7FA] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
        <section className="muted-card p-6 sm:p-8">
          <PageHeader />
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
