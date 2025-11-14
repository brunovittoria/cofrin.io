import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type MonthPickerProps = {
  dateRange?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
  className?: string;
};

export const MonthPicker = ({ dateRange, onSelect, className }: MonthPickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (range: DateRange | undefined) => {
    onSelect?.(range);
    // Only close popover when both dates are selected
    if (range?.from && range?.to) {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    onSelect?.(undefined);
    setIsOpen(false);
  };

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) {
      return "Selecione o período";
    }
    
    if (range.from && range.to) {
      return `${format(range.from, "dd/MM/yyyy", { locale: ptBR })} - ${format(range.to, "dd/MM/yyyy", { locale: ptBR })}`;
    }
    
    return format(range.from, "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!dateRange?.from}
          className={cn(
            "h-12 w-[320px] justify-start rounded-2xl border-[#CBD5F5] bg-white px-6 text-left font-normal text-[#0F172A] shadow-[0px_20px_32px_-24px_rgba(15,23,42,0.16)] transition-transform hover:-translate-y-0.5 hover:bg-[#EEF2FF] data-[empty=true]:text-[#94A3B8]",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange(dateRange)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={handleSelect}
            defaultMonth={dateRange?.from}
            numberOfMonths={2}
          />
          {dateRange?.from && (
            <div className="border-t border-[#E5E7EB] p-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="w-full rounded-xl border-[#CBD5F5] bg-white text-sm font-medium text-[#0F172A] hover:bg-[#EEF2FF]"
              >
                <X className="mr-2 h-4 w-4" />
                Limpar seleção
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

