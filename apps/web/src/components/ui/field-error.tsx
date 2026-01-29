import * as React from "react";
import { cn } from "@/lib/utils";

interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  message?: string;
}

const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ className, message, children, ...props }, ref) => {
    const body = message || children;

    if (!body) {
      return null;
    }

    return (
      <p
        ref={ref}
        className={cn("text-sm font-medium text-destructive", className)}
        role="alert"
        {...props}
      >
        {body}
      </p>
    );
  }
);
FieldError.displayName = "FieldError";

export { FieldError };
