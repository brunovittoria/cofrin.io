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

interface ConfirmPasswordFieldProps {
  control: Control<RegisterFormData>;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
}

export const ConfirmPasswordField = ({
  control,
  showConfirmPassword,
  setShowConfirmPassword,
}: ConfirmPasswordFieldProps) => {
  return (
    <FormField
      control={control}
      name="confirmPassword"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>Confirm Password</FormLabel>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <FormControl>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="w-full pl-10 pr-10"
                {...field}
              />
            </FormControl>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
