import { createFileRoute, redirect } from "@tanstack/react-router";
import { MagicLinkLoginPage } from "@/pages/authenticated/auth/login/magic-link";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login/magic-link")({
  beforeLoad: async () => {
    // If user is already authenticated, redirect to dashboard
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: MagicLinkLoginPage,
});
