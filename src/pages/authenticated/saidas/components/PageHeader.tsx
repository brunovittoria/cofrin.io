import { Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MonthPicker } from "@/components/MonthPicker";
import { SaidaModal } from "@/components/dialogs/expenses-modal";
import { RefreshButton } from "@/components/RefreshButton";
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
    <header className="flex flex-col gap-6 border-b border-[#E5E7EB] pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#94A3B8]">
          Saídas
        </p>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-[#0F172A]">Saídas</h1>
          <p className="text-sm text-[#4B5563]">
            Controle total dos gastos e despesas da sua operação
          </p>
        </div>
      </div>
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <RefreshButton onRefresh={onRefresh} />
        <MonthPicker dateRange={dateRange} onSelect={onDateRangeChange} />
        <SaidaModal
          trigger={
            <Button className="h-12 rounded-2xl bg-[#DC2626] px-6 text-sm font-semibold text-white shadow-[0px_20px_32px_-18px_rgba(220,38,38,0.45)] transition-transform hover:-translate-y-0.5 hover:bg-[#B91C1C]">
              <Plus className="h-4 w-4" /> Nova Saída
            </Button>
          }
        />
        <Button
          variant="outline"
          className="h-12 rounded-2xl border-[#CBD5F5] bg-white px-6 text-sm font-semibold text-[#0F172A] shadow-[0px_20px_32px_-24px_rgba(15,23,42,0.16)] transition-transform hover:-translate-y-0.5 hover:bg-[#FEE2E2]"
        >
          <Filter className="h-4 w-4" /> Filtros
        </Button>
      </div>
    </header>
  );
};

