import { create } from "zustand";
import { DateRange } from "react-day-picker";
import type { GoalStatus } from "@/hooks/api/useGoals";

interface FiltersState {
  // Dashboard date range
  dashboardDateRange: DateRange | undefined;
  
  // Expenses page filters
  expensesDateRange: DateRange | undefined;
  expensesSearchTerm: string;
  
  // Incomes page filters
  incomesDateRange: DateRange | undefined;
  incomesSearchTerm: string;
  
  // Transactions page filters
  transactionsDateRange: DateRange | undefined;
  transactionsSearchTerm: string;
  transactionsActiveFilter: "all" | "income" | "expense";
  
  // Goals page filter
  goalsStatusFilter: GoalStatus | "all";
  
  // Future launches filters
  futureLaunchesDateRange: DateRange | undefined;
  futureLaunchesSearchTerm: string;
  
  // Actions
  setDashboardDateRange: (dateRange: DateRange | undefined) => void;
  setExpensesDateRange: (dateRange: DateRange | undefined) => void;
  setExpensesSearchTerm: (term: string) => void;
  setIncomesDateRange: (dateRange: DateRange | undefined) => void;
  setIncomesSearchTerm: (term: string) => void;
  setTransactionsDateRange: (dateRange: DateRange | undefined) => void;
  setTransactionsSearchTerm: (term: string) => void;
  setTransactionsActiveFilter: (filter: "all" | "income" | "expense") => void;
  setGoalsStatusFilter: (filter: GoalStatus | "all") => void;
  setFutureLaunchesDateRange: (dateRange: DateRange | undefined) => void;
  setFutureLaunchesSearchTerm: (term: string) => void;
  
  // Reset functions
  resetExpensesFilters: () => void;
  resetIncomesFilters: () => void;
  resetTransactionsFilters: () => void;
  resetFutureLaunchesFilters: () => void;
}

const getDefaultDashboardDateRange = (): DateRange => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { from: firstDay, to: lastDay };
};

export const useFiltersStore = create<FiltersState>((set) => ({
  dashboardDateRange: getDefaultDashboardDateRange(),
  expensesDateRange: undefined,
  expensesSearchTerm: "",
  incomesDateRange: undefined,
  incomesSearchTerm: "",
  transactionsDateRange: undefined,
  transactionsSearchTerm: "",
  transactionsActiveFilter: "all",
  goalsStatusFilter: "all",
  futureLaunchesDateRange: undefined,
  futureLaunchesSearchTerm: "",
  
  setDashboardDateRange: (dateRange) => set({ dashboardDateRange: dateRange }),
  setExpensesDateRange: (dateRange) => set({ expensesDateRange: dateRange }),
  setExpensesSearchTerm: (term) => set({ expensesSearchTerm: term }),
  setIncomesDateRange: (dateRange) => set({ incomesDateRange: dateRange }),
  setIncomesSearchTerm: (term) => set({ incomesSearchTerm: term }),
  setTransactionsDateRange: (dateRange) => set({ transactionsDateRange: dateRange }),
  setTransactionsSearchTerm: (term) => set({ transactionsSearchTerm: term }),
  setTransactionsActiveFilter: (filter) => set({ transactionsActiveFilter: filter }),
  setGoalsStatusFilter: (filter) => set({ goalsStatusFilter: filter }),
  setFutureLaunchesDateRange: (dateRange) => set({ futureLaunchesDateRange: dateRange }),
  setFutureLaunchesSearchTerm: (term) => set({ futureLaunchesSearchTerm: term }),
  
  resetExpensesFilters: () => set({ expensesDateRange: undefined, expensesSearchTerm: "" }),
  resetIncomesFilters: () => set({ incomesDateRange: undefined, incomesSearchTerm: "" }),
  resetTransactionsFilters: () => set({ 
    transactionsDateRange: undefined, 
    transactionsSearchTerm: "", 
    transactionsActiveFilter: "all" 
  }),
  resetFutureLaunchesFilters: () => set({
    futureLaunchesDateRange: undefined,
    futureLaunchesSearchTerm: "",
  }),
}));
