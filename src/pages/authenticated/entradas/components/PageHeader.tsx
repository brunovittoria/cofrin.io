import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EntradaModal } from "@/components/dialogs/entry-modal";
import { PageHeader as BasePageHeader } from "@/components/PageHeader";
import { DateRange } from "react-day-picker";

interface PageHeaderProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onRefresh: () => void;
}

export const PageHeader = ({
  dateRange,
  onDateRangeChange,
  onRefresh,
}: PageHeaderProps) => {
  return (
    <BasePageHeader
      breadcrumb="Entradas"
      title="Entradas"
      description="Gerencie todas as suas receitas e ganhos com uma visão clara"
      showRefreshButton
      onRefresh={onRefresh}
      showMonthPicker
      dateRange={dateRange}
      onDateRangeChange={onDateRangeChange}
      showFilterButton
    >
      <EntradaModal
        trigger={
          <Button className="h-12 rounded-2xl bg-[#16A34A] px-6 text-sm font-semibold text-white shadow-[0px_20px_32px_-18px_rgba(22,163,74,0.5)] transition-transform hover:-translate-y-0.5 hover:bg-[#15803D]">
            <Plus className="h-4 w-4" /> Nova Entrada
          </Button>
        }
      />
    </BasePageHeader>
  );
};
