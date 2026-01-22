import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { QueryProvider } from "./providers/QueryProvider";
import { router } from "./router";
import "./fonts.css";
import "./index.css";

function InnerApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <RouterProvider
      router={router}
      context={{ isSignedIn: !!user }}
    />
  );
}

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <QueryProvider>
      <InnerApp />
    </QueryProvider>
  </AuthProvider>
);
