import { PiggyBank, TrendingDown, CreditCard, Target } from "lucide-react";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { GoalType } from "@/hooks/api/useGoals";
import { cn } from "@/lib/utils";
import type { Control, UseFormSetValue } from "react-hook-form";
import type { GoalFormData } from "@/lib/validations";

interface GoalTypeSelectorProps {
  control: Control<GoalFormData>;
  setValue: UseFormSetValue<GoalFormData>;
}

const goalTypes = [
  {
    id: "economizar" as GoalType,
    title: "Guardar Dinheiro",
    description: "Criar uma reserva, viajar ou comprar algo à vista.",
    icon: PiggyBank,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    ring: "ring-blue-500",
    selectedBg: "bg-blue-50 dark:bg-blue-900/30",
  },
  {
    id: "reduzir" as GoalType,
    title: "Reduzir Gastos",
    description: "Diminuir despesas em categorias específicas.",
    icon: TrendingDown,
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-800",
    ring: "ring-orange-500",
    selectedBg: "bg-orange-50 dark:bg-orange-900/30",
  },
  {
    id: "quitar" as GoalType,
    title: "Quitar Dívida",
    description: "Eliminar pendências e limpar seu nome.",
    icon: CreditCard,
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    ring: "ring-red-500",
    selectedBg: "bg-red-50 dark:bg-red-900/30",
  },
  {
    id: "personalizada" as GoalType,
    title: "Personalizada",
    description: "Qualquer outro objetivo financeiro importante.",
    icon: Target,
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-200 dark:border-purple-800",
    ring: "ring-purple-500",
    selectedBg: "bg-purple-50 dark:bg-purple-900/30",
  },
];

export const GoalTypeSelector = ({ control, setValue }: GoalTypeSelectorProps) => {
  return (
    <FormField
      control={control}
      name="tipo"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {goalTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = field.value === type.id;

                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setValue("tipo", type.id, { shouldValidate: true })}
                    className={cn(
                      "relative cursor-pointer rounded-xl border-2 p-6 text-left transition-all duration-200 hover:shadow-md",
                      isSelected
                        ? `${type.border} ${type.selectedBg} ring-1 ${type.ring}`
                        : "border-border bg-card hover:border-muted-foreground/30"
                    )}
                    aria-pressed={isSelected}
                    aria-label={`Selecionar tipo de meta: ${type.title}`}
                  >
                    <div
                      className={cn(
                        "mb-4 w-fit rounded-lg p-3",
                        isSelected ? "bg-card" : type.bg
                      )}
                    >
                      <Icon className={cn("h-6 w-6", type.color)} />
                    </div>
                    <h3
                      className={cn(
                        "mb-2 text-lg font-semibold",
                        isSelected ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {type.title}
                    </h3>
                    <p
                      className={cn(
                        "text-sm",
                        isSelected ? "text-foreground/80" : "text-muted-foreground"
                      )}
                    >
                      {type.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
