import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PendingLaunchRow } from "./PendingLaunchRow";

interface PendingLaunchesTableProps {
  launches: Array<{
    id: number;
    data: string;
    descricao?: string;
    valor: number;
    tipo: "entrada" | "saida";
    categorias?: {
      nome?: string;
    } | null;
  }>;
  searchTerm: string;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
  isPendingComplete: boolean;
  isPendingDelete: boolean;
}

export const PendingLaunchesTable = ({
  launches,
  searchTerm,
  onComplete,
  onDelete,
  isPendingComplete,
  isPendingDelete,
}: PendingLaunchesTableProps) => {
  return (
    <div className="mt-6">
      <h3 className="text-md font-semibold text-[#0F172A] mb-3">
        Lançamentos Pendentes
      </h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#E5E7EB]">
              <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                Data Prevista
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                Descrição
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                Categoria
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                Tipo
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
            {launches.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-sm text-[#6B7280]"
                >
                  {searchTerm
                    ? "Nenhum lançamento corresponde à busca."
                    : "Nenhum lançamento pendente cadastrado ainda."}
                </TableCell>
              </TableRow>
            ) : (
              launches.map((launch) => (
                <PendingLaunchRow
                  key={launch.id}
                  launch={launch}
                  onComplete={onComplete}
                  onDelete={onDelete}
                  isPendingComplete={isPendingComplete}
                  isPendingDelete={isPendingDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
