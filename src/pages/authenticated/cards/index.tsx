import { CardModal } from "@/components/dialogs/card-modal";
import { useCartoesPage } from "@/hooks/useCartoesPage";
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
    selectedCartao,
    handleCreateCartao,
    handleEditCartao,
    openEditModal,
    handleDeleteCartao,
    handleSetPrincipal,
    isPendingDelete,
    isPendingSetPrincipal,
    isPendingCreate,
    isPendingUpdate,
  } = useCartoesPage();

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
              onDelete={handleDeleteCartao}
              onSetPrincipal={handleSetPrincipal}
              isPendingDelete={isPendingDelete}
              isPendingSetPrincipal={isPendingSetPrincipal}
            />
          )}
        </section>
      </div>

      <CardModal
        mode="add"
        open={addModalOpen}
        setOpen={setAddModalOpen}
        onSave={handleCreateCartao}
        isSaving={isPendingCreate}
      />

      {selectedCartao && (
        <CardModal
          mode="edit"
          open={editModalOpen}
          setOpen={setEditModalOpen}
          cartao={{
            ...selectedCartao,
            id: String(selectedCartao.id),
          }}
          onSave={handleEditCartao}
          isSaving={isPendingUpdate}
        />
      )}
    </div>
  );
};

export default CardsPage;
