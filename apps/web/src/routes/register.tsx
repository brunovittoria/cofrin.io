import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegisterPage } from "@/pages/authenticated/auth/register";

export const Route = createFileRoute("/register")({
  beforeLoad: async ({ context }) => {
    const { isSignedIn } = context as { isSignedIn: boolean };
    if (isSignedIn) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: RegisterPage,
});
