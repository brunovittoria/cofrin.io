import { createFileRoute, redirect } from "@tanstack/react-router";
import LandingPage from "@/pages/landing";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    const { isSignedIn } = context as { isSignedIn: boolean };
    // If user is signed in, redirect to dashboard (which is under authenticated layout)
    if (isSignedIn) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LandingPage,
});
