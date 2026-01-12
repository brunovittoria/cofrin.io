import { useState, useMemo } from "react";
import { cardProvidersMap } from "@/mocks/cardProviders";

interface Card {
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

interface UseCardFormProps {
  mode: "add" | "edit";
  initialCard?: Card;
}

const getInitialFormState = (mode: "add" | "edit", card?: Card) => {
  if (mode === "edit" && card) {
    return { ...card };
  }

  return {
    nome_exibicao: "",
    apelido: "",
    bandeira: "",
    emissor: "",
    final_cartao: "",
    limite_total: "",
    valor_utilizado: "",
  };
};

export const useCardForm = ({ mode, initialCard }: UseCardFormProps) => {
  const [formData, setFormData] = useState(() =>
    getInitialFormState(mode, initialCard)
  );

  const limitNumber = useMemo(
    () => Number(formData.limite_total) || 0,
    [formData.limite_total]
  );
  const usedNumber = useMemo(
    () => Number(formData.valor_utilizado) || 0,
    [formData.valor_utilizado]
  );
  const selectedProvider = formData.emissor
    ? cardProvidersMap[formData.emissor]
    : undefined;

  const availableValue = Math.max(limitNumber - usedNumber, 0);
  const usagePercentage =
    limitNumber > 0
      ? Math.min((usedNumber / limitNumber) * 100, 999)
      : 0;

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(getInitialFormState(mode, initialCard));
  };

  const getSubmitData = () => {
    const baseData = {
      nome_exibicao: formData.nome_exibicao,
      apelido: formData.apelido?.trim() ? formData.apelido : null,
      bandeira: formData.bandeira || null,
      final_cartao: formData.final_cartao?.trim() || null,
      limite_total: limitNumber,
      valor_utilizado: usedNumber,
      valor_disponivel: Math.max(limitNumber - usedNumber, 0),
      uso_percentual:
        limitNumber > 0 ? (usedNumber / limitNumber) * 100 : 0,
      emissor: formData.emissor || null,
    };

    if (mode === "edit" && formData.id) {
      return {
        ...baseData,
        id: formData.id,
        imagem_url: formData.imagem_url || null,
        criado_em: formData.criado_em || null,
        is_principal: formData.is_principal || false,
      };
    }

    return {
      ...baseData,
      is_principal: false,
    };
  };

  return {
    formData,
    updateField,
    selectedProvider,
    availableValue,
    usagePercentage,
    getSubmitData,
    resetForm,
  };
};
