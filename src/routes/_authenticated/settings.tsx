import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/pages/authenticated/settings";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});
