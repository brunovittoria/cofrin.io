import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GoogleRegisterButton } from "@/components/GoogleRegisterButton";
import { Link } from "react-router-dom";

interface RegisterActionsProps {
  isValid: boolean;
  isLoading: boolean;
  isLoaded: boolean;
}

export const RegisterActions = ({
  isValid,
  isLoading,
  isLoaded,
}: RegisterActionsProps) => {
  return (
    <>
      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={!isValid || isLoading || !isLoaded}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>

      <div className="flex items-center my-6">
        <Separator className="flex-1" />
        <span className="px-3 text-sm text-muted-foreground">
          Or continue with
        </span>
        <Separator className="flex-1" />
      </div>

      <div className="w-full">
        <GoogleRegisterButton />
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:text-primary/80 transition duration-200"
          >
            Sign In
          </Link>
        </p>
      </div>
    </>
  );
};

