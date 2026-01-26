import { Star, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Card } from "@/hooks/api/useCards";
import { cardProvidersMap } from "@/mocks/cardProviders";
import { brandStyles, getStatusStyles } from "@/styles/cardStyles";

interface CardItemProps {
  card: Card;
  onEdit: (card: Card) => void;
  onDelete: (id: number) => void;
  onSetPrincipal: (id: number) => void;
  isPendingDelete: boolean;
  isPendingSetPrincipal: boolean;
}

export const CardItem = ({
  card,
  onEdit,
  onDelete,
  onSetPrincipal,
  isPendingDelete,
  isPendingSetPrincipal,
}: CardItemProps) => {
  const percentual =
    card.usage_percentage ??
    (card.total_limit > 0
      ? Number((card.used_amount / card.total_limit) * 100)
      : 0);
  const available =
    card.available_amount ?? card.total_limit - card.used_amount;
  const { label: statusLabel, className: statusClass } =
    getStatusStyles(percentual);
  const provider = card.issuer ? cardProvidersMap[card.issuer] : undefined;
  const imageUrl = card.imagem_url ?? provider?.imageUrl;

  return (
    <article className="flex h-full flex-col gap-5 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-[0px_28px_48px_-28px_rgba(15,23,42,0.16)]">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={provider?.name ?? card.display_name}
          className="object-cover w-[65%] h-[65%] mx-auto my-4"
        />
      ) : (
        <div className="flex aspect-[16/10] w-full items-center justify-center text-sm font-semibold uppercase tracking-[0.25em] text-[#94A3B8]">
          Imagem do cartao
        </div>
      )}

      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold",
                  brandStyles[card.flag as keyof typeof brandStyles]
                    ?.badge ?? "bg-[#E2E8F0] text-[#475569]"
                )}
              >
                {card.flag ?? "Sem bandeira"}
              </span>
              <span className="text-xs uppercase tracking-[0.3em] text-[#9CA3AF]">
                **** {card.card_last_four ?? "0000"}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-[#0F172A]">
              {card.display_name}
            </h2>
          </div>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              statusClass
            )}
          >
            {statusLabel}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
              Limite
            </p>
            <p className="mt-1 text-base font-semibold text-[#0F172A]">
              R${" "}
              {(card.total_limit ?? 0).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
              Utilizado
            </p>
            <p className="mt-1 text-base font-semibold text-[#0F172A]">
              R${" "}
              {(card.used_amount ?? 0).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
              Disponivel
            </p>
            <p className="mt-1 text-base font-semibold text-[#15803D]">
              R${" "}
              {available.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Uso do limite</span>
            <span
              className={
                percentual > 80
                  ? "font-semibold text-[#DC2626]"
                  : "font-semibold text-[#0F172A]"
              }
            >
              {percentual.toFixed(2)}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-[#E5E7EB] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#DC2626]"
              style={{
                width: `${Math.max(0, Math.min(percentual, 100))}%`,
              }}
              aria-hidden
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <Button
          size="sm"
          variant={card.is_primary ? "default" : "outline"}
          className="flex-1"
          onClick={() => onSetPrincipal(card.id)}
          disabled={isPendingSetPrincipal}
        >
          <Star
            className={`h-4 w-4 ${
              card.is_primary
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-500"
            }`}
          />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => onEdit(card)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="flex-1"
          onClick={() => onDelete(card.id)}
          disabled={isPendingDelete}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </article>
  );
};
