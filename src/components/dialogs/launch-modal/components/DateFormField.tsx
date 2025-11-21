import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Control } from "react-hook-form";
import type { LancamentoFuturoFormData } from "@/lib/validations";

const fieldWrapper =
  "group rounded-2xl border border-[#E4E8F4] bg-[rgba(249,250,255,0.9)] p-4 transition-all duration-200 hover:border-[#C6D4FF] hover:bg-white focus-within:border-[#0A84FF] focus-within:bg-white shadow-[0_24px_48px_-30px_rgba(10,132,255,0.25)]";
const labelClass = "text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]";
const controlClass =
  "mt-3 h-11 rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] placeholder:text-[#9CA3AF] focus-visible:ring-[#0A84FF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white";
const popoverClass =
  "w-auto rounded-2xl border border-[#E2E8F0] bg-white p-3 text-[#0F172A] shadow-[0_32px_54px_-30px_rgba(10,132,255,0.28)]";

interface DateFormFieldProps {
  control: Control<LancamentoFuturoFormData>;
}

export const DateFormField = ({ control }: DateFormFieldProps) => {
  return (
    <FormField
      control={control}
      name="data"
      render={({ field }) => (
        <FormItem className={fieldWrapper}>
          <FormLabel className={labelClass}>Data Prevista</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="ghost"
                  className={cn(
                    controlClass,
                    "flex items-center justify-between bg-white text-left font-medium w-full",
                    !field.value && "text-[#9CA3AF]"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-[#0A84FF]" />
                    {field.value
                      ? format(field.value, "dd/MM/yyyy")
                      : "Selecione a data prevista"}
                  </span>
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className={popoverClass} align="start" sideOffset={10}>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
                className="pointer-events-auto rounded-2xl border border-[#E5E7EB] bg-white text-[#0F172A]"
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

