"use client";

import { Button } from "@/components/ui/button";
import { useSignIn } from "@clerk/clerk-react";
import type { FC } from "react";
import { toast } from "sonner";

interface GoogleButtonProps {
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const GoogleLoginButton: FC<GoogleButtonProps> = ({
  className = "",
  disabled = false,
  children = "Entrar com o Google",
}) => {
  const { signIn, isLoaded } = useSignIn();

  const handleGoogleSignIn = async () => {
    if (!isLoaded || !signIn) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/",
        redirectUrlComplete: "/",
      });
    } catch (error) {
      toast.error("Erro ao fazer login com Google");
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleSignIn}
      disabled={disabled || !isLoaded}
      className={`flex w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 transition duration-200 hover:bg-muted disabled:cursor-not-allowed disabled:bg-muted/50 ${className}`}
      tabIndex={0}
      aria-label="Entrar com Google"
    >
      <img src="/assets/google-icon.svg" alt="Google" width={20} height={20} className="h-5 w-5" />
      <span>{children || "Google"}</span>
    </Button>
  );
};
