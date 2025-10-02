import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinancialCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  variant: "success" | "danger" | "info";
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const variantStyles: Record<FinancialCardProps["variant"], { container: string; icon: string }> = {
  success: {
    container: "bg-[#ECFDF3] text-[#16A34A]",
    icon: "text-[#16A34A]",
  },
  danger: {
    container: "bg-[#FEF2F2] text-[#DC2626]",
    icon: "text-[#DC2626]",
  },
  info: {
    container: "bg-[#EEF2FF] text-[#0A84FF]",
    icon: "text-[#0A84FF]",
  },
};

export function FinancialCard({ title, value, icon: Icon, variant, trend }: FinancialCardProps) {
  const styles = variantStyles[variant];

  return (
    <article className="surface-card p-6">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-4">
          <p className="kpi-label">{title}</p>
          <div className="space-y-3">
            <p className="kpi-value">{value}</p>
            {trend && (
              <span className={cn(trend.isPositive ? "positive-pill" : "negative-pill")}
              >
                {trend.isPositive ? "+" : "-"}
                {trend.value.replace(/^[-+]/, "")}
              </span>
            )}
          </div>
        </div>
        <div className={cn("flex h-14 w-14 items-center justify-center rounded-3xl border border-[#E5E7EB]", styles.container)}>
          <Icon className={cn("h-6 w-6", styles.icon)} />
        </div>
      </div>
    </article>
  );
}
