import { CardModal } from "@/components/dialogs/card-modal";
import { useCardsPage } from "@/hooks/useCardsPage";
import { PageHeader } from "./components/PageHeader";
import { CardsGrid } from "./components/CardsGrid";
import { LoadingSkeleton } from "./components/LoadingSkeleton";

const CardsPage = () => {
  const {
    cards,
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
    isPendingDelete,
    isPendingSetPrimary,
    isPendingCreate,
    isPendingUpdate,
  } = useCardsPage();

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-colors sm:p-8">
          <PageHeader
            totalCards={cards.length}
            onAddClick={() => setAddModalOpen(true)}
          />

          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <CardsGrid
              cards={cardsToDisplay}
              emptySlots={emptySlots}
              onEdit={openEditModal}
              onDelete={handleDeleteCard}
              onSetPrincipal={handleSetPrimary}
              isPendingDelete={isPendingDelete}
              isPendingSetPrimary={isPendingSetPrimary}
            />
          )}
        </section>
      </div>

      <CardModal
        mode="add"
        open={addModalOpen}
        setOpen={setAddModalOpen}
        onSave={handleCreateCard}
        isSaving={isPendingCreate}
      />

      {selectedCard && (
        <CardModal
          mode="edit"
          open={editModalOpen}
          setOpen={setEditModalOpen}
          card={{
            ...selectedCard,
            id: String(selectedCard.id),
          }}
          onSave={handleEditCard}
          isSaving={isPendingUpdate}
        />
      )}
    </div>
  );
};

export default CardsPage;
