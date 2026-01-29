import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cardProviders } from "@/mocks/cardProviders";
import type { Control } from "react-hook-form";
import type { CardFormData } from "@/lib/validations";

const labelClass = "text-xs font-medium text-[#475569]";
const inputClass =
  "h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] placeholder:text-[#9CA3AF] focus-visible:ring-[#0A84FF]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const bandeiras = [
  "Visa",
  "Mastercard",
  "Elo",
  "American Express",
  "Hipercard",
] as const;

interface CardProviderFieldsProps {
  control: Control<CardFormData>;
}

export const CardProviderFields = ({ control }: CardProviderFieldsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField
        control={control}
        name="issuer"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-1.5">
            <FormLabel className={labelClass}>Banco / emissor</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className={inputClass}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] shadow-[0_14px_32px_-24px_rgba(10,132,255,0.24)]">
                {cardProviders.map((provider) => (
                  <SelectItem
                    key={provider.id}
                    value={provider.id}
                    className="text-sm text-[#0F172A] focus:bg-[#EEF2FF]"
                  >
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="flag"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-1.5">
            <FormLabel className={labelClass}>Bandeira</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className={inputClass}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] shadow-[0_14px_32px_-24px_rgba(10,132,255,0.24)]">
                {bandeiras.map((option) => (
                  <SelectItem
                    key={option}
                    value={option}
                    className="text-sm text-[#0F172A] focus:bg-[#EEF2FF]"
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
