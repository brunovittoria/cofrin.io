import { useForgotPasswordForm } from "@/hooks/auth/useForgotPasswordForm";
import { Logo } from "../login/components/Logo";
import { EmailField } from "../login/components/EmailField";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Mail, ArrowLeft } from "lucide-react";
import { DashboardPreview } from "../login/components/DashboardPreview";

export function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isValid,
    isLoading,
    isEmailSent,
    emailValue,
    handleResend,
  } = useForgotPasswordForm();

  if (isEmailSent) {
    return (
      <main className="flex flex-col lg:flex-row w-full min-h-screen overflow-hidden">
        <section className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col justify-center bg-white">
          <div className="max-w-lg mx-auto w-full px-4 sm:px-0 min-h-screen">
            <Logo />

            <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <Mail className="h-12 w-12 text-green-600" />
                <div className="space-y-2">
                  <p className="text-base font-medium text-green-900">
                    Check your email
                  </p>
                  <p className="text-sm text-green-700">
                    We've sent password reset instructions to <strong>{emailValue}</strong>
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    Click the link in the email to reset your password. The link will expire in 1 hour.
                  </p>
                </div>
                <div className="flex gap-2 mt-4 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResend}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? "Sending..." : "Resend"}
                  </Button>
                  <Link to="/login">
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </div>
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
          </div>
        </section>

        <DashboardPreview />
      </main>
    );
  }

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
            <h1 className="text-2xl font-semibold mb-2">Reset Your Password</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" data-testid="forgot-password-form">
            <EmailField register={register} errors={errors} />

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
              disabled={!isValid || isLoading}
            >
              <Mail className="h-4 w-4" />
              {isLoading ? "Sending..." : "Send Reset Instructions"}
            </Button>
          </form>

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
        </div>
      </section>

      <DashboardPreview />
    </main>
  );
}
