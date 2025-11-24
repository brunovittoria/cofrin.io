import { Edit, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LancamentoFuturoModal } from "@/components/dialogs/launch-modal";
import { DeleteLaunchDialog } from "./DeleteLaunchDialog";
import { formatCurrency, formatLocalDate } from "@/lib/formatters";

interface PendingLaunchRowProps {
  lancamento: {
    id: number;
    data: string;
    descricao?: string;
    valor: number;
    tipo: "entrada" | "saida";
    categorias?: {
      nome?: string;
    } | null;
  };
  onEfetivar: (id: number) => void;
  onDelete: (id: number) => void;
  isPendingEfetivar: boolean;
  isPendingDelete: boolean;
}

export const PendingLaunchRow = ({
  lancamento,
  onEfetivar,
  onDelete,
  isPendingEfetivar,
  isPendingDelete,
}: PendingLaunchRowProps) => {
  return (
    <TableRow className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]">
      <TableCell className="whitespace-nowrap text-sm font-semibold text-[#0F172A]">
        {formatLocalDate(lancamento.data)}
      </TableCell>
      <TableCell className="max-w-[280px] text-sm text-[#4B5563]">
        {lancamento.descricao}
      </TableCell>
      <TableCell className="text-sm text-[#4B5563]">
        {lancamento.categorias?.nome || "Sem categoria"}
      </TableCell>
      <TableCell>
        <Badge className="bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7] border-0">
          Pendente
        </Badge>
      </TableCell>
      <TableCell>
        <span
          className={
            lancamento.tipo === "entrada"
              ? "text-[#16A34A] font-medium"
              : "text-[#DC2626] font-medium"
          }
        >
          {lancamento.tipo === "entrada" ? "Entrada" : "Saída"}
        </span>
      </TableCell>
      <TableCell
        className={`text-right font-semibold ${
          lancamento.tipo === "entrada" ? "text-[#16A34A]" : "text-[#DC2626]"
        }`}
      >
        {lancamento.tipo === "entrada" ? "+ " : "- "}
        {formatCurrency(lancamento.valor)}
      </TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-2">
          <LancamentoFuturoModal
            mode="edit"
            lancamento={lancamento}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[#0A84FF] hover:text-[#006FDB] hover:bg-[#EEF2FF]"
                aria-label="Editar lançamento"
              >
                <Edit className="h-4 w-4" />
              </Button>
            }
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#16A34A] hover:text-[#15803D] hover:bg-[#ECFDF3]"
            aria-label="Efetivar lançamento"
            onClick={() => onEfetivar(lancamento.id)}
            disabled={isPendingEfetivar}
          >
            <Check className="h-4 w-4" />
          </Button>
          <DeleteLaunchDialog
            lancamentoId={lancamento.id}
            onDelete={onDelete}
            isPending={isPendingDelete}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

