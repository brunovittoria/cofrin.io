import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { type ResetPasswordFormData } from "@/lib/validations";

interface PasswordFieldProps {
  register: UseFormRegister<ResetPasswordFormData>;
  errors: FieldErrors<ResetPasswordFormData>;
}

export const PasswordField = ({ register, errors }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor="password">New Password</Label>
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your new password"
          {...register("password")}
          className={`w-full pr-10 ${errors.password ? "border-red-500" : ""}`}
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
    </div>
  );
};
