import { useState } from "react";
import { useNavigate, getRouteApi } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Target,
  TrendingUp,
  Pause,
  Play,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useGoal, useUpdateGoal, useDeleteGoal } from "@/hooks/api/useGoals";
import { useCheckIns } from "@/hooks/api/useCheckIns";
import { GoalProgress, GoalHistory } from "../components";
import { CheckInModal } from "@/components/dialogs/checkin-modal";
import { PageSkeleton } from "@/components/PageSkeleton";
import {
  formatCurrency,
  formatDate,
  calculateMonthlySuggestion,
  calculateGoalHealth,
  getProgressFeedback,
  getGoalTypeColors,
} from "@/lib/goalUtils";

const routeApi = getRouteApi("/_authenticated/goals/$id");

export default function GoalDetailPage() {
  const { id } = routeApi.useParams();
  const navigate = useNavigate();
  const [showCheckIn, setShowCheckIn] = useState(false);

  const { data: goal, isLoading: isLoadingGoal } = useGoal(id || "");
  const { data: checkIns = [], isLoading: isLoadingCheckIns } = useCheckIns(id || "");
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();

  const handleBack = () => {
    navigate({ to: "/goals" });
  };

  const handleTogglePause = () => {
    if (!goal) return;
    updateGoal.mutate({
      id: goal.id,
      status: goal.status === "pausada" ? "ativa" : "pausada",
    });
  };

  const handleDelete = () => {
    if (!goal) return;
    deleteGoal.mutate(goal.id, {
      onSuccess: () => {
        navigate({ to: "/goals" });
      },
    });
  };

  if (isLoadingGoal || isLoadingCheckIns) {
    return <PageSkeleton hasCards cardCount={3} hasTable />;
  }

  if (!goal) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Meta não encontrada
          </h2>
          <p className="mb-4 text-muted-foreground">
            A meta que você está procurando não existe ou foi removida.
          </p>
          <Button onClick={handleBack}>Voltar para Metas</Button>
        </div>
      </div>
    );
  }

  const colors = getGoalTypeColors(goal.type);
  const health = calculateGoalHealth(
    Number(goal.current_amount),
    Number(goal.target_amount),
    goal.created_at,
    goal.deadline
  );
  const feedback = getProgressFeedback(health);
  const monthlySuggestion = calculateMonthlySuggestion(
    Number(goal.target_amount),
    Number(goal.current_amount),
    goal.deadline
  );
  const percentage = Math.min(
    Math.round((Number(goal.current_amount) / Number(goal.target_amount)) * 100),
    100
  );

  const getProgressColor = () => {
    switch (goal.type) {
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

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack} aria-label="Voltar">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{goal.title}</h1>
              <p className="text-sm text-muted-foreground">
                Meta de{" "}
                {goal.type === "economizar"
                  ? "Economia"
                  : goal.type === "reduzir"
                    ? "Redução de Gastos"
                    : goal.type === "quitar"
                      ? "Quitação de Dívida"
                      : "Personalizada"}{" "}
                • Criada em {formatDate(goal.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowCheckIn(true)}>Fazer Check-in</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Main Progress Card */}
          <Card className="md:col-span-2">
            <CardContent className="space-y-6 p-6">
              <div>
                <div className="mb-2 flex items-end justify-between">
                  <span className="font-medium text-muted-foreground">
                    Progresso Total
                  </span>
                  <span className="text-2xl font-bold text-primary">{percentage}%</span>
                </div>
                <GoalProgress
                  current={Number(goal.current_amount)}
                  target={Number(goal.target_amount)}
                  showLabel={false}
                  color={getProgressColor()}
                  size="lg"
                />
                <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                  <span>{formatCurrency(Number(goal.current_amount))} guardados</span>
                  <span>Meta: {formatCurrency(Number(goal.target_amount))}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                <div>
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    Prazo
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      {formatDate(goal.deadline)}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    Meta Mensal
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      {formatCurrency(monthlySuggestion)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Feedback */}
              <div
                className={`flex items-start gap-3 rounded-lg p-4 ${
                  feedback.variant === "success"
                    ? "bg-green-50 dark:bg-green-900/20"
                    : feedback.variant === "info"
                      ? "bg-blue-50 dark:bg-blue-900/20"
                      : "bg-yellow-50 dark:bg-yellow-900/20"
                }`}
              >
                <TrendingUp
                  className={`mt-0.5 h-5 w-5 ${
                    feedback.variant === "success"
                      ? "text-green-600"
                      : feedback.variant === "info"
                        ? "text-blue-600"
                        : "text-yellow-600"
                  }`}
                />
                <div>
                  <h4
                    className={`font-medium ${
                      feedback.variant === "success"
                        ? "text-green-900 dark:text-green-100"
                        : feedback.variant === "info"
                          ? "text-blue-900 dark:text-blue-100"
                          : "text-yellow-900 dark:text-yellow-100"
                    }`}
                  >
                    {feedback.title}
                  </h4>
                  <p
                    className={`mt-1 text-sm ${
                      feedback.variant === "success"
                        ? "text-green-700 dark:text-green-200"
                        : feedback.variant === "info"
                          ? "text-blue-700 dark:text-blue-200"
                          : "text-yellow-700 dark:text-yellow-200"
                    }`}
                  >
                    {feedback.message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reflection Reminder */}
          <Card className={`${colors.bg} ${colors.border} border`}>
            <CardContent className="p-6">
              <h3 className={`mb-2 font-semibold ${colors.text}`}>Por que comecei?</h3>
              <p className={`mb-4 text-sm italic ${colors.text} opacity-90`}>
                "{goal.reflection_why || "Nenhuma reflexão registrada."}"
              </p>
              <div className={`text-xs font-medium uppercase tracking-wide ${colors.text} opacity-70`}>
                Sua motivação inicial
              </div>
            </CardContent>
          </Card>
        </div>

        {/* History */}
        <GoalHistory checkIns={checkIns} />

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={handleTogglePause}
              disabled={updateGoal.isPending || goal.status === "concluida"}
              className="gap-2"
            >
              {goal.status === "pausada" ? (
                <>
                  <Play className="h-4 w-4" />
                  Retomar Meta
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4" />
                  Pausar Meta
                </>
              )}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Excluir Meta
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir meta?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Todos os check-ins e o histórico
                    desta meta serão permanentemente excluídos.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>

      <CheckInModal
        isOpen={showCheckIn}
        onClose={() => setShowCheckIn(false)}
        goalId={goal.id}
        goalTitle={goal.title}
      />
    </div>
  );
}
