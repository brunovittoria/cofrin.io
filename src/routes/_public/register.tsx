import { createFileRoute } from "@tanstack/react-router";
import { RegisterPage } from "@/pages/authenticated/auth/register";

export const Route = createFileRoute("/_public/register")({
  component: RegisterPage,
});
