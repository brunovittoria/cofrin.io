import { CheckCircle } from "lucide-react";

interface PasswordRequirementsProps {
  passwordRequirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
  };
}

export const PasswordRequirements = ({
  passwordRequirements,
}: PasswordRequirementsProps) => {
  return (
    <div className="mt-2 space-y-1">
      <p className="text-xs text-muted-foreground">Password requirements:</p>
      <div className="space-y-1">
        <div
          className={`flex items-center text-xs ${
            passwordRequirements.minLength
              ? "text-green-600"
              : "text-muted-foreground"
          }`}
        >
          <CheckCircle
            className={`h-3 w-3 mr-1 ${
              passwordRequirements.minLength
                ? "text-green-600"
                : "text-muted-foreground"
            }`}
          />
          At least 8 characters
        </div>
        <div
          className={`flex items-center text-xs ${
            passwordRequirements.hasUppercase
              ? "text-green-600"
              : "text-muted-foreground"
          }`}
        >
          <CheckCircle
            className={`h-3 w-3 mr-1 ${
              passwordRequirements.hasUppercase
                ? "text-green-600"
                : "text-muted-foreground"
            }`}
          />
          One uppercase letter
        </div>
        <div
          className={`flex items-center text-xs ${
            passwordRequirements.hasLowercase
              ? "text-green-600"
              : "text-muted-foreground"
          }`}
        >
          <CheckCircle
            className={`h-3 w-3 mr-1 ${
              passwordRequirements.hasLowercase
                ? "text-green-600"
                : "text-muted-foreground"
            }`}
          />
          One lowercase letter
        </div>
        <div
          className={`flex items-center text-xs ${
            passwordRequirements.hasNumber
              ? "text-green-600"
              : "text-muted-foreground"
          }`}
        >
          <CheckCircle
            className={`h-3 w-3 mr-1 ${
              passwordRequirements.hasNumber
                ? "text-green-600"
                : "text-muted-foreground"
            }`}
          />
          One number
        </div>
      </div>
    </div>
  );
};

