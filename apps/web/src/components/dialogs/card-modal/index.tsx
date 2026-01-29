import { type ReactNode, useState, useEffect, useMemo } from "react";
import { PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cardSchema, type CardFormData } from "@/lib/validations";
import { cardProvidersMap } from "@/mocks/cardProviders";
import { CardBasicFields } from "./components/CardBasicFields";
import { CardProviderFields } from "./components/CardProviderFields";
import { CardNumberLimitFields } from "./components/CardNumberLimitFields";
import { CardUsageFields } from "./components/CardUsageFields";
import { FormActions } from "./components/FormActions";

interface Card {
  id?: string;
  display_name: string;
  nickname?: string;
  flag?: string;
  card_last_four?: string;
  total_limit: number | string;
  used_amount: number | string;
  available_amount?: number;
  usage_percentage?: number;
  issuer?: string;
  imagem_url?: string;
  created_at?: string;
  is_primary?: boolean;
}

interface CardModalProps {
  mode: "add" | "edit";
  trigger?: ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  card?: Card;
  onSave: (data: Card) => void;
  isSaving?: boolean;
}

export function CardModal({
  mode,
  trigger,
  open: controlledOpen,
  setOpen: controlledSetOpen,
  card,
  onSave,
  isSaving,
}: CardModalProps) {
  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : localOpen;
  const setOpen =
    controlledSetOpen !== undefined ? controlledSetOpen : setLocalOpen;

  const form = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    mode: "onChange",
    defaultValues: {
      display_name: "",
      nickname: "",
      flag: "",
      issuer: "",
      card_last_four: "",
      total_limit: "",
      used_amount: "",
    },
  });

  // Reset form when card changes (for edit mode)
  useEffect(() => {
    if (isOpen && mode === "edit" && card) {
      form.reset({
        display_name: card.display_name || "",
        nickname: card.nickname || "",
        flag: card.flag || "",
        issuer: card.issuer || "",
        card_last_four: card.card_last_four || "",
        total_limit: String(card.total_limit || ""),
        used_amount: String(card.used_amount || ""),
      });
    } else if (isOpen && mode === "add") {
      form.reset({
        display_name: "",
        nickname: "",
        flag: "",
        issuer: "",
        card_last_four: "",
        total_limit: "",
        used_amount: "",
      });
    }
  }, [isOpen, mode, card, form]);

  // Computed values
  const watchedTotalLimit = form.watch("total_limit");
  const watchedUsedAmount = form.watch("used_amount");
  const watchedIssuer = form.watch("issuer");

  const limitNumber = useMemo(
    () => parseFloat(watchedTotalLimit?.replace(",", ".") || "0") || 0,
    [watchedTotalLimit]
  );
  const usedNumber = useMemo(
    () => parseFloat(watchedUsedAmount?.replace(",", ".") || "0") || 0,
    [watchedUsedAmount]
  );
  const selectedProvider = watchedIssuer
    ? cardProvidersMap[watchedIssuer]
    : undefined;

  const availableValue = Math.max(limitNumber - usedNumber, 0);
  const usagePercentage =
    limitNumber > 0
      ? Math.min((usedNumber / limitNumber) * 100, 999)
      : 0;

  const handleSubmit = (data: CardFormData) => {
    const submitData = {
      display_name: data.display_name,
      nickname: data.nickname?.trim() ? data.nickname : null,
      flag: data.flag || null,
      card_last_four: data.card_last_four?.trim() || null,
      total_limit: limitNumber,
      used_amount: usedNumber,
      available_amount: availableValue,
      usage_percentage: usagePercentage,
      issuer: data.issuer || null,
    };

    if (mode === "edit" && card?.id) {
      onSave({
        ...submitData,
        id: card.id,
        imagem_url: card.imagem_url || null,
        created_at: card.created_at || null,
        is_primary: card.is_primary || false,
      });
    } else {
      onSave({
        ...submitData,
        is_primary: false,
      });
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      form.reset();
    }
    setOpen(next);
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
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-5 flex flex-col gap-5">
            <div className="flex-1 min-w-0 grid gap-4">
              <CardBasicFields control={form.control} />

              <CardProviderFields control={form.control} />

              <CardNumberLimitFields control={form.control} />

              <CardUsageFields
                control={form.control}
                providerImageUrl={selectedProvider?.imageUrl}
                providerName={selectedProvider?.name}
                availableValue={availableValue}
                usagePercentage={usagePercentage}
              />

              <FormActions
                isSaving={isSaving}
                onCancel={() => setOpen(false)}
                submitLabel={currentConfig.submitLabel}
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
