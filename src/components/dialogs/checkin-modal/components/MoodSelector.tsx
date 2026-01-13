import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { moodOptions } from "@/lib/goalUtils";
import { cn } from "@/lib/utils";
import type { Control, UseFormSetValue } from "react-hook-form";
import type { CheckInFormData } from "@/lib/validations";

interface MoodSelectorProps {
  control: Control<CheckInFormData>;
  setValue: UseFormSetValue<CheckInFormData>;
}

export const MoodSelector = ({ control, setValue }: MoodSelectorProps) => {
  return (
    <FormField
      control={control}
      name="humor"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-medium text-foreground">
            Como foi sua semana em relação a esta meta?
          </FormLabel>
          <FormControl>
            <div className="grid grid-cols-3 gap-2">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setValue("humor", option.value as CheckInFormData["humor"], { shouldValidate: true })}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg border-2 p-3 transition-all hover:bg-accent",
                    field.value === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  )}
                  aria-pressed={field.value === option.value}
                  aria-label={option.label}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="text-xs text-muted-foreground">{option.label}</span>
                </button>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
