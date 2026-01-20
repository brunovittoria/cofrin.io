import { create } from "zustand";

interface PaginationState {
  // Categories page pagination
  categoriesIncomePage: number;
  categoriesExpensePage: number;
  categoriesPageSize: number;
  
  // Goals page pagination
  goalsPage: number;
  goalsPageSize: number;
  
  // Transactions page pagination
  transactionsPage: number;
  transactionsPageSize: number;
  
  // Future launches page pagination
  futureLaunchesPendingPage: number;
  futureLaunchesCompletedPage: number;
  futureLaunchesPageSize: number;
  
  // Actions - Categories
  setCategoriesIncomePage: (page: number) => void;
  setCategoriesExpensePage: (page: number) => void;
  resetCategoriesPagination: () => void;
  
  // Actions - Goals
  setGoalsPage: (page: number) => void;
  resetGoalsPagination: () => void;
  
  // Actions - Transactions
  setTransactionsPage: (page: number) => void;
  resetTransactionsPagination: () => void;
  
  // Actions - Future Launches
  setFutureLaunchesPendingPage: (page: number) => void;
  setFutureLaunchesCompletedPage: (page: number) => void;
  resetFutureLaunchesPagination: () => void;
}

export const usePaginationStore = create<PaginationState>((set) => ({
  // Categories
  categoriesIncomePage: 1,
  categoriesExpensePage: 1,
  categoriesPageSize: 5,
  
  // Goals
  goalsPage: 1,
  goalsPageSize: 6,
  
  // Transactions
  transactionsPage: 1,
  transactionsPageSize: 5,
  
  // Future Launches
  futureLaunchesPendingPage: 1,
  futureLaunchesCompletedPage: 1,
  futureLaunchesPageSize: 5,
  
  // Actions - Categories
  setCategoriesIncomePage: (page) => set({ categoriesIncomePage: page }),
  setCategoriesExpensePage: (page) => set({ categoriesExpensePage: page }),
  resetCategoriesPagination: () => set({ categoriesIncomePage: 1, categoriesExpensePage: 1 }),
  
  // Actions - Goals
  setGoalsPage: (page) => set({ goalsPage: page }),
  resetGoalsPagination: () => set({ goalsPage: 1 }),
  
  // Actions - Transactions
  setTransactionsPage: (page) => set({ transactionsPage: page }),
  resetTransactionsPagination: () => set({ transactionsPage: 1 }),
  
  // Actions - Future Launches
  setFutureLaunchesPendingPage: (page) => set({ futureLaunchesPendingPage: page }),
  setFutureLaunchesCompletedPage: (page) => set({ futureLaunchesCompletedPage: page }),
  resetFutureLaunchesPagination: () => set({ futureLaunchesPendingPage: 1, futureLaunchesCompletedPage: 1 }),
}));
