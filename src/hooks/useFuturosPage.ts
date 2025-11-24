import { useState } from "react";
import { DateRange } from "react-day-picker";
import {
  useLancamentosFuturos,
  useLancamentosFuturosSummary,
  useEfetivarLancamentoFuturo,
  useDeleteLancamentoFuturo,
} from "@/hooks/api/useLancamentosFuturos";

export const useFuturosPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const { data: lancamentosPendentes = [], isLoading: loadingPendentes } =
    useLancamentosFuturos(dateRange, "pendente");
  const { data: lancamentosEfetivados = [], isLoading: loadingEfetivados } =
    useLancamentosFuturos(dateRange, "efetivado");
  const { data: summary } = useLancamentosFuturosSummary(dateRange);
  const efetivarLancamento = useEfetivarLancamentoFuturo();
  const deleteLancamento = useDeleteLancamentoFuturo();

  const filteredPendentes = lancamentosPendentes.filter(
    (lancamento) =>
      lancamento.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lancamento.categorias?.nome
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    window.location.reload();
  };

  return {
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    lancamentosPendentes,
    filteredPendentes,
    lancamentosEfetivados,
    summary,
    efetivarLancamento,
    deleteLancamento,
    loadingPendentes,
    loadingEfetivados,
    handleRefresh,
  };
};

