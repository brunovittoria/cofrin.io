import { Lightbulb, Heart, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { reflectionPrompts } from "@/lib/goalUtils";
import type { Control } from "react-hook-form";
import type { GoalFormData } from "@/lib/validations";

interface ReflectionStepProps {
  control: Control<GoalFormData>;
}

export const ReflectionStep = ({ control }: ReflectionStepProps) => {
  return (
    <div className="space-y-6">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-foreground">Reflexão Consciente</h2>
        <p className="mx-auto max-w-lg text-muted-foreground">
          O método Kakeibo nos ensina que a consciência vem antes da ação. Tire um momento
          para refletir sobre o propósito desta meta.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          {/* Por que essa meta é importante */}
          <FormField
            control={control}
            name="porque"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-base font-medium text-foreground">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  {reflectionPrompts.porque.label}
                </FormLabel>
                <FormDescription>{reflectionPrompts.porque.hint}</FormDescription>
                <FormControl>
                  <Textarea
                    placeholder={reflectionPrompts.porque.placeholder}
                    className="min-h-[100px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* O que você está disposto a ajustar */}
          <FormField
            control={control}
            name="mudanca"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-base font-medium text-foreground">
                  <Target className="h-5 w-5 text-blue-500" />
                  {reflectionPrompts.mudanca.label}
                </FormLabel>
                <FormDescription>{reflectionPrompts.mudanca.hint}</FormDescription>
                <FormControl>
                  <Textarea
                    placeholder={reflectionPrompts.mudanca.placeholder}
                    className="min-h-[100px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Como você se sentirá */}
          <FormField
            control={control}
            name="sentimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-base font-medium text-foreground">
                  <Heart className="h-5 w-5 text-red-500" />
                  {reflectionPrompts.sentimento.label}
                </FormLabel>
                <FormDescription>{reflectionPrompts.sentimento.hint}</FormDescription>
                <FormControl>
                  <Textarea
                    placeholder={reflectionPrompts.sentimento.placeholder}
                    className="min-h-[100px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};
