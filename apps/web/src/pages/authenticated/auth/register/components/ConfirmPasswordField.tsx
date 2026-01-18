import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { type RegisterFormData } from "@/lib/validations";

interface ConfirmPasswordFieldProps {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
}

export const ConfirmPasswordField = ({
  register,
  errors,
  showConfirmPassword,
  setShowConfirmPassword,
}: ConfirmPasswordFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="confirmPassword">Confirm Password</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          id="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm your password"
          {...register("confirmPassword")}
          className={`w-full pl-10 pr-10 ${
            errors.confirmPassword ? "border-red-500" : ""
          }`}
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
  );
};
