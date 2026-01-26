import { useState } from "react";
import {
  useExpenses,
  useExpensesSummary,
  useDeleteExpense,
} from "@/hooks/api/useExpenses";
import { useFiltersStore } from "@/stores";

export const useExpensesPage = () => {
  const searchTerm = useFiltersStore((state) => state.expensesSearchTerm);
  const setSearchTerm = useFiltersStore((state) => state.setExpensesSearchTerm);
  const dateRange = useFiltersStore((state) => state.expensesDateRange);
  const setDateRange = useFiltersStore((state) => state.setExpensesDateRange);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: expenses = [], isLoading, refetch: refetchExpenses } = useExpenses(dateRange);
  const { data: summary, refetch: refetchSummary } = useExpensesSummary(dateRange);
  const deleteExpense = useDeleteExpense();

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.categories?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchExpenses(), refetchSummary()]);
    setIsRefreshing(false);
  };

  return {
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    expenses,
    filteredExpenses,
    summary,
    deleteExpense,
    isLoading: isLoading || isRefreshing,
    handleRefresh,
  };
};
