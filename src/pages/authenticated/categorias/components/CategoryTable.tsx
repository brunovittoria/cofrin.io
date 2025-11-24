import { Plus } from "lucide-react";
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
import { CategoryRow } from "./CategoryRow";
import { type Categoria } from "@/hooks/api/useCategories";

interface CategoryTableProps {
  tipo: "entrada" | "saida";
  title: string;
  categories: Categoria[];
  onDelete: (id: number) => void;
  isPending: boolean;
}

export const CategoryTable = ({
  tipo,
  title,
  categories,
  onDelete,
  isPending,
}: CategoryTableProps) => {
  return (
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
                <CategoryRow
                  key={categoria.id}
                  categoria={categoria}
                  onDelete={onDelete}
                  isPending={isPending}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

