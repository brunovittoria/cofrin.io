import { Edit, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FutureLaunchModal } from "@/components/dialogs/launch-modal";
import { DeleteLaunchDialog } from "./DeleteLaunchDialog";
import { formatCurrency, formatLocalDate } from "@/lib/formatters";

interface PendingLaunchRowProps {
  launch: {
    id: number;
    date: string;
    description?: string;
    amount: number;
    type: "entrada" | "saida";
    categories?: {
      name?: string;
    } | null;
  };
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
  isPendingComplete: boolean;
  isPendingDelete: boolean;
}

export const PendingLaunchRow = ({
  launch,
  onComplete,
  onDelete,
  isPendingComplete,
  isPendingDelete,
}: PendingLaunchRowProps) => {
  return (
    <TableRow className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]">
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
        <Badge className="bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7] border-0">
          Pendente
        </Badge>
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
          launch.type === "entrada" ? "text-[#16A34A]" : "text-[#DC2626]"
        }`}
      >
        {launch.type === "entrada" ? "+ " : "- "}
        {formatCurrency(launch.amount)}
      </TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-2">
          <FutureLaunchModal
            mode="edit"
            launch={launch}
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
            onClick={() => onComplete(launch.id)}
            disabled={isPendingComplete}
          >
            <Check className="h-4 w-4" />
          </Button>
          <DeleteLaunchDialog
            launchId={launch.id}
            onDelete={onDelete}
            isPending={isPendingDelete}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};
