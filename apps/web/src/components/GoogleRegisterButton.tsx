"use client";

import { Button } from "@/components/ui/button";
import { useSignUp } from "@clerk/clerk-react";
import type { FC } from "react";
import { toast } from "sonner";

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
  const { signUp, isLoaded } = useSignUp();

  const handleGoogleSignUp = async () => {
    if (!isLoaded || !signUp) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/",
        redirectUrlComplete: "/",
      });
    } catch (error) {
      toast.error("Erro ao registrar com Google");
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleSignUp}
      disabled={disabled || !isLoaded}
      className={`flex w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 transition duration-200 hover:bg-muted disabled:cursor-not-allowed disabled:bg-muted/50 ${className}`}
      tabIndex={0}
      aria-label="Registrar com Google"
    >
      <img src="/assets/google-icon.svg" alt="Google" width={20} height={20} className="h-5 w-5" />
      <span>{children || "Google"}</span>
    </Button>
  );
};
