import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryModal } from "@/components/dialogs/category-modal";
import { PageHeader as BasePageHeader } from "@/components/PageHeader";

interface PageHeaderProps {
  onRefresh: () => void;
}

export const PageHeader = ({ onRefresh }: PageHeaderProps) => {
  return (
    <BasePageHeader
      breadcrumb="Categorias"
      title="Categorias financeiras"
      description="Organize entradas e saídas em grupos inteligentes para facilitar análises."
      showRefreshButton
      onRefresh={onRefresh}
    >
      <CategoryModal
        trigger={
          <Button className="h-12 rounded-2xl bg-[#0A84FF] px-6 text-sm font-semibold text-white shadow-[0px_20px_32px_-18px_rgba(10,132,255,0.6)] transition-transform hover:-translate-y-0.5 hover:bg-[#006FDB]">
            <Plus className="h-4 w-4" /> Nova Categoria
          </Button>
        }
      />
    </BasePageHeader>
  );
};
