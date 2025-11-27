import { useState } from "react";
import { DateRange } from "react-day-picker";
import {
  useEntradas,
  useEntradasSummary,
  useDeleteEntrada,
} from "@/hooks/api/useEntradas";

export const useEntradasPage = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data: entradas = [], isLoading, refetch: refetchEntradas } = useEntradas(dateRange);
  const { data: summary, refetch: refetchSummary } = useEntradasSummary(dateRange);
  const deleteEntrada = useDeleteEntrada();

  const filteredEntradas = entradas.filter(
    (entrada) =>
      entrada.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entrada.categorias?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchEntradas(), refetchSummary()]);
    setIsRefreshing(false);
  };

  return {
    dateRange,
    setDateRange,
    searchTerm,
    setSearchTerm,
    entradas,
    filteredEntradas,
    summary,
    deleteEntrada,
    isLoading: isLoading || isRefreshing,
    handleRefresh,
  };
};

