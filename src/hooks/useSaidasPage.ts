import { useState } from "react";
import { DateRange } from "react-day-picker";
import {
  useSaidas,
  useSaidasSummary,
  useDeleteSaida,
} from "@/hooks/api/useSaidas";

export const useSaidasPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: saidas = [], isLoading, refetch: refetchSaidas } = useSaidas(dateRange);
  const { data: summary, refetch: refetchSummary } = useSaidasSummary(dateRange);
  const deleteSaida = useDeleteSaida();

  const filteredSaidas = saidas.filter(
    (saida) =>
      saida.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      saida.categorias?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchSaidas(), refetchSummary()]);
    setIsRefreshing(false);
  };

  return {
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    saidas,
    filteredSaidas,
    summary,
    deleteSaida,
    isLoading: isLoading || isRefreshing,
    handleRefresh,
  };
};

