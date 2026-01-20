import {
  useCards,
  useDeleteCard,
  useSetPrimaryCard,
  useCreateCard,
  useUpdateCard,
  type NewCard,
  type Card,
} from "@/hooks/api/useCards";
import { useCardStore } from "@/stores";

export const useCardsPage = () => {
  const { data: cards, isLoading } = useCards();
  const deleteCard = useDeleteCard();
  const setPrimaryCard = useSetPrimaryCard();
  const createCard = useCreateCard();
  const updateCard = useUpdateCard();
  
  const {
    cardModalOpen: addModalOpen,
    cardEditModalOpen: editModalOpen,
    selectedCard,
    setCardModalOpen: setAddModalOpen,
    setCardEditModalOpen: setEditModalOpen,
    openCardEditModal,
    closeCardModals,
  } = useCardStore();

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
          closeCardModals();
        },
      }
    );
  };

  const handleOpenEditModal = (card: Card) => {
    openCardEditModal(card);
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
    openEditModal: handleOpenEditModal,
    handleDeleteCard,
    handleSetPrimary,
    isPendingDelete: deleteCard.isPending,
    isPendingSetPrimary: setPrimaryCard.isPending,
    isPendingCreate: createCard.isPending,
    isPendingUpdate: updateCard.isPending,
  };
};
