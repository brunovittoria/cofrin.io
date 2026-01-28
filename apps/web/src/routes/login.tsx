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
  const isForgotPasswordRoute = location.pathname === "/login/forgot-password";
  
  // If we're on a child route, render the outlet
  // Otherwise, render the LoginPage
  if (isMagicLinkRoute || isForgotPasswordRoute) {
    return <Outlet />;
  }
  
  return <LoginPage />;
}
