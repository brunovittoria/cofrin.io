import { Search, LayoutList, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { TransactionType } from "@/hooks/transactions/useTransactionsPage";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeFilter: TransactionType;
  onFilterChange: (filter: TransactionType) => void;
}

export const FilterBar = ({
  searchTerm,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: FilterBarProps) => {
  const filters: { value: TransactionType; label: string; icon: React.ReactNode }[] = [
    {
      value: "all",
      label: "Todas",
      icon: <LayoutList className="h-4 w-4" />,
    },
    {
      value: "income",
      label: "Entradas",
      icon: <ArrowUpCircle className="h-4 w-4" />,
    },
    {
      value: "expense",
      label: "Saídas",
      icon: <ArrowDownCircle className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Filter Tabs */}
      <div className="flex rounded-xl bg-[#F1F5F9] p-1">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeFilter === filter.value
                ? cn(
                    "bg-white shadow-sm",
                    filter.value === "income" && "text-[#16A34A]",
                    filter.value === "expense" && "text-[#DC2626]",
                    filter.value === "all" && "text-[#0F172A]"
                  )
                : "text-[#6B7280] hover:text-[#0F172A]"
            )}
            aria-label={`Filtrar por ${filter.label.toLowerCase()}`}
            tabIndex={0}
          >
            {filter.icon}
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
        <Input
          type="text"
          placeholder="Buscar por descrição ou categoria..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 rounded-xl border-[#E5E7EB] bg-white pl-10 text-sm placeholder:text-[#9CA3AF] focus-within:border-[#0A84FF] focus-within:bg-white"
          aria-label="Buscar transações"
        />
      </div>
    </div>
  );
};

