import { type ReactNode, useState } from "react";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCardForm } from "@/hooks/useCardForm";
import { CardBasicFields } from "./components/CardBasicFields";
import { CardProviderFields } from "./components/CardProviderFields";
import { CardNumberLimitFields } from "./components/CardNumberLimitFields";
import { CardUsageFields } from "./components/CardUsageFields";
import { FormActions } from "./components/FormActions";

interface Cartao {
  id?: string;
  nome_exibicao: string;
  apelido?: string;
  bandeira?: string;
  final_cartao?: string;
  limite_total: number | string;
  valor_utilizado: number | string;
  valor_disponivel?: number;
  uso_percentual?: number;
  emissor?: string;
  imagem_url?: string;
  criado_em?: string;
  is_principal?: boolean;
}

interface CardModalProps {
  mode: "add" | "edit";
  trigger?: ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  cartao?: Cartao;
  onSave: (data: Cartao) => void;
  isSaving?: boolean;
}

export function CardModal({
  mode,
  trigger,
  open: controlledOpen,
  setOpen: controlledSetOpen,
  cartao,
  onSave,
  isSaving,
}: CardModalProps) {
  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : localOpen;
  const setOpen =
    controlledSetOpen !== undefined ? controlledSetOpen : setLocalOpen;

  const {
    formData,
    updateField,
    selectedProvider,
    valorDisponivel,
    usoPercentual,
    getSubmitData,
    resetForm,
  } = useCardForm({ mode, initialCartao: cartao });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(getSubmitData());
  };

  const handleSuccess = () => {
    setOpen(false);
    if (mode === "add") {
      resetForm();
    }
  };

  const config = {
    add: {
      title: "Cadastrar cartao",
      description: "Informe os dados essenciais para controlar limite e uso.",
      submitLabel: "Cadastrar",
      defaultTrigger: (
        <Button className="h-11 rounded-2xl bg-[#0A64F5] px-5 text-sm font-semibold text-white shadow-[0px_20px_36px_-18px_rgba(10,100,245,0.55)] transition-transform hover:-translate-y-0.5 hover:bg-[#094ED1] w-full max-w-[220px]">
          <PlusCircle className="h-4 w-4" />
          Adicionar cartao
        </Button>
      ),
    },
    edit: {
      title: "Editar cartao",
      description:
        "Altere os dados do cartão e salve para atualizar no sistema.",
      submitLabel: "Salvar",
      defaultTrigger: null,
    },
  };

  const currentConfig = config[mode];

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {!trigger && mode === "add" && currentConfig.defaultTrigger && (
        <DialogTrigger asChild>{currentConfig.defaultTrigger}</DialogTrigger>
      )}
      <DialogContent className="w-full max-w-2xl rounded-2xl px-6 py-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-semibold text-[#0F172A]">
            {currentConfig.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#6B7280]">
            {currentConfig.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
          <div className="flex-1 min-w-0 grid gap-4">
            <CardBasicFields
              nomeExibicao={formData.nome_exibicao}
              apelido={formData.apelido || ""}
              onNomeExibicaoChange={(value) =>
                updateField("nome_exibicao", value)
              }
              onApelidoChange={(value) => updateField("apelido", value)}
            />

            <CardProviderFields
              emissor={formData.emissor || ""}
              bandeira={formData.bandeira || ""}
              onEmissorChange={(value) => updateField("emissor", value)}
              onBandeiraChange={(value) => updateField("bandeira", value)}
            />

            <CardNumberLimitFields
              finalCartao={formData.final_cartao || ""}
              limiteTotal={String(formData.limite_total)}
              onFinalCartaoChange={(value) =>
                updateField("final_cartao", value)
              }
              onLimiteTotalChange={(value) =>
                updateField("limite_total", value)
              }
            />

            <CardUsageFields
              valorUtilizado={String(formData.valor_utilizado)}
              onValorUtilizadoChange={(value) =>
                updateField("valor_utilizado", value)
              }
              providerImageUrl={selectedProvider?.imageUrl}
              providerName={selectedProvider?.name}
              valorDisponivel={valorDisponivel}
              usoPercentual={usoPercentual}
            />

            <FormActions
              isSaving={isSaving}
              onCancel={() => setOpen(false)}
              submitLabel={currentConfig.submitLabel}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
