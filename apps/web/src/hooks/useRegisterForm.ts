import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";

export const useRegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

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
    setIsLoading(true);

    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          },
        },
      });

      if (authError) {
        toast.error(authError.message || "Failed to create account. Please try again.");
        return;
      }

      if (authData.user) {
        // Create user record in usuarios table
        const { error: userError } = await supabase.from("usuarios").insert({
          auth_user_id: authData.user.id,
          // Add other fields as needed based on your usuarios table structure
        });

        if (userError) {
          console.error("Error creating user record:", userError);
          toast.error("Account created but failed to initialize profile. Please contact support.");
        } else {
          toast.success("Account created! Please check your email for verification.");
          navigate({ to: "/login" });
        }
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isValid,
    isLoading,
    isLoaded: true, // Always loaded for Supabase Auth
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    watchedPassword,
    watchedConfirmPassword,
    passwordRequirements,
    isPasswordValid,
    passwordsMatch,
  };
};
