import { Target, CheckCircle2, PauseCircle, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SummaryCardsProps {
  total: number;
  active: number;
  completed: number;
  paused: number;
  totalProgress: number;
}

export const SummaryCards = ({
  total,
  active,
  completed,
  paused,
  totalProgress,
}: SummaryCardsProps) => {
  const cards = [
    {
      title: "Total de Metas",
      value: total,
      icon: Target,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600",
    },
    {
      title: "Em Andamento",
      value: active,
      icon: TrendingUp,
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600",
    },
    {
      title: "Concluídas",
      value: completed,
      icon: CheckCircle2,
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600",
    },
    {
      title: "Pausadas",
      value: paused,
      icon: PauseCircle,
      iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
      iconColor: "text-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`rounded-xl p-3 ${card.iconBg}`}>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
