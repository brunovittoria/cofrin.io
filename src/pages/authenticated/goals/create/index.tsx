import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useGoalForm, GoalFormStep } from "@/hooks/useGoalForm";
import { useCreateGoal } from "@/hooks/api/useGoals";
import { ReflectionStep, GoalTypeSelector, GoalForm } from "../components";

export default function CreateGoalPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<GoalFormStep>(1);
  const createGoal = useCreateGoal();

  const {
    form,
    tipo,
    expenseCategories,
    cards,
    canProceed,
    getSubmitData,
    resetForm,
  } = useGoalForm({ mode: "create" });

  const valorAlvo = form.watch("valor_alvo");
  const valorAtual = form.watch("valor_atual");
  const prazo = form.watch("prazo");

  const handleBack = () => {
    if (step === 1) {
      navigate({ to: "/goals" });
    } else {
      setStep((prev) => (prev - 1) as GoalFormStep);
    }
  };

  const handleNext = () => {
    if (step === 3) {
      const submitData = getSubmitData();
      createGoal.mutate(submitData, {
        onSuccess: () => {
          resetForm();
          navigate({ to: "/goals" });
        },
      });
    } else {
      setStep((prev) => (prev + 1) as GoalFormStep);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Nova Meta</h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <span className={step >= 1 ? "font-medium text-primary" : ""}>
                1. Reflexão
              </span>
              <span className="text-muted-foreground/50">/</span>
              <span className={step >= 2 ? "font-medium text-primary" : ""}>
                2. Tipo
              </span>
              <span className="text-muted-foreground/50">/</span>
              <span className={step >= 3 ? "font-medium text-primary" : ""}>
                3. Definição
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-8">
              {step === 1 && <ReflectionStep control={form.control} />}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="mb-8 text-center">
                    <h2 className="mb-2 text-2xl font-bold text-foreground">
                      Qual é o seu objetivo?
                    </h2>
                    <p className="text-muted-foreground">
                      Escolha o tipo de meta que melhor se adapta ao seu momento.
                    </p>
                  </div>
                  <GoalTypeSelector control={form.control} setValue={form.setValue} />
                </div>
              )}

              {step === 3 && tipo && (
                <div className="space-y-6">
                  <div className="mb-8 text-center">
                    <h2 className="mb-2 text-2xl font-bold text-foreground">
                      Vamos definir os detalhes
                    </h2>
                    <p className="text-muted-foreground">
                      Torne sua meta específica e mensurável.
                    </p>
                  </div>
                  <GoalForm
                    control={form.control}
                    type={tipo}
                    expenseCategories={expenseCategories}
                    cards={cards}
                    valorAlvo={valorAlvo}
                    valorAtual={valorAtual}
                    prazo={prazo}
                  />
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end border-t border-border pt-6">
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canProceed(step) || createGoal.isPending}
                className="w-full gap-2 sm:w-auto"
              >
                {createGoal.isPending ? (
                  "Criando..."
                ) : step === 3 ? (
                  <>
                    Criar Meta
                    <Check className="h-4 w-4" />
                  </>
                ) : (
                  "Continuar"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
