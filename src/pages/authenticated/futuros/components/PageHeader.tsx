import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LancamentoFuturoModal } from "@/components/dialogs/launch-modal";
import { RefreshButton } from "@/components/RefreshButton";

interface PageHeaderProps {
  onRefresh: () => void;
}

export const PageHeader = ({ onRefresh }: PageHeaderProps) => {
  return (
    <header className="flex flex-col gap-6 border-b border-[#E5E7EB] pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#94A3B8]">
          Lançamentos Futuros
        </p>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-[#0F172A]">
            Lançamentos Futuros
          </h1>
          <p className="text-sm text-[#4B5563]">
            Gerencie todos os lançamentos previstos com uma visão clara
          </p>
        </div>
      </div>
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <RefreshButton onRefresh={onRefresh} />
        <LancamentoFuturoModal
          trigger={
            <Button className="h-12 rounded-2xl bg-[#0A84FF] px-6 text-sm font-semibold text-white shadow-[0px_20px_32px_-18px_rgba(10,132,255,0.6)] transition-transform hover:-translate-y-0.5 hover:bg-[#006FDB]">
              <Plus className="h-4 w-4 mr-2" />
              Novo Lançamento
            </Button>
          }
        />
      </div>
    </header>
  );
};

