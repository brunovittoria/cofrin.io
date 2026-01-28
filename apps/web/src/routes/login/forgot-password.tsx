import { createFileRoute, redirect } from "@tanstack/react-router";
import { ForgotPasswordPage } from "@/pages/authenticated/auth/forgot-password";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login/forgot-password")({
  beforeLoad: async () => {
    // If user is already authenticated, redirect to dashboard
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: ForgotPasswordPage,
});
