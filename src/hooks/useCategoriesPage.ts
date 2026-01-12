import { useState, useMemo } from "react";
import {
  useCategories,
  useDeleteCategory,
} from "@/hooks/api/useCategories";

export const useCategoriesPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPageIncome, setCurrentPageIncome] = useState(1);
  const [currentPageExpense, setCurrentPageExpense] = useState(1);
  const pageSize = 5;

  const { 
    data: incomeCategories = [], 
    isLoading: isLoadingIncome,
    refetch: refetchIncome 
  } = useCategories("entrada");
  
  const { 
    data: expenseCategories = [], 
    isLoading: isLoadingExpense,
    refetch: refetchExpense 
  } = useCategories("saida");
  
  const deleteCategory = useDeleteCategory();

  const totalPagesIncome = useMemo(() => {
    return Math.ceil(incomeCategories.length / pageSize);
  }, [incomeCategories.length, pageSize]);

  const paginatedIncomeCategories = useMemo(() => {
    const startIndex = (currentPageIncome - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return incomeCategories.slice(startIndex, endIndex);
  }, [incomeCategories, currentPageIncome, pageSize]);

  const totalPagesExpense = useMemo(() => {
    return Math.ceil(expenseCategories.length / pageSize);
  }, [expenseCategories.length, pageSize]);

  const paginatedExpenseCategories = useMemo(() => {
    const startIndex = (currentPageExpense - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return expenseCategories.slice(startIndex, endIndex);
  }, [expenseCategories, currentPageExpense, pageSize]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchIncome(), refetchExpense()]);
    setIsRefreshing(false);
  };

  return {
    incomeCategories,
    expenseCategories,
    paginatedIncomeCategories,
    paginatedExpenseCategories,
    deleteCategory,
    isLoading: isLoadingIncome || isLoadingExpense || isRefreshing,
    handleRefresh,
    currentPageIncome,
    setCurrentPageIncome,
    totalPagesIncome,
    currentPageExpense,
    setCurrentPageExpense,
    totalPagesExpense,
  };
};
