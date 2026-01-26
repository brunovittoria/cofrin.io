import { useEffect, useState } from "react";
import { Calendar, DollarSign, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GoalType } from "@/hooks/api/useGoals";
import { Category } from "@/hooks/api/useCategories";
import { Card as CardType } from "@/hooks/api/useCards";
import { formatCurrency, calculateMonthlySuggestion } from "@/lib/goalUtils";
import type { Control } from "react-hook-form";
import type { GoalFormData } from "@/lib/validations";

interface GoalFormProps {
  control: Control<GoalFormData>;
  type: GoalType;
  expenseCategories: Category[];
  cards: CardType[];
  valorAlvo?: string;
  valorAtual?: string;
  prazo?: string;
}

export const GoalForm = ({
  control,
  type,
  expenseCategories,
  cards,
  valorAlvo,
  valorAtual,
  prazo,
}: GoalFormProps) => {
  const [suggestion, setSuggestion] = useState<string | null>(null);

  // Calculate suggestions based on type and values
  useEffect(() => {
    if (type === "economizar" && valorAlvo && prazo) {
      const targetAmount = parseFloat(valorAlvo.replace(",", "."));
      const currentAmount = parseFloat(valorAtual?.replace(",", ".") || "0");

      if (targetAmount > 0 && prazo) {
        const monthlySuggestion = calculateMonthlySuggestion(
          targetAmount,
          currentAmount,
          prazo
        );

        if (monthlySuggestion > 0) {
          setSuggestion(
            `Para atingir sua meta, você precisará guardar aproximadamente ${formatCurrency(
              monthlySuggestion
            )} por mês.`
          );
        } else {
          setSuggestion(null);
        }
      }
    } else if (type === "reduzir") {
      setSuggestion(
        "Dica: Analise seus gastos recentes nesta categoria e defina um limite realista. Uma redução de 10-20% é um bom começo."
      );
    } else if (type === "quitar") {
      setSuggestion(
        "Dica: Foque em pagar mais que o mínimo todo mês. Priorize as dívidas com juros mais altos."
      );
    } else {
      setSuggestion(null);
    }
  }, [type, valorAlvo, valorAtual, prazo]);

  const getPlaceholder = () => {
    switch (type) {
      case "economizar":
        return "Ex: Viagem para Europa";
      case "reduzir":
        return "Ex: Reduzir gastos com delivery";
      case "quitar":
        return "Ex: Quitar cartão Nubank";
      default:
        return "Ex: Minha meta financeira";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6 p-6">
          {/* Nome da Meta */}
          <FormField
            control={control}
            name="titulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Meta</FormLabel>
                <FormControl>
                  <Input placeholder={getPlaceholder()} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Descrição (opcional) */}
          <FormField
            control={control}
            name="descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Descrição <span className="text-muted-foreground">(opcional)</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva sua meta em mais detalhes..."
                    className="min-h-[80px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Categoria (for reduce type) */}
          {type === "reduzir" && (
            <FormField
              control={control}
              name="categoria_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria de Gastos</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {expenseCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Cartão (for debt type) */}
          {type === "quitar" && (
            <FormField
              control={control}
              name="cartao_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cartão</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cartão..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cards.map((card) => (
                        <SelectItem key={card.id} value={card.id.toString()}>
                          {card.display_name}
                          {card.card_last_four && ` •••• ${card.card_last_four}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Valor da Meta */}
          <FormField
            control={control}
            name="valor_alvo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {type === "reduzir" ? "Limite Mensal Desejado" : "Valor Total da Meta"}
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

          {/* Valor Atual (for save and custom types) */}
          {(type === "economizar" || type === "personalizada") && (
            <FormField
              control={control}
              name="valor_atual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Valor Já Guardado <span className="text-muted-foreground">(opcional)</span>
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
          )}

          {/* Prazo */}
          <FormField
            control={control}
            name="prazo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prazo para Concluir</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="date"
                      className="pl-10"
                      min={new Date().toISOString().split("T")[0]}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Suggestion */}
          {suggestion && (
            <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-blue-600" />
              <p className="text-sm text-blue-800 dark:text-blue-200">{suggestion}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
