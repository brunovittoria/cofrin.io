import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IncomeModal } from "@/components/dialogs/entry-modal";
import { DeleteEntryDialog } from "./DeleteEntryDialog";
import { buildCategoryBadgeTokens, DEFAULT_CATEGORY_COLOR } from "@/lib/entryUtils";
import { formatCurrency, formatLocalDate } from "@/lib/formatters";

interface EntryRowProps {
  entry: {
    id: number;
    date: string;
    description?: string;
    amount: number;
    categories?: {
      name?: string;
      hex_color?: string | null;
    } | null;
  };
  onDelete: (id: number) => void;
  isPending: boolean;
}

export const EntryRow = ({ entry, onDelete, isPending }: EntryRowProps) => {
  const { accent: accentColor, style: badgeStyle } = buildCategoryBadgeTokens(
    entry.categories?.hex_color,
    DEFAULT_CATEGORY_COLOR
  );
  const categoryName = entry.categories?.name || "Sem categoria";

  return (
    <TableRow className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]">
      <TableCell className="whitespace-nowrap text-sm font-semibold text-[#0F172A]">
        {formatLocalDate(entry.date)}
      </TableCell>
      <TableCell className="max-w-[280px] text-sm text-[#4B5563]">
        {entry.description}
      </TableCell>
      <TableCell className="w-[220px]">
        <Badge
          variant="outline"
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0F172A]"
          style={badgeStyle}
        >
          <span className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: accentColor,
                boxShadow: "0 0 0 4px " + accentColor + "22",
              }}
            />
            <span className="whitespace-nowrap">{categoryName}</span>
          </span>
        </Badge>
      </TableCell>
      <TableCell className="whitespace-nowrap text-right text-sm font-semibold text-[#16A34A]">
        {formatCurrency(entry.amount)}
      </TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-2">
          <IncomeModal
            mode="edit"
            income={entry}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                aria-label={`Editar ${entry.description || "entrada"}`}
                className="h-9 w-9 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-0 text-[#2563EB] transition-colors hover:bg-[#DBEAFE]"
              >
                <Edit className="h-4 w-4" />
              </Button>
            }
          />
          <DeleteEntryDialog
            entryId={entry.id}
            entryDescription={entry.description}
            onDelete={onDelete}
            isPending={isPending}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};
