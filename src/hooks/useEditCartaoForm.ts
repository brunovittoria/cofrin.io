import { useState, useMemo } from "react";
import { cardProvidersMap } from "@/data/cardProviders";

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

export const useEditCartaoForm = (initialCartao: Cartao) => {
  const [formData, setFormData] = useState({ ...initialCartao });

  const limiteNumber = useMemo(() => Number(formData.limite_total) || 0, [formData.limite_total]);
  const utilizadoNumber = useMemo(() => Number(formData.valor_utilizado) || 0, [formData.valor_utilizado]);
  const selectedProvider = formData.emissor ? cardProvidersMap[formData.emissor] : undefined;

  const valorDisponivel = Math.max(limiteNumber - utilizadoNumber, 0);
  const usoPercentual = limiteNumber > 0 ? Math.min((utilizadoNumber / limiteNumber) * 100, 999) : 0;

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getSubmitData = () => ({
    ...formData,
    id: formData.id,
    nome_exibicao: formData.nome_exibicao,
    apelido: formData.apelido || null,
    bandeira: formData.bandeira || null,
    final_cartao: formData.final_cartao || null,
    limite_total: limiteNumber,
    valor_utilizado: utilizadoNumber,
    valor_disponivel: Math.max(limiteNumber - utilizadoNumber, 0),
    uso_percentual: limiteNumber > 0 ? (utilizadoNumber / limiteNumber) * 100 : 0,
    emissor: formData.emissor || null,
    imagem_url: formData.imagem_url || null,
    criado_em: formData.criado_em || null,
    is_principal: formData.is_principal || false,
  });

  return {
    formData,
    updateField,
    limiteNumber,
    utilizadoNumber,
    selectedProvider,
    valorDisponivel,
    usoPercentual,
    getSubmitData,
  };
};

