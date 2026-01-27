import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { Link, useNavigate } from "@tanstack/react-router";
import { Mail } from "lucide-react";

interface LoginActionsProps {
  isValid: boolean;
  isLoading: boolean;
  isLoaded: boolean;
}

export const LoginActions = ({
  isValid,
  isLoading,
  isLoaded,
}: LoginActionsProps) => {
  const navigate = useNavigate();

  const handleMagicLinkClick = () => {
    navigate({ to: "/login/magic-link" });
  };

  return (
    <>
      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={!isValid || isLoading || !isLoaded}
      >
        {isLoading ? "Signing In..." : "Sign In with Email"}
      </Button>

      <div className="flex items-center gap-2 my-4">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleMagicLinkClick}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2"
      >
        <Mail className="h-4 w-4" />
        Sign in with Magic Link
      </Button>

      <div className="flex items-center my-6">
        <Separator className="flex-1" />
        <span className="px-3 text-sm text-muted-foreground">
          Or continue with
        </span>
        <Separator className="flex-1" />
      </div>

      <div className="w-full">
        <GoogleLoginButton />
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Don't Have an Account?{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:text-primary/80 transition duration-200"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
};

