import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { type LoginFormData } from "@/lib/validations";

interface EmailFieldProps {
  register: UseFormRegister<LoginFormData>;
  errors: FieldErrors<LoginFormData>;
}

export const EmailField = ({ register, errors }: EmailFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="Enter your email address"
        {...register("email")}
        className={`w-full ${errors.email ? "border-red-500" : ""}`}
      />
      {errors.email && (
        <p className="text-xs text-red-500">{errors.email.message}</p>
      )}
    </div>
  );
};

