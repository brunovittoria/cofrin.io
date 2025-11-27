import { Button } from "@/components/ui/button";
import { PageHeader as BasePageHeader } from "@/components/PageHeader";

interface PageHeaderProps {
  totalCards: number;
  onAddClick: () => void;
}

export const PageHeader = ({ totalCards, onAddClick }: PageHeaderProps) => {
  return (
    <BasePageHeader
      breadcrumb="Cartoes"
      title="Gestao de Cartoes"
      description="Visualize os principais cartoes e deixe pronto o espaco para inserir as imagens oficiais."
      badge={
        <span className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0A84FF] shadow-[0px_12px_28px_-16px_rgba(10,132,255,0.45)]">
          Total {totalCards} cartoes
        </span>
      }
    >
      <Button
        className="h-11 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#0A64F5] px-5 text-sm font-semibold text-white shadow-[0px_20px_36px_-18px_rgba(10,100,245,0.55)] transition-transform hover:-translate-y-0.5"
        onClick={onAddClick}
      >
        + ADICIONAR
      </Button>
    </BasePageHeader>
  );
};
