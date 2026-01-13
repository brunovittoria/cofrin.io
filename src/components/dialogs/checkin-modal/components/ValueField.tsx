import { DollarSign } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control } from "react-hook-form";
import type { CheckInFormData } from "@/lib/validations";

interface ValueFieldProps {
  control: Control<CheckInFormData>;
}

export const ValueField = ({ control }: ValueFieldProps) => {
  return (
    <FormField
      control={control}
      name="valor_adicionado"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-foreground">
            Valor adicionado neste período
          </FormLabel>
          <FormControl>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                className="pl-10"
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
