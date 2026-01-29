import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Control } from "react-hook-form";
import type { LoginFormData } from "@/lib/validations";

interface PasswordFieldProps {
  control: Control<LoginFormData>;
}

export const PasswordField = ({ control }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name="password"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <div className="flex justify-between">
            <FormLabel>Password</FormLabel>
            <Link
              to="/login/forgot-password"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              Forgot Your Password?
            </Link>
          </div>
          <div className="relative">
            <FormControl>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Your Password"
                className="w-full pr-10"
                {...field}
              />
            </FormControl>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

