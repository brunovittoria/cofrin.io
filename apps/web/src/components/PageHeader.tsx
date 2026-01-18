import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { RefreshButton } from "@/components/RefreshButton";
import { MonthPicker } from "@/components/MonthPicker";
import { DateRange } from "react-day-picker";

interface PageHeaderProps {
  // Content props
  breadcrumb: string;
  title: string;
  description: string;

  // Optional features
  showRefreshButton?: boolean;
  onRefresh?: () => void;

  showMonthPicker?: boolean;
  dateRange?: DateRange | undefined;
  onDateRangeChange?: (range: DateRange | undefined) => void;

  showFilterButton?: boolean;
  filterButtonClassName?: string;

  // Custom badge/info (for cards page total)
  badge?: ReactNode;

  // Primary action button (rendered via children or custom trigger)
  children?: ReactNode;
}

export const PageHeader = ({
  breadcrumb,
  title,
  description,
  showRefreshButton = false,
  onRefresh,
  showMonthPicker = false,
  dateRange,
  onDateRangeChange,
  showFilterButton = false,
  filterButtonClassName,
  badge,
  children,
}: PageHeaderProps) => {
  return (
    <header className="flex flex-col gap-6 border-b border-[#E5E7EB] pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#94A3B8]">
          {breadcrumb}
        </p>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-[#0F172A]">{title}</h1>
          <p className="text-sm text-[#4B5563]">{description}</p>
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        {badge && badge}

        {showRefreshButton && onRefresh && (
          <RefreshButton onRefresh={onRefresh} />
        )}

        {showMonthPicker && (
          <MonthPicker dateRange={dateRange} onSelect={onDateRangeChange} />
        )}

        {children}

        {showFilterButton && (
          <Button
            variant="outline"
            className={
              filterButtonClassName ||
              "h-12 rounded-2xl border-[#CBD5F5] bg-white px-6 text-sm font-semibold text-[#0F172A] shadow-[0px_20px_32px_-24px_rgba(15,23,42,0.16)] transition-transform hover:-translate-y-0.5 hover:bg-[#EEF2FF]"
            }
          >
            <Filter className="h-4 w-4" /> Filtros
          </Button>
        )}
      </div>
    </header>
  );
};

