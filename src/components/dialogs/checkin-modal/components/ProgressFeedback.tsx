import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

type FeedbackVariant = "success" | "warning" | "info";

interface ProgressFeedbackProps {
  variant: FeedbackVariant;
  title: string;
  message: string;
}

export const ProgressFeedback = ({ variant, title, message }: ProgressFeedbackProps) => {
  const variants = {
    success: {
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-100 dark:border-green-800",
      icon: CheckCircle2,
      iconColor: "text-green-600",
      titleColor: "text-green-900 dark:text-green-100",
      messageColor: "text-green-700 dark:text-green-200",
    },
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-100 dark:border-yellow-800",
      icon: AlertTriangle,
      iconColor: "text-yellow-600",
      titleColor: "text-yellow-900 dark:text-yellow-100",
      messageColor: "text-yellow-700 dark:text-yellow-200",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-100 dark:border-blue-800",
      icon: Info,
      iconColor: "text-blue-600",
      titleColor: "text-blue-900 dark:text-blue-100",
      messageColor: "text-blue-700 dark:text-blue-200",
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div className={`flex items-start gap-3 rounded-lg border p-4 ${config.bg} ${config.border}`}>
      <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${config.iconColor}`} />
      <div>
        <h4 className={`font-medium ${config.titleColor}`}>{title}</h4>
        <p className={`mt-1 text-sm ${config.messageColor}`}>{message}</p>
      </div>
    </div>
  );
};
