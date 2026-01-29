import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User } from "lucide-react";
import type { Control } from "react-hook-form";
import type { RegisterFormData } from "@/lib/validations";

interface NameFieldsProps {
  control: Control<RegisterFormData>;
}

export const NameFields = ({ control }: NameFieldsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="firstName"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>First Name</FormLabel>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <FormControl>
                <Input
                  type="text"
                  placeholder="First name"
                  className="w-full pl-10"
                  {...field}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="lastName"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Last Name</FormLabel>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <FormControl>
                <Input
                  type="text"
                  placeholder="Last name"
                  className="w-full pl-10"
                  {...field}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

