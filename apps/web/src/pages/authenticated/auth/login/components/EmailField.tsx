import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegister, FieldErrors, FieldValues } from "react-hook-form";

interface EmailFieldProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export const EmailField = <T extends FieldValues>({ register, errors }: EmailFieldProps<T>) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="Enter your email address"
        {...register("email" as any)}
        className={`w-full ${errors.email ? "border-red-500" : ""}`}
      />
      {errors.email && (
        <p className="text-xs text-red-500">{(errors.email as any)?.message}</p>
      )}
    </div>
  );
};

