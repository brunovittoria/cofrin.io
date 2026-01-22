import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@/pages/authenticated/auth/login";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    // If user is already authenticated, redirect to dashboard
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginPage,
});
