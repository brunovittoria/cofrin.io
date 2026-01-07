import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";
import {
  useEntradas,
  useEntradasSummary,
  useDeleteEntrada,
} from "@/hooks/api/useEntradas";
import {
  useSaidas,
  useSaidasSummary,
  useDeleteSaida,
} from "@/hooks/api/useSaidas";

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

  // Fetch entradas (income)
  const {
    data: entradas = [],
    isLoading: isLoadingEntradas,
    refetch: refetchEntradas,
  } = useEntradas(dateRange);
  const { data: entradasSummary, refetch: refetchEntradasSummary } =
    useEntradasSummary(dateRange);
  const deleteEntrada = useDeleteEntrada();

  // Fetch saidas (expenses)
  const {
    data: saidas = [],
    isLoading: isLoadingSaidas,
    refetch: refetchSaidas,
  } = useSaidas(dateRange);
  const { data: saidasSummary, refetch: refetchSaidasSummary } =
    useSaidasSummary(dateRange);
  const deleteSaida = useDeleteSaida();

  // Combine and transform data into unified transactions
  const transactions: Transaction[] = useMemo(() => {
    const incomeTransactions: Transaction[] = entradas.map((entrada) => ({
      id: entrada.id,
      data: entrada.data,
      descricao: entrada.descricao,
      valor: entrada.valor,
      type: "income" as const,
      categorias: entrada.categorias,
    }));

    const expenseTransactions: Transaction[] = saidas.map((saida) => ({
      id: saida.id,
      data: saida.data,
      descricao: saida.descricao,
      valor: saida.valor,
      type: "expense" as const,
      categorias: saida.categorias,
    }));

    // Combine and sort by date (newest first)
    return [...incomeTransactions, ...expenseTransactions].sort((a, b) => {
      const dateA = new Date(a.data);
      const dateB = new Date(b.data);
      return dateB.getTime() - dateA.getTime();
    });
  }, [entradas, saidas]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalIncome = entradasSummary?.total || 0;
    const totalExpenses = saidasSummary?.total || 0;
    const balance = totalIncome - totalExpenses;
    const incomeCount = entradasSummary?.count || 0;
    const expenseCount = saidasSummary?.count || 0;

    return {
      totalIncome,
      totalExpenses,
      balance,
      incomeCount,
      expenseCount,
    };
  }, [entradasSummary, saidasSummary]);

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
      refetchEntradas(),
      refetchSaidas(),
      refetchEntradasSummary(),
      refetchSaidasSummary(),
    ]);
    setIsRefreshing(false);
  };

  const handleDelete = (id: number, type: "income" | "expense") => {
    if (type === "income") {
      deleteEntrada.mutate(id);
    } else {
      deleteSaida.mutate(id);
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
    deleteEntrada,
    deleteSaida,
    isLoading: isLoadingEntradas || isLoadingSaidas || isRefreshing,
    handleRefresh,
    currentPage,
    setCurrentPage,
    totalPages,
  };
};