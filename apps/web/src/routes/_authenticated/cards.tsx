import { createFileRoute } from "@tanstack/react-router";
import CardsPage from "@/pages/authenticated/cards";

export const Route = createFileRoute("/_authenticated/cards")({
  component: CardsPage,
});
