import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RefreshButtonProps {
  onRefresh: () => void;
  isLoading?: boolean;
}

export const RefreshButton = ({ onRefresh, isLoading }: RefreshButtonProps) => {
  return (
    <Button
      variant="outline"
      className="h-12 rounded-2xl border-border bg-card px-6 text-sm font-semibold text-foreground shadow-[0px_20px_32px_-24px_rgba(15,23,42,0.16)] transition-transform hover:-translate-y-0.5 hover:bg-accent"
      onClick={onRefresh}
      disabled={isLoading}
    >
      <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
      {isLoading ? "Atualizando..." : "Atualizar"}
    </Button>
  );
};
