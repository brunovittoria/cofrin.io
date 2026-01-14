import { createFileRoute } from "@tanstack/react-router";
import Categories from "@/pages/authenticated/categories";

export const Route = createFileRoute("/_authenticated/categories")({
  component: Categories,
});
