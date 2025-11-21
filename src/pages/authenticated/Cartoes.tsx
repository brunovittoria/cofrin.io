import { PlusCircle, Trash, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useCartoes,
  useDeleteCartao,
  useSetCartaoPrincipal,
  useCreateCartao,
  type NovoCartao,
} from "@/hooks/api/useCartoes";
import { CardModal } from "@/components/dialogs/card-modal";
import { cardProvidersMap } from "@/data/cardProviders";
import { useState } from "react";

const brandStyles = {
  Visa: {
    badge: "bg-[#0A84FF]/10 text-[#0A84FF]",
  },
  Mastercard: {
    badge: "bg-[#F97316]/10 text-[#EA580C]",
  },
  Elo: {
    badge: "bg-[#6366F1]/10 text-[#4F46E5]",
  },
  "American Express": {
    badge: "bg-[#2DD4BF]/10 text-[#0D9488]",
  },
  Hipercard: {
    badge: "bg-[#FCA5A5]/10 text-[#DC2626]",
  },
} as const;

const getStatusStyles = (percentual: number) => {
  if (percentual >= 95) {
    return {
      label: "Proximo do limite",
      className: "bg-[#FEF2F2] text-[#DC2626]",
    };
  }
  if (percentual >= 70) {
    return {
      label: "Uso intenso",
      className: "bg-[#FFF7ED] text-[#EA580C]",
    };
  }
  return {
    label: "Ativo",
    className: "bg-[#F5F3FF] text-[#7C3AED]",
  };
};

const Cartoes = () => {
  const { data: cartoes, isLoading } = useCartoes();
  const deleteCartao = useDeleteCartao();
  const setCartaoPrincipal = useSetCartaoPrincipal();
  const createCartao = useCreateCartao();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const cards = cartoes ?? [];
  const cardsToDisplay = cards.slice(0, 3);
  const emptySlots = Math.max(0, 3 - cardsToDisplay.length);

  const handleCreateCartao = (data: NovoCartao) => {
    createCartao.mutate(data, {
      onSuccess: () => {
        setAddModalOpen(false);
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
        <section className="muted-card p-6 sm:p-8">
          <header className="flex flex-col gap-4 border-b border-[#E5E7EB] pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#94A3B8]">
                Cartoes
              </p>
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold text-[#0F172A]">
                  Gestao de Cartoes
                </h1>
                <p className="text-sm text-[#4B5563]">
                  Visualize os principais cartoes e deixe pronto o espaco para
                  inserir as imagens oficiais.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <span className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0A84FF] shadow-[0px_12px_28px_-16px_rgba(10,132,255,0.45)]">
                Total {cards.length} cartoes
              </span>
              <Button
                className="h-11 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#0A64F5] px-5 text-sm font-semibold text-white shadow-[0px_20px_36px_-18px_rgba(10,100,245,0.55)] transition-transform hover:-translate-y-0.5"
                onClick={() => setAddModalOpen(true)}
              >
                + ADICIONAR
              </Button>
            </div>
          </header>

          {isLoading ? (
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="h-72 rounded-3xl border border-[#E5E7EB] bg-white shadow-[0px_28px_48px_-28px_rgba(15,23,42,0.12)]"
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {cardsToDisplay.map((card) => {
                const percentual =
                  card.uso_percentual ??
                  (card.limite_total > 0
                    ? Number((card.valor_utilizado / card.limite_total) * 100)
                    : 0);
                const available =
                  card.valor_disponivel ??
                  card.limite_total - card.valor_utilizado;
                const { label: statusLabel, className: statusClass } =
                  getStatusStyles(percentual);
                const provider = card.emissor
                  ? cardProvidersMap[card.emissor]
                  : undefined;
                const imageUrl = card.imagem_url ?? provider?.imageUrl;

                return (
                  <article
                    key={card.id}
                    className="flex h-full flex-col gap-5 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-[0px_28px_48px_-28px_rgba(15,23,42,0.16)]"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={provider?.name ?? card.nome_exibicao}
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
                                brandStyles[
                                  card.bandeira as keyof typeof brandStyles
                                ]?.badge ?? "bg-[#E2E8F0] text-[#475569]"
                              )}
                            >
                              {card.bandeira ?? "Sem bandeira"}
                            </span>
                            <span className="text-xs uppercase tracking-[0.3em] text-[#9CA3AF]">
                              **** {card.final_cartao ?? "0000"}
                            </span>
                          </div>
                          <h2 className="text-lg font-semibold text-[#0F172A]">
                            {card.nome_exibicao}
                          </h2>
                          {/* Removido Banco e Alias */}
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
                            {card.limite_total.toLocaleString("pt-BR", {
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
                            {card.valor_utilizado.toLocaleString("pt-BR", {
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
                              width: `${Math.max(
                                0,
                                Math.min(percentual, 100)
                              )}%`,
                            }}
                            aria-hidden
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant={card.is_principal ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setCartaoPrincipal.mutate(card.id)}
                        disabled={setCartaoPrincipal.isPending}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            card.is_principal
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-500"
                          }`}
                        />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        onClick={() => deleteCartao.mutate(card.id)}
                        disabled={deleteCartao.isPending}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </article>
                );
              })}

              {Array.from({ length: emptySlots }).map((_, index) => (
                <article
                  key={`placeholder-${index}`}
                  className="flex h-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-[#C7D2FE] bg-white p-6 text-center text-sm text-[#6B7280] shadow-[0px_20px_36px_-30px_rgba(10,100,245,0.35)]"
                >
                  <div className="flex aspect-[16/10] w-full items-center justify-center rounded-[28px] border border-dashed border-[#C7D2FE]/70 bg-[#EEF2FF]/40 text-xs font-semibold uppercase tracking-[0.3em] text-[#6B7280]">
                    Espaco reservado
                  </div>
                  <p>Adicione um novo cartao para ocupar este espaco.</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
      <CardModal
        mode="add"
        open={addModalOpen}
        setOpen={setAddModalOpen}
        onSave={handleCreateCartao}
        isSaving={createCartao.isPending}
      />
    </div>
  );
};

export default Cartoes;
