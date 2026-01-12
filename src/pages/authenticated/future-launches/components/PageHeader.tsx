import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FutureLaunchModal } from "@/components/dialogs/launch-modal";
import { PageHeader as BasePageHeader } from "@/components/PageHeader";

interface PageHeaderProps {
  onRefresh: () => void;
}

export const PageHeader = ({ onRefresh }: PageHeaderProps) => {
  return (
    <BasePageHeader
      breadcrumb="Lançamentos Futuros"
      title="Lançamentos Futuros"
      description="Gerencie todos os lançamentos previstos com uma visão clara"
      showRefreshButton
      onRefresh={onRefresh}
    >
      <FutureLaunchModal
        trigger={
          <Button className="h-12 rounded-2xl bg-[#0A84FF] px-6 text-sm font-semibold text-white shadow-[0px_20px_32px_-18px_rgba(10,132,255,0.6)] transition-transform hover:-translate-y-0.5 hover:bg-[#006FDB]">
            <Plus className="h-4 w-4 mr-2" />
            Novo Lançamento
          </Button>
        }
      />
    </BasePageHeader>
  );
};
