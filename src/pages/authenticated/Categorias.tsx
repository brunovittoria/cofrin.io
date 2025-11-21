import { type CSSProperties } from "react";
import { Plus, TrendingUp, TrendingDown, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryModal } from "@/components/dialogs/category-modal";
import {
  useCategories,
  useDeleteCategoria,
  type Categoria,
} from "@/hooks/useCategories";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const formatCountLabel = (count: number) =>
  `${count} categoria${count === 1 ? "" : "s"}`;

const normalizeHex = (hex?: string): string => {
  if (!hex) return "#0A84FF";
  const match = hex.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  return match ? hex : "#0A84FF";
};

const colorStyle = (hex?: string): CSSProperties => {
  const color = normalizeHex(hex);
  return {
    backgroundColor: color,
    boxShadow: "0 4px 12px " + color + "30",
  };
};

export default function Categorias() {
  const { data: categoriasEntrada = [] } = useCategories("entrada");
  const { data: categoriasSaida = [] } = useCategories("saida");
  const deleteCategoria = useDeleteCategoria();

  const header = (
    <header className="flex flex-col gap-6 border-b border-[#E5E7EB] pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#94A3B8]">
          Categorias
        </p>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-[#0F172A]">
            Categorias financeiras
          </h1>
          <p className="text-sm text-[#4B5563]">
            Organize entradas e saídas em grupos inteligentes para facilitar
            análises.
          </p>
        </div>
      </div>
      <CategoryModal
        trigger={
          <Button className="h-12 rounded-2xl bg-[#0A84FF] px-6 text-sm font-semibold text-white shadow-[0px_20px_32px_-18px_rgba(10,132,255,0.6)] transition-transform hover:-translate-y-0.5 hover:bg-[#006FDB]">
            <Plus className="h-4 w-4" /> Nova Categoria
          </Button>
        }
      />
    </header>
  );

  const summaryCards = (
    <div className="grid gap-6 md:grid-cols-2">
      <article className="surface-card p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#6B7280]">
              Categorias de Entrada
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#0F172A]">
              {categoriasEntrada.length}
            </p>
            <p className="text-xs text-[#94A3B8]">
              {formatCountLabel(categoriasEntrada.length)}
            </p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECFDF3] text-[#16A34A]">
            <TrendingUp className="h-6 w-6" />
          </span>
        </div>
      </article>
      <article className="surface-card p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#6B7280]">
              Categorias de Saída
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#0F172A]">
              {categoriasSaida.length}
            </p>
            <p className="text-xs text-[#94A3B8]">
              {formatCountLabel(categoriasSaida.length)}
            </p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FEF2F2] text-[#DC2626]">
            <TrendingDown className="h-6 w-6" />
          </span>
        </div>
      </article>
    </div>
  );

  const renderTable = (
    tipo: "entrada" | "saida",
    title: string,
    categories: Categoria[]
  ) => (
    <section className="surface-card p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#0F172A]">{title}</h2>
          <p className="text-sm text-[#6B7280]">
            {categories.length
              ? "Edite ou remova categorias existentes"
              : "Nenhuma categoria cadastrada ainda"}
          </p>
        </div>
        <CategoryModal
          defaultTipo={tipo}
          trigger={
            <Button
              variant="outline"
              className="h-11 rounded-2xl border-[#CBD5F5] bg-white px-5 text-sm font-semibold text-[#0F172A] shadow-[0px_18px_32px_-24px_rgba(15,23,42,0.18)] transition-transform hover:-translate-y-0.5 hover:bg-[#EEF2FF]"
            >
              <Plus className="h-4 w-4" /> Nova Categoria
            </Button>
          }
        />
      </div>
      <div className="mt-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#E5E7EB]">
              <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                Nome
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                Descrição
              </TableHead>
              <TableHead className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-10 text-center text-sm text-[#6B7280]"
                >
                  Ainda não há categorias cadastradas para este tipo.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((categoria) => (
                <TableRow
                  key={categoria.id}
                  className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]"
                >
                  <TableCell className="text-sm font-semibold text-[#0F172A]">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={colorStyle(categoria.cor_hex || undefined)}
                      />
                      {categoria.nome}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-[#4B5563]">
                    {categoria.descricao || "Sem descrição"}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <CategoryModal
                        mode="edit"
                        categoria={categoria}
                        trigger={
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-0 text-[#2563EB] transition-colors hover:bg-[#DBEAFE]"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-0 text-[#DC2626] transition-colors hover:bg-[#FEE2E2]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Confirmar exclusão
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza de que deseja excluir esta categoria?
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-[#DC2626] text-white hover:bg-[#B91C1C]"
                              onClick={() =>
                                deleteCategoria.mutate(Number(categoria.id))
                              }
                            >
                              {deleteCategoria.isPending
                                ? "Excluindo..."
                                : "Excluir"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
        <section className="muted-card p-6 sm:p-8">
          {header}
          <div className="mt-8 space-y-6">
            {summaryCards}
            {renderTable("entrada", "Categorias de Entrada", categoriasEntrada)}
            {renderTable("saida", "Categorias de Saída", categoriasSaida)}
          </div>
        </section>
      </div>
    </div>
  );
}
