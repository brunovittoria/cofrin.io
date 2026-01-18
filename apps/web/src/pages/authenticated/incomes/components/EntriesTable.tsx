import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EntryRow } from "./EntryRow";

interface EntriesTableProps {
  entries: Array<{
    id: number;
    data: string;
    descricao?: string;
    valor: number;
    categorias?: {
      nome?: string;
      cor_hex?: string | null;
    } | null;
  }>;
  searchTerm: string;
  onDelete: (id: number) => void;
  isPending: boolean;
}

export const EntriesTable = ({
  entries,
  searchTerm,
  onDelete,
  isPending,
}: EntriesTableProps) => {
  return (
    <section className="surface-card p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-[#0F172A]">
            Registros de Entradas
          </h2>
          <p className="text-sm text-[#6B7280]">
            Acompanhe suas entradas e ações recentes
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#E5E7EB]">
                <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                  Data
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                  Descrição
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                  Categoria
                </TableHead>
                <TableHead className="text-right text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                  Valor
                </TableHead>
                <TableHead className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-sm text-[#6B7280]"
                  >
                    {searchTerm
                      ? "Nenhuma entrada corresponde à busca."
                      : "Nenhuma entrada cadastrada ainda."}
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => (
                  <EntryRow
                    key={entry.id}
                    entry={entry}
                    onDelete={onDelete}
                    isPending={isPending}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};
