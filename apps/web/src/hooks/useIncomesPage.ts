import { useState } from "react";
import { DateRange } from "react-day-picker";
import {
  useIncomes,
  useIncomesSummary,
  useDeleteIncome,
} from "@/hooks/api/useIncomes";

export const useIncomesPage = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
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
