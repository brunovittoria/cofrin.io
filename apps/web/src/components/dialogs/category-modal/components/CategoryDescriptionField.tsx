import { Textarea } from "@/components/ui/textarea";
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
const textareaClass =
  "mt-3 min-h-[120px] rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#9CA3AF] focus-visible:ring-[#0A84FF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

interface CategoryDescriptionFieldProps {
  control: Control<CategoryFormData>;
}

export const CategoryDescriptionField = ({ control }: CategoryDescriptionFieldProps) => {
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem className={fieldWrapper}>
          <FormLabel className={labelClass}>Descrição</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Descrição opcional da categoria"
              rows={3}
              className={textareaClass}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

