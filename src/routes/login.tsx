import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@/pages/authenticated/auth/login";

export const Route = createFileRoute("/login")({
  beforeLoad: async ({ context }) => {
    const { isSignedIn } = context as { isSignedIn: boolean };
    if (isSignedIn) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginPage,
});
