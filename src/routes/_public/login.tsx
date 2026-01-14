import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/pages/authenticated/auth/login";

export const Route = createFileRoute("/_public/login")({
  component: LoginPage,
});
