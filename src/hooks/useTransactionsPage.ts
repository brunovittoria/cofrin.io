import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";
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

export type TransactionType = "all" | "income" | "expense";

export interface Transaction {
  id: number;
  data: string;
  descricao?: string;
  valor: number;
  type: "income" | "expense";
  categorias?: {
    nome?: string;
    cor_hex?: string | null;
  } | null;
}

export const useTransactionsPage = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<TransactionType>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

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
      data: income.data,
      descricao: income.descricao,
      valor: income.valor,
      type: "income" as const,
      categorias: income.categorias,
    }));

    const expenseTransactions: Transaction[] = expenses.map((expense) => ({
      id: expense.id,
      data: expense.data,
      descricao: expense.descricao,
      valor: expense.valor,
      type: "expense" as const,
      categorias: expense.categorias,
    }));

    // Combine and sort by date (newest first)
    return [...incomeTransactions, ...expenseTransactions].sort((a, b) => {
      const dateA = new Date(a.data);
      const dateB = new Date(b.data);
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
        t.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.categorias?.nome?.toLowerCase().includes(searchTerm.toLowerCase());
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
