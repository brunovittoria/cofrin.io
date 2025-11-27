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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: lancamentosPendentes = [],
    isLoading: loadingPendentes,
    refetch: refetchPendentes,
  } = useLancamentosFuturos(dateRange, "pendente");

  const {
    data: lancamentosEfetivados = [],
    isLoading: loadingEfetivados,
    refetch: refetchEfetivados,
  } = useLancamentosFuturos(dateRange, "efetivado");

  const { data: summary, refetch: refetchSummary } =
    useLancamentosFuturosSummary(dateRange);

  const efetivarLancamento = useEfetivarLancamentoFuturo();
  const deleteLancamento = useDeleteLancamentoFuturo();

  const filteredPendentes = lancamentosPendentes.filter(
    (lancamento) =>
      lancamento.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lancamento.categorias?.nome
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      refetchPendentes(),
      refetchEfetivados(),
      refetchSummary(),
    ]);
    setIsRefreshing(false);
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
    loadingPendentes: loadingPendentes || isRefreshing,
    loadingEfetivados: loadingEfetivados || isRefreshing,
    handleRefresh,
  };
};
