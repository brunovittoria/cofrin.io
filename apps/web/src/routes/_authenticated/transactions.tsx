import { createFileRoute } from "@tanstack/react-router";
import Transactions from "@/pages/authenticated/transactions";

type TransactionsSearch = {
  categoria?: string;
};

export const Route = createFileRoute("/_authenticated/transactions")({
  validateSearch: (search: Record<string, unknown>): TransactionsSearch => {
    return {
      categoria: search.categoria as string | undefined,
    };
  },
  component: Transactions,
});
