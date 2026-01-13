import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { Control } from "react-hook-form";
import type { CheckInFormData } from "@/lib/validations";

interface ObstaclesFieldProps {
  control: Control<CheckInFormData>;
}

export const ObstaclesField = ({ control }: ObstaclesFieldProps) => {
  return (
    <FormField
      control={control}
      name="obstaculos"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-foreground">
            Algum obstáculo que você enfrentou?
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder="Ex: Tive um gasto imprevisto com..."
              className="min-h-[80px] resize-none"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
