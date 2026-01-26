import { useState, useMemo } from "react";
import {
  useIncomes,
  useIncomesSummary,
  useDeleteIncome,
} from "@/hooks/api/useIncomes";
import {
  useExpenses,
  useExpensesSummary,
  useDeleteExpense,
} from "@/hooks/api/useExpenses";
import { useFiltersStore, usePaginationStore } from "@/stores/ui-store";

export type TransactionType = "all" | "income" | "expense";

export interface Transaction {
  id: number;
  date: string;
  description?: string;
  amount: number;
  type: "income" | "expense";
  categories?: {
    name?: string;
    hex_color?: string | null;
  } | null;
}

export const useTransactionsPage = () => {
  const dateRange = useFiltersStore((state) => state.transactionsDateRange);
  const setDateRange = useFiltersStore((state) => state.setTransactionsDateRange);
  const searchTerm = useFiltersStore((state) => state.transactionsSearchTerm);
  const setSearchTerm = useFiltersStore((state) => state.setTransactionsSearchTerm);
  const activeFilter = useFiltersStore((state) => state.transactionsActiveFilter);
  const setActiveFilter = useFiltersStore((state) => state.setTransactionsActiveFilter);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const currentPage = usePaginationStore((state) => state.transactionsPage);
  const setCurrentPage = usePaginationStore((state) => state.setTransactionsPage);
  const pageSize = usePaginationStore((state) => state.transactionsPageSize);

  // Fetch incomes
  const {
    data: incomes = [],
    isLoading: isLoadingIncomes,
    refetch: refetchIncomes,
  } = useIncomes(dateRange);
  const { data: incomesSummary, refetch: refetchIncomesSummary } =
    useIncomesSummary(dateRange);
  const deleteIncome = useDeleteIncome();

  // Fetch expenses
  const {
    data: expenses = [],
    isLoading: isLoadingExpenses,
    refetch: refetchExpenses,
  } = useExpenses(dateRange);
  const { data: expensesSummary, refetch: refetchExpensesSummary } =
    useExpensesSummary(dateRange);
  const deleteExpense = useDeleteExpense();

  // Combine and transform data into unified transactions
  const transactions: Transaction[] = useMemo(() => {
    const incomeTransactions: Transaction[] = incomes.map((income) => ({
      id: income.id,
      date: income.date,
      description: income.description,
      amount: income.amount,
      type: "income" as const,
      categories: income.categories,
    }));

    const expenseTransactions: Transaction[] = expenses.map((expense) => ({
      id: expense.id,
      date: expense.date,
      description: expense.description,
      amount: expense.amount,
      type: "expense" as const,
      categories: expense.categories,
    }));

    // Combine and sort by date (newest first)
    return [...incomeTransactions, ...expenseTransactions].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }, [incomes, expenses]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalIncome = incomesSummary?.total || 0;
    const totalExpenses = expensesSummary?.total || 0;
    const balance = totalIncome - totalExpenses;
    const incomeCount = incomesSummary?.count || 0;
    const expenseCount = expensesSummary?.count || 0;

    return {
      totalIncome,
      totalExpenses,
      balance,
      incomeCount,
      expenseCount,
    };
  }, [incomesSummary, expensesSummary]);

  // Filter transactions based on search and type
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.categories?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        activeFilter === "all" ? true : t.type === activeFilter;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, activeFilter]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredTransactions.length / pageSize);
  }, [filteredTransactions.length, pageSize]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage, pageSize]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      refetchIncomes(),
      refetchExpenses(),
      refetchIncomesSummary(),
      refetchExpensesSummary(),
    ]);
    setIsRefreshing(false);
  };

  const handleDelete = (id: number, type: "income" | "expense") => {
    if (type === "income") {
      deleteIncome.mutate(id);
    } else {
      deleteExpense.mutate(id);
    }
  };

  return {
    dateRange,
    setDateRange,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    transactions,
    filteredTransactions,
    paginatedTransactions,
    metrics,
    handleDelete,
    deleteIncome,
    deleteExpense,
    isLoading: isLoadingIncomes || isLoadingExpenses || isRefreshing,
    handleRefresh,
    currentPage,
    setCurrentPage,
    totalPages,
  };
};
