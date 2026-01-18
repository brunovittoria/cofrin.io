import { useState } from "react";
import { DateRange } from "react-day-picker";
import {
  useExpenses,
  useExpensesSummary,
  useDeleteExpense,
} from "@/hooks/api/useExpenses";

export const useExpensesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: expenses = [], isLoading, refetch: refetchExpenses } = useExpenses(dateRange);
  const { data: summary, refetch: refetchSummary } = useExpensesSummary(dateRange);
  const deleteExpense = useDeleteExpense();

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.categorias?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
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
