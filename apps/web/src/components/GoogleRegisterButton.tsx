"use client";

import { Button } from "@/components/ui/button";
import type { FC } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface GoogleButtonProps {
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const GoogleRegisterButton: FC<GoogleButtonProps> = ({
  className = "",
  disabled = false,
  children = "Registrar com o Google",
}) => {
  const handleGoogleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Google OAuth error:", error);
        if (error.message?.includes("not enabled") || error.message?.includes("provider")) {
          toast.error("Google OAuth não está habilitado. Verifique as configurações do Supabase.");
        } else {
          toast.error(`Erro ao registrar com Google: ${error.message || "Erro desconhecido"}`);
        }
      }
    } catch (error: any) {
      console.error("Google OAuth exception:", error);
      toast.error(`Erro ao registrar com Google: ${error?.message || "Erro desconhecido"}`);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleSignUp}
      disabled={disabled}
      className={`flex w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 transition duration-200 hover:bg-muted disabled:cursor-not-allowed disabled:bg-muted/50 ${className}`}
      tabIndex={0}
      aria-label="Registrar com Google"
    >
      <img src="/assets/google-icon.svg" alt="Google" width={20} height={20} className="h-5 w-5" />
      <span>{children || "Google"}</span>
    </Button>
  );
};
