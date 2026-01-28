import { useResetPasswordForm } from "@/hooks/auth/useResetPasswordForm";
import { Logo } from "../login/components/Logo";
import { PasswordField } from "./components/PasswordField";
import { ConfirmPasswordField } from "./components/ConfirmPasswordField";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Lock, ArrowLeft } from "lucide-react";
import { DashboardPreview } from "../login/components/DashboardPreview";

export function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isValid,
    isLoading,
  } = useResetPasswordForm();

  return (
    <main className="flex flex-col lg:flex-row w-full min-h-screen overflow-hidden">
      <section className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col justify-center bg-white">
        <div className="max-w-lg mx-auto w-full px-4 sm:px-0 min-h-screen">
          <Logo />

          <div className="mb-6">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-2">Create New Password</h1>
            <p className="text-sm text-muted-foreground">
              Enter your new password below. Make sure it's strong and secure.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" data-testid="reset-password-form">
            <PasswordField register={register} errors={errors} />
            <ConfirmPasswordField register={register} errors={errors} />

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
              disabled={!isValid || isLoading}
            >
              <Lock className="h-4 w-4" />
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary/80 transition duration-200"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </section>

      <DashboardPreview />
    </main>
  );
}
