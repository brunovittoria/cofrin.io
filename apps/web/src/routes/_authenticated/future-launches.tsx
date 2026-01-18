import { createFileRoute } from "@tanstack/react-router";
import FutureLaunches from "@/pages/authenticated/future-launches";

export const Route = createFileRoute("/_authenticated/future-launches")({
  component: FutureLaunches,
});
