import { type Card } from "@/hooks/api/useCards";
import { CardItem } from "./CardItem";
import { EmptyCardSlot } from "./EmptyCardSlot";

interface CardsGridProps {
  cards: Card[];
  emptySlots: number;
  onEdit: (card: Card) => void;
  onDelete: (id: number) => void;
  onSetPrincipal: (id: number) => void;
  isPendingDelete: boolean;
  isPendingSetPrincipal: boolean;
}

export const CardsGrid = ({
  cards,
  emptySlots,
  onEdit,
  onDelete,
  onSetPrincipal,
  isPendingDelete,
  isPendingSetPrincipal,
}: CardsGridProps) => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
      {cards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetPrincipal={onSetPrincipal}
          isPendingDelete={isPendingDelete}
          isPendingSetPrincipal={isPendingSetPrincipal}
        />
      ))}

      {Array.from({ length: emptySlots }).map((_, index) => (
        <EmptyCardSlot key={`placeholder-${index}`} />
      ))}
    </div>
  );
};

