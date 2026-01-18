import { useState } from "react";
import {
  useCards,
  useDeleteCard,
  useSetPrimaryCard,
  useCreateCard,
  useUpdateCard,
  type NewCard,
  type Card,
} from "@/hooks/api/useCards";

export const useCardsPage = () => {
  const { data: cards, isLoading } = useCards();
  const deleteCard = useDeleteCard();
  const setPrimaryCard = useSetPrimaryCard();
  const createCard = useCreateCard();
  const updateCard = useUpdateCard();
  
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const cardsList = cards ?? [];
  const cardsToDisplay = cardsList.slice(0, 3);
  const emptySlots = Math.max(0, 3 - cardsToDisplay.length);

  const handleCreateCard = (data: NewCard) => {
    createCard.mutate(data, {
      onSuccess: () => {
        setAddModalOpen(false);
      },
    });
  };

  const handleEditCard = (data: NewCard) => {
    if (!selectedCard) return;
    updateCard.mutate(
      { ...data, id: selectedCard.id },
      {
        onSuccess: () => {
          setEditModalOpen(false);
          setSelectedCard(null);
        },
      }
    );
  };

  const openEditModal = (card: Card) => {
    setSelectedCard(card);
    setEditModalOpen(true);
  };

  const handleDeleteCard = (id: number) => {
    deleteCard.mutate(id);
  };

  const handleSetPrimary = (id: number) => {
    setPrimaryCard.mutate(id);
  };

  return {
    cards: cardsList,
    cardsToDisplay,
    emptySlots,
    isLoading,
    addModalOpen,
    setAddModalOpen,
    editModalOpen,
    setEditModalOpen,
    selectedCard,
    handleCreateCard,
    handleEditCard,
    openEditModal,
    handleDeleteCard,
    handleSetPrimary,
    isPendingDelete: deleteCard.isPending,
    isPendingSetPrimary: setPrimaryCard.isPending,
    isPendingCreate: createCard.isPending,
    isPendingUpdate: updateCard.isPending,
  };
};
