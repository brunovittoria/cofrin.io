import { createFileRoute } from "@tanstack/react-router";
import GoalDetailPage from "@/pages/authenticated/goals/[id]";

export const Route = createFileRoute("/_authenticated/goals/$id")({
  component: GoalDetailPage,
});
