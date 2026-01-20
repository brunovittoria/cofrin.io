import { create } from "zustand";
import type { Card } from "@/hooks/api/useCards";

interface CardState {
  // Card modal states
  cardModalOpen: boolean;
  cardEditModalOpen: boolean;
  selectedCard: Card | null;
  
  // Actions
  setCardModalOpen: (open: boolean) => void;
  setCardEditModalOpen: (open: boolean) => void;
  setSelectedCard: (card: Card | null) => void;
  openCardEditModal: (card: Card) => void;
  closeCardModals: () => void;
}

export const useCardStore = create<CardState>((set) => ({
  cardModalOpen: false,
  cardEditModalOpen: false,
  selectedCard: null,
  
  setCardModalOpen: (open) => set({ cardModalOpen: open }),
  setCardEditModalOpen: (open) => set({ cardEditModalOpen: open }),
  setSelectedCard: (card) => set({ selectedCard: card }),
  openCardEditModal: (card) => set({ selectedCard: card, cardEditModalOpen: true }),
  closeCardModals: () => set({ cardModalOpen: false, cardEditModalOpen: false, selectedCard: null }),
}));
