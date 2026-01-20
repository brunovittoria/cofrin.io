import { create } from "zustand";

interface ModalState {
  // General modal states (for modals that don't have their own store)
  categoryModalOpen: boolean;
  expenseModalOpen: boolean;
  incomeModalOpen: boolean;
  launchModalOpen: boolean;
  goalModalOpen: boolean;
  
  // Actions
  setCategoryModalOpen: (open: boolean) => void;
  setExpenseModalOpen: (open: boolean) => void;
  setIncomeModalOpen: (open: boolean) => void;
  setLaunchModalOpen: (open: boolean) => void;
  setGoalModalOpen: (open: boolean) => void;
  
  // Utility
  closeAllModals: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  categoryModalOpen: false,
  expenseModalOpen: false,
  incomeModalOpen: false,
  launchModalOpen: false,
  goalModalOpen: false,
  
  setCategoryModalOpen: (open) => set({ categoryModalOpen: open }),
  setExpenseModalOpen: (open) => set({ expenseModalOpen: open }),
  setIncomeModalOpen: (open) => set({ incomeModalOpen: open }),
  setLaunchModalOpen: (open) => set({ launchModalOpen: open }),
  setGoalModalOpen: (open) => set({ goalModalOpen: open }),
  
  closeAllModals: () => set({
    categoryModalOpen: false,
    expenseModalOpen: false,
    incomeModalOpen: false,
    launchModalOpen: false,
    goalModalOpen: false,
  }),
}));
