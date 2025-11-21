import React, { useState } from "react";
import { useSignUp, SignInButton } from "@clerk/clerk-react";
import { Eye, EyeOff, User, Mail, Lock, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GoogleRegisterButton } from "@/components/GoogleRegisterButton";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/validations";

export function RegisterPage() {
  const { signUp, isLoaded } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const watchedPassword = watch("password");
  const watchedConfirmPassword = watch("confirmPassword");

  const passwordRequirements = {
    minLength: watchedPassword ? watchedPassword.length >= 8 : false,
    hasUppercase: watchedPassword ? /[A-Z]/.test(watchedPassword) : false,
    hasLowercase: watchedPassword ? /[a-z]/.test(watchedPassword) : false,
    hasNumber: watchedPassword ? /\d/.test(watchedPassword) : false,
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch = watchedPassword === watchedConfirmPassword;

  const onSubmit = async (data: RegisterFormData) => {
    if (!isLoaded || !signUp) return;

    setIsLoading(true);

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      toast.success("Account created! Please check your email for verification.");
      
    } catch (error: any) {
      console.error("Registration error:", error);
      
      if (error.errors && error.errors.length > 0) {
        const errorMessage = error.errors[0].message;
        toast.error(errorMessage);
      } else {
        toast.error("Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col lg:flex-row w-full min-h-screen overflow-hidden">
      {/* Left side - Registration form */}
      <section className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col justify-center bg-white">
        <div className="max-w-lg mx-auto w-full px-4 sm:px-0 min-h-screen">
          {/* Logo */}
          <div className="mb-8">
            <img src="/assets/cofrinio-logo.png" alt="Cofrinio" className="w-full h-auto" />
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    {...register("firstName")}
                    className={`w-full pl-10 ${errors.firstName ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-xs text-red-500">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    {...register("lastName")}
                    className={`w-full pl-10 ${errors.lastName ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-xs text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  {...register("email")}
                  className={`w-full pl-10 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  {...register("password")}
                  className={`w-full pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
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
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
              
              {/* Password Requirements */}
              {watchedPassword && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-muted-foreground">Password requirements:</p>
                  <div className="space-y-1">
                    <div className={`flex items-center text-xs ${passwordRequirements.minLength ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <CheckCircle className={`h-3 w-3 mr-1 ${passwordRequirements.minLength ? 'text-green-600' : 'text-muted-foreground'}`} />
                      At least 8 characters
                    </div>
                    <div className={`flex items-center text-xs ${passwordRequirements.hasUppercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <CheckCircle className={`h-3 w-3 mr-1 ${passwordRequirements.hasUppercase ? 'text-green-600' : 'text-muted-foreground'}`} />
                      One uppercase letter
                    </div>
                    <div className={`flex items-center text-xs ${passwordRequirements.hasLowercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <CheckCircle className={`h-3 w-3 mr-1 ${passwordRequirements.hasLowercase ? 'text-green-600' : 'text-muted-foreground'}`} />
                      One lowercase letter
                    </div>
                    <div className={`flex items-center text-xs ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <CheckCircle className={`h-3 w-3 mr-1 ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-muted-foreground'}`} />
                      One number
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  className={`w-full pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={!isValid || isLoading || !isLoaded}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <Separator className="flex-1" />
              <span className="px-3 text-sm text-muted-foreground">
                Or continue with
              </span>
              <Separator className="flex-1" />
            </div>

            {/* Google Registration Option */}
            <div className="w-full">
              <GoogleRegisterButton />
            </div>

            {/* Sign In Link */}
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
                  Welcome to Cofrinio
                </p>
              </div>
              <div className="flex justify-between items-center mt-1">
                <h3 className="text-xl font-semibold text-foreground">
                  Start Your Financial Journey
                </h3>
                <a
                  href="#"
                  className="text-sm text-primary flex items-center hover:text-primary/80 transition duration-200"
                >
                  Learn More <span className="ml-1">→</span>
                </a>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Join thousands of users who are already managing their finances with Cofrinio.
              </p>
            </div>

            {/* Dashboard Image */}
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src="/assets/login-dashboard.png"
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
