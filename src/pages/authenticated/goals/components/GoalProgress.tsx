import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/goalUtils";

interface GoalProgressProps {
  current: number;
  target: number;
  showLabel?: boolean;
  color?: string;
  size?: "sm" | "md" | "lg";
}

export const GoalProgress = ({
  current,
  target,
  showLabel = true,
  color = "bg-primary",
  size = "md",
}: GoalProgressProps) => {
  const percentage = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;

  const heightClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">{percentage}% concluído</span>
          <span className="text-muted-foreground">
            {formatCurrency(current)} de {formatCurrency(target)}
          </span>
        </div>
      )}
      <div
        className={`w-full overflow-hidden rounded-full bg-muted ${heightClasses[size]}`}
      >
        <div
          className={`${heightClasses[size]} rounded-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
