import { Button } from "@/components/ui/button";
import { GoalStatus } from "@/hooks/api/useGoals";

interface FilterTabsProps {
  activeFilter: GoalStatus | "all";
  onFilterChange: (filter: GoalStatus | "all") => void;
}

const filters: { value: GoalStatus | "all"; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "ativa", label: "Em andamento" },
  { value: "concluida", label: "Concluídas" },
  { value: "pausada", label: "Pausadas" },
];

export const FilterTabs = ({ activeFilter, onFilterChange }: FilterTabsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={activeFilter === filter.value ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onFilterChange(filter.value)}
          className="text-sm"
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};
