import { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { toast } from "sonner";

export const useRegisterForm = () => {
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

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isValid,
    isLoading,
    isLoaded,
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

