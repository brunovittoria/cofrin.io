import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { type RegisterFormData } from "@/lib/validations";

interface PasswordFieldProps {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

export const PasswordField = ({
  register,
  errors,
  showPassword,
  setShowPassword,
}: PasswordFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="password">Password</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Create a strong password"
          {...register("password")}
          className={`w-full pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
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

