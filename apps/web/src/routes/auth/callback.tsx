import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback - Supabase automatically parses the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          navigate({ to: "/login" });
          return;
        }

        if (session?.user) {
          // Check if user exists in usuarios table, create if not
          const { data: existingUser, error: userError } = await supabase
            .from("usuarios")
            .select("id")
            .eq("auth_user_id", session.user.id)
            .single();

          if (userError && userError.code !== 'PGRST116') {
            // PGRST116 means no rows returned, which is expected for new users
            console.error("Error checking user:", userError);
          }

          if (!existingUser) {
            // Create user record in usuarios table
            const { error: insertError } = await supabase.from("usuarios").insert({
              auth_user_id: session.user.id,
            });

            if (insertError) {
              console.error("Error creating user record:", insertError);
              // Still redirect to dashboard - user is authenticated
            }
          }

          // Redirect to dashboard
          navigate({ to: "/dashboard" });
        } else {
          // No session found, redirect to login
          navigate({ to: "/login" });
        }
      } catch (error) {
        console.error("Error handling auth callback:", error);
        navigate({ to: "/login" });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-sm text-muted-foreground">Completando autenticação...</p>
      </div>
    </div>
  );
}
