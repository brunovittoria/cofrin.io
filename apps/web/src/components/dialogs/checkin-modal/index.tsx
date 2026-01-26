import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useCreateCheckIn } from "@/hooks/api/useCheckIns";
import { useUpdateGoalProgress } from "@/hooks/api/useGoals";
import { checkInSchema, type CheckInFormData } from "@/lib/validations";
import {
  MoodSelector,
  ObstaclesField,
  ProgressFeedback,
  ValueField,
  NoteField,
  FormActions,
} from "./components";

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalId: string;
  goalTitle: string;
}

export const CheckInModal = ({
  isOpen,
  onClose,
  goalId,
  goalTitle,
}: CheckInModalProps) => {
  const createCheckIn = useCreateCheckIn();
  const updateGoalProgress = useUpdateGoalProgress();

  const form = useForm<CheckInFormData>({
    resolver: zodResolver(checkInSchema),
    mode: "onChange",
    defaultValues: {
      humor: undefined,
      valor_adicionado: "",
      obstaculos: "",
      nota: "",
    },
  });

  const humor = form.watch("humor");

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = async (data: CheckInFormData) => {
    const valor = parseFloat(data.valor_adicionado?.replace(",", ".") || "0");

    // Create check-in
    await createCheckIn.mutateAsync({
      goal_id: goalId,
      mood: data.humor || undefined,
      obstacles: data.obstaculos?.trim() || undefined,
      added_value: valor,
      note: data.nota?.trim() || undefined,
    });

    // Update goal progress if value was added
    if (valor > 0) {
      await updateGoalProgress.mutateAsync({
        id: goalId,
        valor_adicional: valor,
      });
    }

    handleClose();
  };

  const getFeedbackVariant = (): "success" | "info" | "warning" => {
    if (!humor) return "info";
    if (humor === "positivo") return "success";
    if (humor === "neutro") return "info";
    return "warning";
  };

  const getFeedbackContent = () => {
    if (!humor) {
      return {
        title: "Check-in Semanal",
        message: "Registre como foi sua semana para acompanhar seu progresso.",
      };
    }
    if (humor === "positivo") {
      return {
        title: "Ótimo progresso!",
        message: "Continue assim! Manter a consistência é a chave para o sucesso.",
      };
    }
    if (humor === "neutro") {
      return {
        title: "Mantenha o foco",
        message: "Semanas neutras fazem parte do processo. O importante é continuar.",
      };
    }
    return {
      title: "Não desanime",
      message:
        "Tudo bem ter semanas difíceis. O importante é não desistir. Pequenos passos contam!",
    };
  };

  const feedback = getFeedbackContent();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Check-in Semanal</DialogTitle>
          <DialogDescription>Meta: {goalTitle}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <ProgressFeedback
              variant={getFeedbackVariant()}
              title={feedback.title}
              message={feedback.message}
            />

            <MoodSelector control={form.control} setValue={form.setValue} />

            <ValueField control={form.control} />

            <NoteField control={form.control} />

            <ObstaclesField control={form.control} />

            <FormActions
              onCancel={handleClose}
              isLoading={createCheckIn.isPending || updateGoalProgress.isPending}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
