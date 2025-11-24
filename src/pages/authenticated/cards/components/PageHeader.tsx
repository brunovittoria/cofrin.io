import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  totalCards: number;
  onAddClick: () => void;
}

export const PageHeader = ({ totalCards, onAddClick }: PageHeaderProps) => {
  return (
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
          Total {totalCards} cartoes
        </span>
        <Button
          className="h-11 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#0A64F5] px-5 text-sm font-semibold text-white shadow-[0px_20px_36px_-18px_rgba(10,100,245,0.55)] transition-transform hover:-translate-y-0.5"
          onClick={onAddClick}
        >
          + ADICIONAR
        </Button>
      </div>
    </header>
  );
};

