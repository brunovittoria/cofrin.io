import { Plus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  onRefresh: () => void;
  isLoading?: boolean;
}

export const PageHeader = ({ onRefresh, isLoading }: PageHeaderProps) => {
  const navigate = useNavigate();

  const handleCreateClick = () => {
    navigate("/goals/create");
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Suas Metas Financeiras
        </h1>
        <p className="mt-1 text-muted-foreground">
          Transforme seus sonhos em realidade com planejamento consciente.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={isLoading}
          className="h-10 w-10"
          aria-label="Atualizar metas"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
        <Button onClick={handleCreateClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Meta
        </Button>
      </div>
    </div>
  );
};
