import React, { useState } from "react";
import { useSignIn, SignUpButton } from "@clerk/clerk-react";
import { BarChart3, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { toast } from "sonner";

export function LoginPage() {
  const { signIn, isLoaded } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    if (!isLoaded || !signIn) return;

    setIsLoading(true);

    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (result.status === "complete") {
        toast.success("Login successful!");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      if (error.errors && error.errors.length > 0) {
        const errorMessage = error.errors[0].message;
        toast.error(errorMessage);
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col lg:flex-row w-full min-h-screen overflow-hidden">
      {/* Left side - Login form */}
      <section className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col justify-center bg-white">
        <div className="max-w-lg mx-auto w-full px-4 sm:px-0 min-h-screen">
          {/* Logo */}
          <div className="mb-8">
            <img
              src="/assets/cofrinio-logo.png"
              alt="Cofrinio"
              className="w-full h-auto"
            />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                {...register("email")}
                className={`w-full ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-sm font-medium text-primary hover:text-primary/80"
                >
                  Forgot Your Password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your Password"
                  {...register("password")}
                  className={`w-full pr-10 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={!isValid || isLoading || !isLoaded}
            >
              {isLoading ? "Signing In..." : "Sign In with Email"}
            </Button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <Separator className="flex-1" />
              <span className="px-3 text-sm text-muted-foreground">
                Or continue with
              </span>
              <Separator className="flex-1" />
            </div>

            {/* Google Login Option */}
            <div className="w-full">
              <GoogleLoginButton />
            </div>

            {/* Sign Up Link */}
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
          </form>
        </div>
      </section>

      {/* Right side - Dashboard preview */}
      <section className="hidden lg:flex lg:w-1/2 bg-muted/30 p-8">
        <div className="h-full flex flex-col justify-center items-center">
          <div className="max-w-lg w-full">
            <div className="mb-6">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                <p className="text-sm font-medium text-muted-foreground">
                  What's new?
                </p>
              </div>
              <div className="flex justify-between items-center mt-1">
                <h3 className="text-xl font-semibold text-foreground">
                  Financial Dashboard
                </h3>
                <a
                  href="#"
                  className="text-sm text-primary flex items-center hover:text-primary/80 transition duration-200"
                >
                  View All Features <span className="ml-1">→</span>
                </a>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Track expenses, income, and manage your finances in real-time.
              </p>
            </div>

            {/* Dashboard Image */}
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src="/assets/dashboard-login.png"
                alt="Cofrinio Dashboard Preview"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
