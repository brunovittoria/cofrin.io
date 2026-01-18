import { TrendingUp, TrendingDown, DollarSign, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";

interface SummaryCardsProps {
  toReceive: number;
  toPay: number;
  projectedBalance: number;
  completed: number;
}

const SummaryCard = ({
  title,
  value,
  icon: Icon,
  color = "text-[#16A34A]",
  badgeClass = "bg-[#ECFDF3] text-[#16A34A]",
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  color?: string;
  badgeClass?: string;
}) => (
  <Card className="h-full">
    <CardContent className="p-6 flex flex-col justify-between h-full">
      <h3 className="text-sm font-medium text-[#6B7280] mb-3">{title}</h3>
      <div className="flex items-center justify-between">
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${badgeClass}`}
        >
          <Icon className="h-6 w-6" />
        </span>
      </div>
    </CardContent>
  </Card>
);

export const SummaryCards = ({
  toReceive,
  toPay,
  projectedBalance,
  completed,
}: SummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <SummaryCard
        title="A Receber"
        value={formatCurrency(toReceive)}
        icon={TrendingUp}
        color="text-[#16A34A]"
        badgeClass="bg-[#ECFDF3] text-[#16A34A]"
      />
      <SummaryCard
        title="A Pagar"
        value={formatCurrency(toPay)}
        icon={TrendingDown}
        color="text-[#DC2626]"
        badgeClass="bg-[#FEF2F2] text-[#DC2626]"
      />
      <SummaryCard
        title="Saldo Previsto"
        value={formatCurrency(projectedBalance)}
        icon={DollarSign}
        color={projectedBalance >= 0 ? "text-[#16A34A]" : "text-[#DC2626]"}
        badgeClass={
          projectedBalance >= 0
            ? "bg-[#ECFDF3] text-[#16A34A]"
            : "bg-[#FEF2F2] text-[#DC2626]"
        }
      />
      <SummaryCard
        title="Efetivado"
        value={formatCurrency(completed)}
        icon={Clock}
        color={completed >= 0 ? "text-[#16A34A]" : "text-[#DC2626]"}
        badgeClass={
          completed >= 0
            ? "bg-[#ECFDF3] text-[#16A34A]"
            : "bg-[#FEF2F2] text-[#DC2626]"
        }
      />
    </div>
  );
};
