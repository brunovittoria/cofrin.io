import { useState, useMemo } from "react";
import { cardProvidersMap } from "@/mocks/cardProviders";

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

interface UseCardFormProps {
  mode: "add" | "edit";
  initialCard?: Card;
}

const getInitialFormState = (mode: "add" | "edit", card?: Card) => {
  if (mode === "edit" && card) {
    return { ...card };
  }

  return {
    display_name: "",
    nickname: "",
    flag: "",
    issuer: "",
    card_last_four: "",
    total_limit: "",
    used_amount: "",
  };
};

export const useCardForm = ({ mode, initialCard }: UseCardFormProps) => {
  const [formData, setFormData] = useState(() =>
    getInitialFormState(mode, initialCard)
  );

  const limitNumber = useMemo(
    () => Number(formData.total_limit) || 0,
    [formData.total_limit]
  );
  const usedNumber = useMemo(
    () => Number(formData.used_amount) || 0,
    [formData.used_amount]
  );
  const selectedProvider = formData.issuer
    ? cardProvidersMap[formData.issuer]
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
      display_name: formData.display_name,
      nickname: formData.nickname?.trim() ? formData.nickname : null,
      flag: formData.flag || null,
      card_last_four: formData.card_last_four?.trim() || null,
      total_limit: limitNumber,
      used_amount: usedNumber,
      available_amount: Math.max(limitNumber - usedNumber, 0),
      usage_percentage:
        limitNumber > 0 ? (usedNumber / limitNumber) * 100 : 0,
      issuer: formData.issuer || null,
    };

    if (mode === "edit" && formData.id) {
      return {
        ...baseData,
        id: formData.id,
        imagem_url: formData.imagem_url || null,
        created_at: formData.created_at || null,
        is_primary: formData.is_primary || false,
      };
    }

    return {
      ...baseData,
      is_primary: false,
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
