import { useNavigate } from "@tanstack/react-router";
import { GoalCard } from "./GoalCard";
import { Goal } from "@/hooks/api/useGoals";

interface GoalsGridProps {
  goals: (Goal & {
    categories?: { name: string; hex_color?: string } | null;
    cards?: { display_name: string; issuer?: string } | null;
  })[];
}

export const GoalsGrid = ({ goals }: GoalsGridProps) => {
  const navigate = useNavigate();

  const handleGoalClick = (id: string) => {
    navigate({ to: "/goals/$id", params: { id } });
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} onClick={handleGoalClick} />
      ))}
    </div>
  );
};
