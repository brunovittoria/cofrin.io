import { Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EntradaModal } from "@/components/dialogs/entry-modal";
import { MonthPicker } from "@/components/MonthPicker";
import { DateRange } from "react-day-picker";

interface PageHeaderProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export const PageHeader = ({ dateRange, onDateRangeChange }: PageHeaderProps) => {
  return (
    <header className="flex flex-col gap-6 border-b border-[#E5E7EB] pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#94A3B8]">
          Entradas
        </p>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-[#0F172A]">Entradas</h1>
          <p className="text-sm text-[#4B5563]">
            Gerencie todas as suas receitas e ganhos com uma visão clara
          </p>
        </div>
      </div>
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <MonthPicker dateRange={dateRange} onSelect={onDateRangeChange} />
        <EntradaModal
          trigger={
            <Button className="h-12 rounded-2xl bg-[#16A34A] px-6 text-sm font-semibold text-white shadow-[0px_20px_32px_-18px_rgba(22,163,74,0.5)] transition-transform hover:-translate-y-0.5 hover:bg-[#15803D]">
              <Plus className="h-4 w-4" /> Nova Entrada
            </Button>
          }
        />
        <Button
          variant="outline"
          className="h-12 rounded-2xl border-[#CBD5F5] bg-white px-6 text-sm font-semibold text-[#0F172A] shadow-[0px_20px_32px_-24px_rgba(15,23,42,0.16)] transition-transform hover:-translate-y-0.5 hover:bg-[#EEF2FF]"
        >
          <Filter className="h-4 w-4" /> Filtros
        </Button>
      </div>
    </header>
  );
};

