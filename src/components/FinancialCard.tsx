import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FinancialCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  variant: "success" | "danger" | "info";
  trend?: {
    value: string;
    isPositive: boolean;
    tooltipText?: string;
  };
}

const variantStyles: Record<FinancialCardProps["variant"], { container: string; icon: string }> = {
  success: {
    container: "bg-success/10 text-success dark:bg-success/20",
    icon: "text-success",
  },
  danger: {
    container: "bg-destructive/10 text-destructive dark:bg-destructive/20",
    icon: "text-destructive",
  },
  info: {
    container: "bg-info/10 text-info dark:bg-info/20",
    icon: "text-info",
  },
};

export function FinancialCard({ title, value, icon: Icon, variant, trend }: FinancialCardProps) {
  const styles = variantStyles[variant];

  return (
    <article className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-colors">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">{title}</p>
          <div className="space-y-3">
            <p className="text-3xl font-semibold text-foreground">{value}</p>
            {trend && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold cursor-help",
                      trend.isPositive 
                        ? "bg-success/10 text-success dark:bg-success/20" 
                        : "bg-destructive/10 text-destructive dark:bg-destructive/20"
                    )}
                    >
                      {trend.value}
                    </span>
                  </TooltipTrigger>
                  {trend.tooltipText && (
                    <TooltipContent>
                      <p className="text-sm">{trend.tooltipText}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        <div className={cn("flex h-14 w-14 items-center justify-center rounded-3xl border border-border", styles.container)}>
          <Icon className={cn("h-6 w-6", styles.icon)} />
        </div>
      </div>
    </article>
  );
}
