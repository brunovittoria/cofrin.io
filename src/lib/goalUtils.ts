import { GoalType, GoalStatus } from "@/hooks/api/useGoals";
import { CheckInMood } from "@/hooks/api/useCheckIns";

export type ReflectionData = {
  porque: string;
  mudanca: string;
  sentimento: string;
};

export type { CheckInMood };

/**
 * Calculate the percentage of goal completion
 */
export const calculateProgress = (current: number, target: number): number => {
  if (target <= 0) return 0;
  const percentage = (current / target) * 100;
  return Math.min(Math.round(percentage * 10) / 10, 100);
};

/**
 * Calculate months remaining until deadline
 */
export const calculateMonthsRemaining = (deadline: string): number => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const months = Math.ceil(diffDays / 30);
  return Math.max(months, 0);
};

/**
 * Calculate days remaining until deadline
 */
export const calculateDaysRemaining = (deadline: string): number => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(diffDays, 0);
};

/**
 * Calculate suggested monthly contribution to reach goal
 */
export const calculateMonthlySuggestion = (
  targetAmount: number,
  currentAmount: number,
  deadline: string
): number => {
  const remaining = targetAmount - currentAmount;
  if (remaining <= 0) return 0;

  const monthsRemaining = calculateMonthsRemaining(deadline);
  if (monthsRemaining <= 0) return remaining;

  return Math.ceil(remaining / monthsRemaining);
};

/**
 * Calculate if user is on track to meet their goal
 */
export const calculateGoalHealth = (
  currentAmount: number,
  targetAmount: number,
  createdAt: string,
  deadline: string
): "ahead" | "on_track" | "behind" | "completed" => {
  if (currentAmount >= targetAmount) return "completed";

  const startDate = new Date(createdAt);
  const endDate = new Date(deadline);
  const today = new Date();

  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = today.getTime() - startDate.getTime();

  if (totalDuration <= 0) return "behind";

  const expectedProgress = (elapsed / totalDuration) * targetAmount;
  const actualProgress = currentAmount;

  const ratio = actualProgress / expectedProgress;

  if (ratio >= 1.1) return "ahead";
  if (ratio >= 0.9) return "on_track";
  return "behind";
};

/**
 * Get goal type label in Portuguese
 */
export const getGoalTypeLabel = (tipo: GoalType): string => {
  const labels: Record<GoalType, string> = {
    economizar: "Guardar Dinheiro",
    reduzir: "Reduzir Gastos",
    quitar: "Quitar Dívida",
    personalizada: "Personalizada",
  };
  return labels[tipo];
};

/**
 * Get goal status label in Portuguese
 */
export const getGoalStatusLabel = (status: GoalStatus): string => {
  const labels: Record<GoalStatus, string> = {
    ativa: "Em andamento",
    concluida: "Concluída",
    pausada: "Pausada",
  };
  return labels[status];
};

/**
 * Get color classes based on goal type
 */
export const getGoalTypeColors = (tipo: GoalType) => {
  const colors: Record<GoalType, { bg: string; text: string; border: string; icon: string }> = {
    economizar: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: "text-blue-600",
    },
    reduzir: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
      icon: "text-orange-600",
    },
    quitar: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      icon: "text-red-600",
    },
    personalizada: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      icon: "text-purple-600",
    },
  };
  return colors[tipo];
};

/**
 * Get status badge variant
 */
export const getStatusBadgeVariant = (
  status: GoalStatus
): "default" | "secondary" | "destructive" | "outline" => {
  const variants: Record<GoalStatus, "default" | "secondary" | "destructive" | "outline"> = {
    ativa: "default",
    concluida: "secondary",
    pausada: "outline",
  };
  return variants[status];
};

/**
 * Format currency in BRL
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

/**
 * Format date in Brazilian format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

/**
 * Get progress feedback message based on goal health
 */
export const getProgressFeedback = (
  health: "ahead" | "on_track" | "behind" | "completed"
): { title: string; message: string; variant: "success" | "info" | "warning" } => {
  const feedback = {
    completed: {
      title: "🎉 Parabéns!",
      message: "Você conquistou sua meta! Que orgulho dessa conquista!",
      variant: "success" as const,
    },
    ahead: {
      title: "Excelente progresso!",
      message: "Você está acima do esperado. Continue assim, está indo muito bem!",
      variant: "success" as const,
    },
    on_track: {
      title: "No caminho certo!",
      message: "Você está mantendo um bom ritmo. Continue focado e consistente.",
      variant: "info" as const,
    },
    behind: {
      title: "Atenção ao progresso",
      message:
        "Tudo bem, o importante é não desistir. Pequenos passos também contam. Que tal revisar sua estratégia?",
      variant: "warning" as const,
    },
  };
  return feedback[health];
};

/**
 * Kakeibo-inspired reflection prompts
 */
export const reflectionPrompts = {
  porque: {
    label: "Por que essa meta é importante para você agora?",
    hint: "Pense além do dinheiro. É sobre segurança? Liberdade? Realizar um sonho antigo?",
    placeholder:
      "Ex: Quero criar uma reserva de emergência para me sentir mais seguro caso algo aconteça com meu emprego...",
  },
  mudanca: {
    label: "O que você está disposto a ajustar para alcançá-la?",
    hint: "Toda escolha envolve uma troca. Pode ser reduzir o delivery ou renegociar um serviço.",
    placeholder:
      "Ex: Vou reduzir os pedidos de comida nos finais de semana e cozinhar mais em casa...",
  },
  sentimento: {
    label: "Como você se sentirá ao conquistar isso?",
    hint: "Visualize o sucesso. Essa emoção será seu combustível nos dias difíceis.",
    placeholder:
      "Ex: Me sentirei aliviado, orgulhoso e no controle da minha vida financeira...",
  },
};

/**
 * Check-in mood options
 */
export const moodOptions = [
  { value: "positivo", emoji: "😊", label: "Bem" },
  { value: "neutro", emoji: "😐", label: "Neutro" },
  { value: "negativo", emoji: "😟", label: "Difícil" },
] as const;

/**
 * Goal type options for selection
 */
export const goalTypeOptions = [
  {
    id: "economizar",
    title: "Guardar Dinheiro",
    description: "Criar uma reserva, viajar ou comprar algo à vista.",
    icon: "PiggyBank",
  },
  {
    id: "reduzir",
    title: "Reduzir Gastos",
    description: "Diminuir despesas em categorias específicas.",
    icon: "TrendingDown",
  },
  {
    id: "quitar",
    title: "Quitar Dívida",
    description: "Eliminar pendências e limpar seu nome.",
    icon: "CreditCard",
  },
  {
    id: "personalizada",
    title: "Personalizada",
    description: "Qualquer outro objetivo financeiro importante.",
    icon: "Target",
  },
] as const;
