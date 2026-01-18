import { Card } from "@/hooks/api/useCards";
import { cardProvidersMap } from "@/mocks/cardProviders";

const formatCurrency = (value: number) =>
  "R$ " + value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

const getProgress = (used: number, limit: number) => {
  if (!limit) return 0;
  return Math.min(Math.round((used / limit) * 100), 100);
};

type MyCardsSectionProps = {
  cards?: Card[];
};

export const MyCardsSection = ({ cards = [] }: MyCardsSectionProps) => {
  // Find primary card, or use the first card if none is primary
  const primaryCard =
    cards.find((card) => card.is_principal) || cards[0];

  if (!primaryCard) {
    return (
      <section className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-sm transition-colors sm:p-7">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">
              Meus Cartões
            </h2>
            <p className="text-sm text-muted-foreground">
              Cartão principal em destaque
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-info/10 px-3 py-1 text-xs font-semibold text-info dark:bg-info/20">
            Total {cards.length}
          </span>
        </header>

        <div className="mt-6 flex flex-1 flex-col items-center justify-center">
          <p className="text-center text-muted-foreground">Nenhum cartão cadastrado</p>
        </div>
      </section>
    );
  }

  const progress = getProgress(
    primaryCard.valor_utilizado,
    primaryCard.limite_total
  );
  const provider = primaryCard.emissor
    ? cardProvidersMap[primaryCard.emissor]
    : undefined;
  const imageUrl = primaryCard.imagem_url ?? provider?.imageUrl;

  return (
    <section className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-sm transition-colors sm:p-7">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">Meus Cartões</h2>
          <p className="text-sm text-muted-foreground">Cartão principal em destaque</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-info/10 px-3 py-1 text-xs font-semibold text-info dark:bg-info/20">
          Total {cards.length}
        </span>
      </header>

      <div className="mt-6 flex flex-1 flex-col gap-6">
        <div className="relative mx-auto w-full max-w-[420px] overflow-hidden rounded-[32px] shadow-[0px_24px_45px_-22px_rgba(79,70,229,0.35)]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={provider?.name ?? primaryCard.nome_exibicao}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[16/10] w-full items-center justify-center bg-info/10 text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              {primaryCard.nome_exibicao}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-muted/50 p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Uso do limite</span>
            <span className="font-semibold text-foreground">
              {formatCurrency(primaryCard.valor_utilizado)} /{" "}
              {formatCurrency(primaryCard.limite_total)}
            </span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-border">
            <div
              className="h-full rounded-full bg-info"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Disponível:{" "}
              {formatCurrency(
                primaryCard.limite_total - primaryCard.valor_utilizado
              )}
            </span>
            <span className="font-semibold text-foreground">{progress}%</span>
          </div>
        </div>
      </div>
    </section>
  );
};
