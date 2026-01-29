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

interface CardNumberLimitFieldsProps {
  control: Control<CardFormData>;
}

export const CardNumberLimitFields = ({ control }: CardNumberLimitFieldsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField
        control={control}
        name="card_last_four"
        render={({ field }) => {
          const handleChange = (value: string) => {
            const onlyDigits = value.replace(/[^0-9]/g, "").slice(0, 4);
            field.onChange(onlyDigits);
          };

          return (
            <FormItem className="flex flex-col gap-1.5">
              <FormLabel className={labelClass}>Final do cartao</FormLabel>
              <FormControl>
                <Input
                  placeholder="6782"
                  maxLength={4}
                  value={field.value || ""}
                  onChange={(event) => handleChange(event.target.value)}
                  className={inputClass}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={control}
        name="total_limit"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-1.5">
            <FormLabel className={labelClass}>Limite total</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
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

