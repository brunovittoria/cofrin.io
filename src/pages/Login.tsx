import React, { useState } from "react";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { BarChart3, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      {/* Left side - Login form */}
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-background">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground flex items-center">
              <div className="w-8 h-8 bg-gradient-primary rounded-xl flex items-center justify-center mr-3">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              Cofrinio
            </h1>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 text-foreground">
              Welcome Back!
            </h2>
            <p className="text-muted-foreground">
              Let's get you signed in securely.
            </p>
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
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Login Option */}
            <div className="w-full">
              <SignInButton mode="modal" forceRedirectUrl="/">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center"
                >
                  <img
                    src="/google-icon.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  Google
                </Button>
              </SignInButton>
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
      </div>

      {/* Right side - Dashboard preview */}
      <div className="hidden md:block w-1/2 bg-muted/30 p-8">
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
                src="/dashboard-login.png"
                alt="Cofrinio Dashboard Preview"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
