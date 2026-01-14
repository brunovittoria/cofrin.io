import { createFileRoute } from "@tanstack/react-router";
import Incomes from "@/pages/authenticated/incomes";

type IncomesSearch = {
  categoria?: string;
};

export const Route = createFileRoute("/_authenticated/incomes")({
  validateSearch: (search: Record<string, unknown>): IncomesSearch => {
    return {
      categoria: search.categoria as string | undefined,
    };
  },
  component: Incomes,
});
