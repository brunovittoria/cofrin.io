import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Control } from "react-hook-form";
import type { CardFormData } from "@/lib/validations";

const labelClass = "text-xs font-medium text-[#475569]";
const inputClass =
  "h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] placeholder:text-[#9CA3AF] focus-visible:ring-[#0A84FF]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

interface CardBasicFieldsProps {
  control: Control<CardFormData>;
}

export const CardBasicFields = ({ control }: CardBasicFieldsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField
        control={control}
        name="display_name"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-1.5">
            <FormLabel className={labelClass}>Nome de exibicao</FormLabel>
            <FormControl>
              <Input
                placeholder="Visa Platinum"
                className={inputClass}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="nickname"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-1.5">
            <FormLabel className={labelClass}>Apelido (opcional)</FormLabel>
            <FormControl>
              <Input
                placeholder="Cartao principal"
                className={inputClass}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

