import { createFileRoute } from "@tanstack/react-router";
import Expenses from "@/pages/authenticated/expenses";

type ExpensesSearch = {
  categoria?: string;
};

export const Route = createFileRoute("/_authenticated/expenses")({
  validateSearch: (search: Record<string, unknown>): ExpensesSearch => {
    return {
      categoria: search.categoria as string | undefined,
    };
  },
  component: Expenses,
});
