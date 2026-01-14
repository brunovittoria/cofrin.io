import { createFileRoute } from "@tanstack/react-router";
import GoalsPage from "@/pages/authenticated/goals";

export const Route = createFileRoute("/_authenticated/goals/")({
  component: GoalsPage,
});
