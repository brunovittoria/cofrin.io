import { createFileRoute } from "@tanstack/react-router";
import CreateGoalPage from "@/pages/authenticated/goals/create";

export const Route = createFileRoute("/_authenticated/goals/create")({
  component: CreateGoalPage,
});
