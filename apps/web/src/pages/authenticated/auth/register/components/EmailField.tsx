import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Mail } from "lucide-react";
import type { Control } from "react-hook-form";
import type { RegisterFormData } from "@/lib/validations";

interface EmailFieldProps {
  control: Control<RegisterFormData>;
}

export const EmailField = ({ control }: EmailFieldProps) => {
  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>Email</FormLabel>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <FormControl>
              <Input
                type="email"
                placeholder="Enter your email address"
                className="w-full pl-10"
                {...field}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

