import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control } from "react-hook-form";
import type { CheckInFormData } from "@/lib/validations";

interface NoteFieldProps {
  control: Control<CheckInFormData>;
}

export const NoteField = ({ control }: NoteFieldProps) => {
  return (
    <FormField
      control={control}
      name="nota"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-foreground">
            Nota <span className="text-muted-foreground">(opcional)</span>
          </FormLabel>
          <FormControl>
            <Input
              placeholder="Ex: Recebi um bônus no trabalho"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
