import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { type RegisterFormData } from "@/lib/validations";

interface NameFieldsProps {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
}

export const NameFields = ({ register, errors }: NameFieldsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="firstName"
            type="text"
            placeholder="First name"
            {...register("firstName")}
            className={`w-full pl-10 ${errors.firstName ? "border-red-500" : ""}`}
          />
        </div>
        {errors.firstName && (
          <p className="text-xs text-red-500">{errors.firstName.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="lastName"
            type="text"
            placeholder="Last name"
            {...register("lastName")}
            className={`w-full pl-10 ${errors.lastName ? "border-red-500" : ""}`}
          />
        </div>
        {errors.lastName && (
          <p className="text-xs text-red-500">{errors.lastName.message}</p>
        )}
      </div>
    </div>
  );
};

