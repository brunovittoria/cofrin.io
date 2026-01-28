import { createFileRoute, redirect } from "@tanstack/react-router";
import { ResetPasswordPage } from "@/pages/authenticated/auth/reset-password";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  beforeLoad: async () => {
    // Check if there's a recovery token in the URL hash
    // This happens when user clicks the password reset link from email
    if (typeof window !== "undefined") {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get("type");
      
      // If there's a recovery token, allow access (Supabase will process it)
      if (type === "recovery") {
        return;
      }
    }
    
    // Check if there's a valid session (user clicked the reset link)
    // For password reset, Supabase creates a session when the user clicks the link
    const { data: { session } } = await supabase.auth.getSession();
    
    // If no session and no recovery token, redirect to login
    if (!session) {
      throw redirect({ to: "/login" });
    }
  },
  component: ResetPasswordPage,
});
