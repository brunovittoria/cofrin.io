import { createFileRoute } from "@tanstack/react-router";
import DashboardPage from "@/pages/authenticated/Index";

export const Route = createFileRoute("/_authenticated/")({
  component: DashboardPage,
});
