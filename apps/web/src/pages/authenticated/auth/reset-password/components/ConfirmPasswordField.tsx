import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { type ResetPasswordFormData } from "@/lib/validations";

interface ConfirmPasswordFieldProps {
  register: UseFormRegister<ResetPasswordFormData>;
  errors: FieldErrors<ResetPasswordFormData>;
}

export const ConfirmPasswordField = ({ register, errors }: ConfirmPasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor="confirmPassword">Confirm New Password</Label>
      <div className="relative">
        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          placeholder="Confirm your new password"
          {...register("confirmPassword")}
          className={`w-full pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {errors.confirmPassword && (
        <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
      )}
    </div>
  );
};
