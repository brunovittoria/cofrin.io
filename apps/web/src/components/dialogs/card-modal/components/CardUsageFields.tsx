import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardPreview } from "./CardPreview";
import { CardMetrics } from "./CardMetrics";
import type { Control } from "react-hook-form";
import type { CardFormData } from "@/lib/validations";

const labelClass = "text-xs font-medium text-[#475569]";
const inputClass =
  "h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] placeholder:text-[#9CA3AF] focus-visible:ring-[#0A84FF]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

interface CardUsageFieldsProps {
  control: Control<CardFormData>;
  providerImageUrl?: string;
  providerName?: string;
  availableValue: number;
  usagePercentage: number;
}

export const CardUsageFields = ({
  control,
  providerImageUrl,
  providerName,
  availableValue,
  usagePercentage,
}: CardUsageFieldsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
      <FormField
        control={control}
        name="used_amount"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-1.5">
            <FormLabel className={labelClass}>Valor utilizado</FormLabel>
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
      <CardPreview imageUrl={providerImageUrl} providerName={providerName} />
      <CardMetrics
        availableValue={availableValue}
        usagePercentage={usagePercentage}
      />
    </div>
  );
};
