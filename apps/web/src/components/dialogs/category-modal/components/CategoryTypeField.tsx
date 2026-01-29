import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Control } from "react-hook-form";
import type { CategoryFormData } from "@/lib/validations";

const fieldWrapper =
  "group rounded-2xl border border-[#E4E8F4] bg-[rgba(249,250,255,0.9)] p-4 transition-all duration-200 hover:border-[#C6D4FF] hover:bg-white focus-within:border-[#0A84FF] focus-within:bg-white shadow-[0_24px_48px_-30px_rgba(10,132,255,0.22)]";
const labelClass = "text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]";
const controlClass =
  "mt-3 h-11 rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] placeholder:text-[#9CA3AF] focus-visible:ring-[#0A84FF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white";
const selectContentClass =
  "border border-[#E2E8F0] bg-white text-[#0F172A] shadow-[0_28px_48px_-28px_rgba(10,132,255,0.24)] rounded-2xl";
const selectItemClass = "text-sm text-[#0F172A] focus:bg-[#EEF2FF] focus:text-[#0F172A]";

interface CategoryTypeFieldProps {
  control: Control<CategoryFormData>;
}

export const CategoryTypeField = ({ control }: CategoryTypeFieldProps) => {
  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem className={fieldWrapper}>
          <FormLabel className={labelClass}>Tipo</FormLabel>
          <Select onValueChange={field.onChange} value={field.value} required>
            <FormControl>
              <SelectTrigger className={controlClass}>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className={selectContentClass}>
              <SelectItem value="entrada" className={selectItemClass}>
                Entrada
              </SelectItem>
              <SelectItem value="saida" className={selectItemClass}>
                Saída
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

