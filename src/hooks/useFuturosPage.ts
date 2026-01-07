import { useState, useMemo, useEffect } from "react";
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
  const [currentPagePendentes, setCurrentPagePendentes] = useState(1);
  const [currentPageEfetivados, setCurrentPageEfetivados] = useState(1);
  const pageSize = 5;

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

  const filteredPendentes = useMemo(() => {
    return lancamentosPendentes.filter(
      (lancamento) =>
        lancamento.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lancamento.categorias?.nome
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [lancamentosPendentes, searchTerm]);

  const totalPagesPendentes = useMemo(() => {
    return Math.ceil(filteredPendentes.length / pageSize);
  }, [filteredPendentes.length, pageSize]);

  const paginatedPendentes = useMemo(() => {
    const startIndex = (currentPagePendentes - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredPendentes.slice(startIndex, endIndex);
  }, [filteredPendentes, currentPagePendentes, pageSize]);

  const totalPagesEfetivados = useMemo(() => {
    return Math.ceil(lancamentosEfetivados.length / pageSize);
  }, [lancamentosEfetivados.length, pageSize]);

  const paginatedEfetivados = useMemo(() => {
    const startIndex = (currentPageEfetivados - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return lancamentosEfetivados.slice(startIndex, endIndex);
  }, [lancamentosEfetivados, currentPageEfetivados, pageSize]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPagePendentes(1);
  }, [searchTerm, dateRange]);

  useEffect(() => {
    setCurrentPageEfetivados(1);
  }, [dateRange]);

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
    paginatedPendentes,
    lancamentosEfetivados,
    paginatedEfetivados,
    summary,
    efetivarLancamento,
    deleteLancamento,
    loadingPendentes: loadingPendentes || isRefreshing,
    loadingEfetivados: loadingEfetivados || isRefreshing,
    handleRefresh,
    currentPagePendentes,
    setCurrentPagePendentes,
    totalPagesPendentes,
    currentPageEfetivados,
    setCurrentPageEfetivados,
    totalPagesEfetivados,
  };
};
