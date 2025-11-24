import { Cartao } from "@/hooks/api/useCartoes";
import { cardProvidersMap } from "@/mocks/cardProviders";

const formatCurrency = (value: number) =>
  "R$ " + value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

const getProgress = (used: number, limit: number) => {
  if (!limit) return 0;
  return Math.min(Math.round((used / limit) * 100), 100);
};

type MyCardsSectionProps = {
  cartoes?: Cartao[];
};

export const MyCardsSection = ({ cartoes = [] }: MyCardsSectionProps) => {
  // Encontrar o cartão principal, ou usar o primeiro cartão se não houver principal
  const cartaoPrincipal =
    cartoes.find((cartao) => cartao.is_principal) || cartoes[0];

  if (!cartaoPrincipal) {
    return (
      <section className="surface-card flex h-full flex-col p-6 sm:p-7">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Meus Cartões
            </h2>
            <p className="text-sm text-[#6B7280]">
              Cartão principal em destaque
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold text-[#0A84FF]">
            Total {cartoes.length}
          </span>
        </header>

        <div className="mt-6 flex flex-1 flex-col items-center justify-center">
          <p className="text-gray-500 text-center">Nenhum cartão cadastrado</p>
        </div>
      </section>
    );
  }

  const progress = getProgress(
    cartaoPrincipal.valor_utilizado,
    cartaoPrincipal.limite_total
  );
  const provider = cartaoPrincipal.emissor
    ? cardProvidersMap[cartaoPrincipal.emissor]
    : undefined;
  const imageUrl = cartaoPrincipal.imagem_url ?? provider?.imageUrl;

  return (
    <section className="surface-card flex h-full flex-col p-6 sm:p-7">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-[#0F172A]">Meus Cartões</h2>
          <p className="text-sm text-[#6B7280]">Cartão principal em destaque</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold text-[#0A84FF]">
          Total {cartoes.length}
        </span>
      </header>

      <div className="mt-6 flex flex-1 flex-col gap-6">
        <div className="relative mx-auto w-full max-w-[420px] overflow-hidden rounded-[32px] shadow-[0px_24px_45px_-22px_rgba(79,70,229,0.35)]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={provider?.name ?? cartaoPrincipal.nome_exibicao}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[16/10] w-full items-center justify-center text-sm font-semibold uppercase tracking-[0.25em] text-[#94A3B8] bg-[#EEF2FF]">
              {cartaoPrincipal.nome_exibicao}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
          <div className="flex items-center justify-between text-sm text-[#6B7280]">
            <span>Uso do limite</span>
            <span className="font-semibold text-[#0F172A]">
              {formatCurrency(cartaoPrincipal.valor_utilizado)} /{" "}
              {formatCurrency(cartaoPrincipal.limite_total)}
            </span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-[#E5E7EB]">
            <div
              className="h-full rounded-full bg-[#0A84FF]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#6B7280]">
            <span>
              Disponível:{" "}
              {formatCurrency(
                cartaoPrincipal.limite_total - cartaoPrincipal.valor_utilizado
              )}
            </span>
            <span className="font-semibold text-[#0F172A]">{progress}%</span>
          </div>
        </div>
      </div>
    </section>
  );
};
