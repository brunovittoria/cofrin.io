import React, { useState } from "react";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { BarChart3, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email/password login with Clerk
    // This will be handled by Clerk's SignInButton with email/password
  };

  return (
  <main className="flex flex-col lg:flex-row w-full min-h-screen overflow-hidden">
    {/* Left side - Login form */}
      <section className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col justify-center bg-white">
        <div className="max-w-lg mx-auto w-full px-4 sm:px-0 min-h-screen">
          {/* Logo */}
          <div className="mb-8">
            <img src="/assets/cofrinio-logo.png" alt="Cofrinio" className="w-full h-auto" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full"
              />
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
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <SignInButton mode="modal">
              <Button
                type="button"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Sign In with Email
              </Button>
            </SignInButton>

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
                <SignUpButton mode="modal">
                  <button className="font-medium text-primary hover:text-primary/80 transition duration-200">
                    Sign Up
                  </button>
                </SignUpButton>
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
