import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Control } from "react-hook-form";
import type { CategoryFormData } from "@/lib/validations";

const fieldWrapper =
  "group rounded-2xl border border-[#E4E8F4] bg-[rgba(249,250,255,0.9)] p-4 transition-all duration-200 hover:border-[#C6D4FF] hover:bg-white focus-within:border-[#0A84FF] focus-within:bg-white shadow-[0_24px_48px_-30px_rgba(10,132,255,0.22)]";
const labelClass = "text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]";
const controlClass =
  "mt-3 h-11 rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] placeholder:text-[#9CA3AF] focus-visible:ring-[#0A84FF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

interface CategoryNameFieldProps {
  control: Control<CategoryFormData>;
}

export const CategoryNameField = ({ control }: CategoryNameFieldProps) => {
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem className={fieldWrapper}>
          <FormLabel className={labelClass}>Nome da Categoria</FormLabel>
          <FormControl>
            <Input
              placeholder="Ex: Alimentação"
              className={controlClass}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

