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
  
  const { data: entradas = [], isLoading } = useEntradas(dateRange);
  const { data: summary } = useEntradasSummary(dateRange);
  const deleteEntrada = useDeleteEntrada();

  const filteredEntradas = entradas.filter(
    (entrada) =>
      entrada.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entrada.categorias?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    dateRange,
    setDateRange,
    searchTerm,
    setSearchTerm,
    entradas,
    filteredEntradas,
    summary,
    deleteEntrada,
    isLoading,
  };
};

