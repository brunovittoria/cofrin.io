import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SaidaModal } from "@/components/dialogs/expenses-modal";
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
      breadcrumb="Saídas"
      title="Saídas"
      description="Controle total dos gastos e despesas da sua operação"
      showRefreshButton
      onRefresh={onRefresh}
      showMonthPicker
      dateRange={dateRange}
      onDateRangeChange={onDateRangeChange}
      showFilterButton
      filterButtonClassName="h-12 rounded-2xl border-[#CBD5F5] bg-white px-6 text-sm font-semibold text-[#0F172A] shadow-[0px_20px_32px_-24px_rgba(15,23,42,0.16)] transition-transform hover:-translate-y-0.5 hover:bg-[#FEE2E2]"
    >
      <SaidaModal
        trigger={
          <Button className="h-12 rounded-2xl bg-[#DC2626] px-6 text-sm font-semibold text-white shadow-[0px_20px_32px_-18px_rgba(220,38,38,0.45)] transition-transform hover:-translate-y-0.5 hover:bg-[#B91C1C]">
            <Plus className="h-4 w-4" /> Nova Saída
          </Button>
        }
      />
    </BasePageHeader>
  );
};
