import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { type RegisterFormData } from "@/lib/validations";

interface EmailFieldProps {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
}

export const EmailField = ({ register, errors }: EmailFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          {...register("email")}
          className={`w-full pl-10 ${errors.email ? "border-red-500" : ""}`}
        />
      </div>
      {errors.email && (
        <p className="text-xs text-red-500">{errors.email.message}</p>
      )}
    </div>
  );
};

