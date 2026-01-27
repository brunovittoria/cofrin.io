import { createFileRoute, redirect, Outlet, useLocation } from "@tanstack/react-router";
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
  component: LoginLayout,
});

function LoginLayout() {
  const location = useLocation();
  const isMagicLinkRoute = location.pathname === "/login/magic-link";
  
  // If we're on the magic link route, render the outlet (child route)
  // Otherwise, render the LoginPage
  if (isMagicLinkRoute) {
    return <Outlet />;
  }
  
  return <LoginPage />;
}
