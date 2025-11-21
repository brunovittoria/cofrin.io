import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEditCartaoForm } from "@/hooks/useEditCartaoForm";
import { CardBasicFields } from "@/components/edit-card-modal/components/CardBasicFields";
import { CardProviderFields } from "@/components/edit-card-modal/components/CardProviderFields";
import { CardNumberLimitFields } from "@/components/edit-card-modal/components/CardNumberLimitFields";
import { CardUsageFields } from "@/components/edit-card-modal/components/CardUsageFields";
import { FormActions } from "@/components/edit-card-modal/components/FormActions";

interface Cartao {
  id: string;
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

interface EditCartaoModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  cartao: Cartao;
  onSave: (data: Cartao) => void;
  isSaving?: boolean;
}

export function EditCartaoModal({
  open,
  setOpen,
  cartao,
  onSave,
  isSaving,
}: EditCartaoModalProps) {
  const {
    formData,
    updateField,
    selectedProvider,
    valorDisponivel,
    usoPercentual,
    getSubmitData,
  } = useEditCartaoForm(cartao);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(getSubmitData());
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-2xl rounded-2xl px-6 py-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-semibold text-[#0F172A]">
            Editar cartao
          </DialogTitle>
          <DialogDescription className="text-sm text-[#6B7280]">
            Altere os dados do cartão e salve para atualizar no sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
          <div className="flex-1 min-w-0 grid gap-4">
            <CardBasicFields
              nomeExibicao={formData.nome_exibicao}
              apelido={formData.apelido}
              onNomeExibicaoChange={(value) =>
                updateField("nome_exibicao", value)
              }
              onApelidoChange={(value) => updateField("apelido", value)}
            />

            <CardProviderFields
              emissor={formData.emissor}
              bandeira={formData.bandeira}
              onEmissorChange={(value) => updateField("emissor", value)}
              onBandeiraChange={(value) => updateField("bandeira", value)}
            />

            <CardNumberLimitFields
              finalCartao={formData.final_cartao}
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

            <FormActions isSaving={isSaving} onCancel={() => setOpen(false)} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
