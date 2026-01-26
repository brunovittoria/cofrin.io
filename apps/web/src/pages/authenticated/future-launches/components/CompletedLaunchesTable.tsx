import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatLocalDate } from "@/lib/formatters";

interface CompletedLaunchesTableProps {
  launches: Array<{
    id: number;
    date: string;
    description?: string;
    amount: number;
    type: "entrada" | "saida";
    categories?: {
      name?: string;
    } | null;
  }>;
}

export const CompletedLaunchesTable = ({
  launches,
}: CompletedLaunchesTableProps) => {
  if (launches.length === 0) {
    return (
      <div className="mt-6">
        <h3 className="text-md font-semibold text-[#0F172A] mb-3">
          Lançamentos Efetivados
        </h3>
        <div className="mt-4 bg-[#F9FAFB] p-4 rounded-2xl text-center">
          <p className="text-sm font-medium text-[#16A34A]">
            Nenhum Lançamento Efetivado Este Mês
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-md font-semibold text-[#0F172A] mb-3">
        Lançamentos Efetivados
      </h3>
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
              <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                Tipo
              </TableHead>
              <TableHead className="text-right text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                Valor
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {launches.map((launch) => (
              <TableRow
                key={launch.id}
                className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]"
              >
                <TableCell className="whitespace-nowrap text-sm font-semibold text-[#0F172A]">
                  {formatLocalDate(launch.date)}
                </TableCell>
                <TableCell className="max-w-[280px] text-sm text-[#4B5563]">
                  {launch.description}
                </TableCell>
                <TableCell className="text-sm text-[#4B5563]">
                  {launch.categories?.name || "Sem categoria"}
                </TableCell>
                <TableCell>
                  <span
                    className={
                      launch.type === "entrada"
                        ? "text-[#16A34A] font-medium"
                        : "text-[#DC2626] font-medium"
                    }
                  >
                    {launch.type === "entrada" ? "Entrada" : "Saída"}
                  </span>
                </TableCell>
                <TableCell
                  className={`text-right font-semibold ${
                    launch.type === "entrada"
                      ? "text-[#16A34A]"
                      : "text-[#DC2626]"
                  }`}
                >
                  {launch.type === "entrada" ? "+ " : "- "}
                  {formatCurrency(launch.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
