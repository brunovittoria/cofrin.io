import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Lock, Eye, EyeOff } from "lucide-react";
import type { Control } from "react-hook-form";
import type { RegisterFormData } from "@/lib/validations";

interface PasswordFieldProps {
  control: Control<RegisterFormData>;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

export const PasswordField = ({
  control,
  showPassword,
  setShowPassword,
}: PasswordFieldProps) => {
  return (
    <FormField
      control={control}
      name="password"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>Password</FormLabel>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <FormControl>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className="w-full pl-10 pr-10"
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

