import { Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const EmptyState = () => {
  const navigate = useNavigate();

  const handleCreateClick = () => {
    navigate("/goals/create");
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-border bg-card py-16 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Target className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-foreground">
        Nenhuma meta encontrada
      </h3>
      <p className="mx-auto mb-6 max-w-sm text-muted-foreground">
        Comece definindo um objetivo pequeno. O importante é dar o primeiro passo.
      </p>
      <Button onClick={handleCreateClick}>Criar Minha Primeira Meta</Button>
    </div>
  );
};
