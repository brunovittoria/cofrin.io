import { Clock, ArrowRight, PiggyBank, TrendingDown, CreditCard, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GoalProgress } from "./GoalProgress";
import {
  getGoalTypeLabel,
  getGoalStatusLabel,
  getGoalTypeColors,
  calculateDaysRemaining,
} from "@/lib/goalUtils";
import { Goal, GoalType } from "@/hooks/api/useGoals";

interface GoalCardProps {
  goal: Goal & {
    categorias?: { nome: string; cor_hex?: string } | null;
    cartoes?: { nome_exibicao: string; emissor?: string } | null;
  };
  onClick: (id: string) => void;
}

const getGoalIcon = (tipo: GoalType) => {
  const icons = {
    economizar: PiggyBank,
    reduzir: TrendingDown,
    quitar: CreditCard,
    personalizada: Target,
  };
  return icons[tipo];
};

export const GoalCard = ({ goal, onClick }: GoalCardProps) => {
  const Icon = getGoalIcon(goal.tipo);
  const colors = getGoalTypeColors(goal.tipo);
  const daysRemaining = calculateDaysRemaining(goal.prazo);

  const handleClick = () => {
    onClick(goal.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(goal.id);
    }
  };

  const getProgressColor = () => {
    switch (goal.tipo) {
      case "economizar":
        return "bg-blue-600";
      case "reduzir":
        return "bg-orange-600";
      case "quitar":
        return "bg-red-600";
      default:
        return "bg-purple-600";
    }
  };

  const getStatusBadgeClasses = () => {
    switch (goal.status) {
      case "ativa":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "concluida":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "pausada":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "";
    }
  };

  return (
    <Card
      className="group cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalhes da meta: ${goal.titulo}`}
    >
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`rounded-xl p-2.5 ${colors.bg}`}>
              <Icon className={`h-5 w-5 ${colors.icon}`} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
                {goal.titulo}
              </h3>
              <span className="text-xs text-muted-foreground">
                {getGoalTypeLabel(goal.tipo)}
              </span>
            </div>
          </div>
          <Badge className={getStatusBadgeClasses()}>{getGoalStatusLabel(goal.status)}</Badge>
        </div>

        <div className="mb-4">
          <GoalProgress
            current={Number(goal.valor_atual)}
            target={Number(goal.valor_alvo)}
            color={getProgressColor()}
          />
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>
              {goal.status === "concluida"
                ? "Meta concluída!"
                : daysRemaining > 0
                  ? `${daysRemaining} dias restantes`
                  : "Prazo finalizado"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-primary hover:bg-transparent hover:text-primary/80"
          >
            Ver detalhes <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
