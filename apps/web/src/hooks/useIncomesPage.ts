import { useState } from "react";
import {
  useIncomes,
  useIncomesSummary,
  useDeleteIncome,
} from "@/hooks/api/useIncomes";
import { useFiltersStore } from "@/stores";

export const useIncomesPage = () => {
  const dateRange = useFiltersStore((state) => state.incomesDateRange);
  const setDateRange = useFiltersStore((state) => state.setIncomesDateRange);
  const searchTerm = useFiltersStore((state) => state.incomesSearchTerm);
  const setSearchTerm = useFiltersStore((state) => state.setIncomesSearchTerm);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data: incomes = [], isLoading, refetch: refetchIncomes } = useIncomes(dateRange);
  const { data: summary, refetch: refetchSummary } = useIncomesSummary(dateRange);
  const deleteIncome = useDeleteIncome();

  const filteredIncomes = incomes.filter(
    (income) =>
      income.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      income.categorias?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchIncomes(), refetchSummary()]);
    setIsRefreshing(false);
  };

  return {
    dateRange,
    setDateRange,
    searchTerm,
    setSearchTerm,
    incomes,
    filteredIncomes,
    summary,
    deleteIncome,
    isLoading: isLoading || isRefreshing,
    handleRefresh,
  };
};
