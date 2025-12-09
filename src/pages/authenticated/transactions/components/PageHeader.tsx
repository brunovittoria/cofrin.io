import { DateRange } from "react-day-picker";
import { RefreshButton } from "@/components/RefreshButton";
import { MonthPicker } from "@/components/MonthPicker";
import { EntradaModal } from "@/components/dialogs/entry-modal";
import { SaidaModal } from "@/components/dialogs/expenses-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, TrendingUp, TrendingDown, ChevronDown } from "lucide-react";

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
    <header className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
          Transações
        </h1>
        <p className="text-sm text-[#6B7280]">
          Gerencie todas as suas receitas e despesas em um só lugar
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <RefreshButton onRefresh={onRefresh} />
        <MonthPicker dateRange={dateRange} onSelect={onDateRangeChange} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="group relative flex h-10 items-center justify-center gap-2 rounded-2xl border border-[#CBD5F5] bg-[#E8F2FF] px-5 py-2.5 text-sm font-semibold text-[#0A84FF] shadow-[0_18px_32px_-24px_rgba(15,23,42,0.18)] transition-all hover:-translate-y-0.5 hover:border-[#C6D4FF] hover:bg-[#EEF2FF] focus:bg-[#EEF2FF] focus:text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/45 focus:ring-offset-2 focus:ring-offset-white"
              aria-label="Adicionar nova transação"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Transação</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <EntradaModal
              mode="create"
              trigger={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="flex cursor-pointer items-center gap-2 text-[#16A34A]"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Nova Entrada</span>
                </DropdownMenuItem>
              }
            />
            <SaidaModal
              mode="create"
              trigger={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="flex cursor-pointer items-center gap-2 text-[#DC2626]"
                >
                  <TrendingDown className="h-4 w-4" />
                  <span>Nova Saída</span>
                </DropdownMenuItem>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

