# Forgot/Reset Password Implementation Documentation

## Overview

This document explains the step-by-step implementation of the forgot password and reset password flow. Users can request a password reset by entering their email address, receive reset instructions via email, and then create a new password through a secure link.

## Architecture

The password reset flow works as follows:

1. User clicks "Forgot Your Password?" link on the login page
2. User is redirected to `/login/forgot-password` page
3. User enters their email address
4. User clicks "Send Reset Instructions" button
5. Supabase sends email with password reset link
6. User sees "Check Your Email" confirmation screen
7. User clicks link in email → redirects to `/reset-password` (or `/auth/callback` first)
8. User enters new password and confirmation
9. Password is updated via Supabase
10. User is redirected to login page

## Implementation Steps

### Step 1: Add Validation Schemas

**File Modified**: `apps/web/src/lib/validations.ts`

We added two new validation schemas using Zod to ensure data integrity.

#### Forgot Password Schema

```typescript
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});
```

**What This Does**:
- Validates that an email is provided (not empty)
- Validates that the email format is correct (contains @, domain, etc.)
- Provides user-friendly error messages

**Why We Need This**:
- Prevents invalid email addresses from being submitted
- Gives immediate feedback to users before they click submit
- Ensures we only send reset emails to valid addresses

#### Reset Password Schema

```typescript
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
```

**What This Does**:
- Validates password meets security requirements:
  - At least 8 characters long
  - Contains at least one uppercase letter
  - Contains at least one lowercase letter
  - Contains at least one number
- Validates that password and confirmation match
- Provides specific error messages for each validation rule

**Why We Need This**:
- Ensures users create strong, secure passwords
- Prevents typos by requiring confirmation
- Matches the same password requirements as registration for consistency

#### Type Exports

```typescript
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
```

**What This Does**:
- Creates TypeScript types from the Zod schemas
- Ensures type safety throughout the application

---

### Step 2: Create Forgot Password Form Hook

**File Created**: `apps/web/src/hooks/useForgotPasswordForm.ts`

This hook manages the forgot password form state and handles the email sending logic.

#### Understanding Hooks

A hook in React is a special function that lets you reuse logic across components. This custom hook encapsulates all the logic for the forgot password form.

#### Code Breakdown

```typescript
export const useForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailValue, setEmailValue] = useState<string>("");
```

**What This Does**:
- `isLoading`: Tracks whether the form is currently submitting (shows loading spinner)
- `isEmailSent`: Tracks whether the email was successfully sent (shows confirmation screen)
- `emailValue`: Stores the email address for resend functionality

**Why We Need State**:
- React needs to know when to show loading indicators
- We need to remember if email was sent to show the right screen
- We store the email so users can resend if needed

```typescript
const {
  register,
  handleSubmit,
  watch,
  formState: { errors, isValid },
} = useForm<ForgotPasswordFormData>({
  resolver: zodResolver(forgotPasswordSchema),
  mode: "onChange",
});
```

**What This Does**:
- `register`: Connects form inputs to React Hook Form
- `handleSubmit`: Wraps our submit function with validation
- `watch`: Watches the email field value in real-time
- `errors`: Contains validation errors (if any)
- `isValid`: Boolean indicating if form is valid
- `zodResolver`: Connects Zod validation to React Hook Form
- `mode: "onChange"`: Validates fields as user types

**Why React Hook Form**:
- Handles form state automatically
- Provides built-in validation
- Reduces boilerplate code
- Improves performance (only re-renders what changed)

```typescript
const onSubmit = async (data: ForgotPasswordFormData) => {
  setIsLoading(true);
  setEmailValue(data.email);

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error(error.message || "Failed to send password reset email. Please try again.");
    } else {
      toast.success("Check your email for password reset instructions!");
      setIsEmailSent(true);
    }
  } catch (error: any) {
    console.error("Password reset error:", error);
    toast.error(error.message || "Failed to send password reset email. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
```

**What This Does**:
1. Sets loading state to true (shows spinner)
2. Stores the email address
3. Calls Supabase's `resetPasswordForEmail` function
4. Sets `redirectTo` to our reset password page
5. Shows success/error messages using toast notifications
6. Sets `isEmailSent` to true on success (shows confirmation screen)
7. Always sets loading to false when done (removes spinner)

**Why `redirectTo` is Important**:
- Tells Supabase where to send users when they click the email link
- Must match a URL configured in Supabase Dashboard
- Ensures users land on our reset password page

```typescript
const handleResend = async () => {
  if (!emailValue) {
    setIsEmailSent(false);
    return;
  }

  setIsLoading(true);
  // ... similar logic to onSubmit
};
```

**What This Does**:
- Allows users to request another reset email
- Uses the stored email value
- Same logic as initial submission

**Why We Need Resend**:
- Users might not receive the first email
- Emails can go to spam
- Provides better user experience

---

### Step 3: Create Reset Password Form Hook

**File Created**: `apps/web/src/hooks/useResetPasswordForm.ts`

This hook manages the reset password form and handles password update.

#### Code Breakdown

```typescript
export const useResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
```

**What This Does**:
- `isLoading`: Tracks form submission state
- `navigate`: TanStack Router function to navigate between pages

```typescript
const {
  register,
  handleSubmit,
  formState: { errors, isValid },
} = useForm<ResetPasswordFormData>({
  resolver: zodResolver(resetPasswordSchema),
  mode: "onChange",
});
```

**What This Does**:
- Same pattern as forgot password hook
- Uses `resetPasswordSchema` for validation
- Validates password requirements in real-time

```typescript
const onSubmit = async (data: ResetPasswordFormData) => {
  setIsLoading(true);

  try {
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      toast.error(error.message || "Failed to reset password. Please try again.");
    } else {
      toast.success("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate({ to: "/login" });
      }, 1500);
    }
  } catch (error: any) {
    console.error("Password reset error:", error);
    toast.error(error.message || "Failed to reset password. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
```

**What This Does**:
1. Sets loading state
2. Calls Supabase's `updateUser` with new password
3. Shows success message
4. Waits 1.5 seconds (so user can see success message)
5. Redirects to login page
6. Handles errors gracefully

**Why `updateUser` Works**:
- When user clicks reset link, Supabase creates a temporary session
- This session allows `updateUser` to work
- After password update, session is still valid
- User can then log in with new password

**Why setTimeout**:
- Gives user time to read success message
- Better UX than immediate redirect
- 1.5 seconds is short enough to not feel slow

---

### Step 4: Create Forgot Password Page Component

**File Created**: `apps/web/src/pages/authenticated/auth/forgot-password/index.tsx`

This is the page where users request a password reset.

#### Component Structure

```typescript
export function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isValid,
    isLoading,
    isEmailSent,
    emailValue,
    handleResend,
  } = useForgotPasswordForm();
```

**What This Does**:
- Uses our custom hook to get all form logic
- Destructures all needed values and functions

**Why This Pattern**:
- Separates logic (hook) from presentation (component)
- Makes component easier to read
- Logic can be reused if needed

#### Two UI States

The component renders differently based on `isEmailSent`:

**State 1: Email Input Form**

```typescript
if (isEmailSent) {
  // Show confirmation screen
  return (/* confirmation UI */);
}

// Show email input form
return (/* form UI */);
```

**What This Does**:
- Checks if email was sent
- Shows appropriate UI based on state

**Why Two States**:
- Better UX - user knows email was sent
- Prevents confusion
- Follows same pattern as magic link

#### Form UI

```typescript
<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
  <EmailField register={register} errors={errors} />
  <Button
    type="submit"
    disabled={!isValid || isLoading}
  >
    {isLoading ? "Sending..." : "Send Reset Instructions"}
  </Button>
</form>
```

**What This Does**:
- `handleSubmit(onSubmit)`: Wraps our function with validation
- `EmailField`: Reusable component for email input
- Button shows loading state
- Button disabled when form invalid or loading

**Why Reuse EmailField**:
- Consistent UI across app
- Less code duplication
- Easier to maintain

#### Confirmation Screen

```typescript
<div className="rounded-lg border border-green-200 bg-green-50 p-6">
  <Mail className="h-12 w-12 text-green-600" />
  <p>Check your email</p>
  <p>We've sent password reset instructions to <strong>{emailValue}</strong></p>
  <Button onClick={handleResend}>Resend</Button>
  <Link to="/login">Back to Login</Link>
</div>
```

**What This Does**:
- Shows success message with email address
- Provides resend option
- Provides navigation back to login

**Why Green Colors**:
- Visual indicator of success
- Consistent with magic link confirmation
- Clear positive feedback

---

### Step 5: Create Reset Password Page Component

**File Created**: `apps/web/src/pages/authenticated/auth/reset-password/index.tsx`

This is the page where users create their new password.

#### Password Field Components

**File Created**: `apps/web/src/pages/authenticated/auth/reset-password/components/PasswordField.tsx`
**File Created**: `apps/web/src/pages/authenticated/auth/reset-password/components/ConfirmPasswordField.tsx`

**What These Do**:
- Reusable password input components
- Show/hide password toggle
- Error message display
- Consistent styling

**Why Separate Components**:
- Reusable across app
- Cleaner main component
- Easier to test and maintain

#### Main Component

```typescript
export function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isValid,
    isLoading,
  } = useResetPasswordForm();
```

**What This Does**:
- Uses reset password hook
- Gets all form functionality

```typescript
<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
  <PasswordField register={register} errors={errors} />
  <ConfirmPasswordField register={register} errors={errors} />
  <Button type="submit" disabled={!isValid || isLoading}>
    {isLoading ? "Resetting Password..." : "Reset Password"}
  </Button>
</form>
```

**What This Does**:
- Two password fields (new password + confirmation)
- Submit button with loading state
- Validation happens automatically

**Why Two Fields**:
- Prevents typos
- User confirms they typed password correctly
- Standard security practice

---

### Step 6: Create Route Files

#### Forgot Password Route

**File Created**: `apps/web/src/routes/login/forgot-password.tsx`

```typescript
export const Route = createFileRoute("/login/forgot-password")({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: ForgotPasswordPage,
});
```

**What This Does**:
- Creates route at `/login/forgot-password`
- Checks if user is already logged in
- Redirects to dashboard if logged in (no need to reset password)
- Renders `ForgotPasswordPage` component

**Why `beforeLoad`**:
- Runs before component loads
- Prevents logged-in users from accessing reset page
- Better security and UX

#### Reset Password Route

**File Created**: `apps/web/src/routes/reset-password.tsx`

```typescript
export const Route = createFileRoute("/reset-password")({
  beforeLoad: async () => {
    // Check for recovery token in URL hash
    if (typeof window !== "undefined") {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get("type");
      
      if (type === "recovery") {
        return; // Allow access
      }
    }
    
    // Check for valid session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw redirect({ to: "/login" });
    }
  },
  component: ResetPasswordPage,
});
```

**What This Does**:
- Creates route at `/reset-password`
- Checks for recovery token in URL (from email link)
- Checks for valid session
- Redirects to login if neither exists

**Why Check Both**:
- Recovery token: User just clicked email link (token in URL)
- Session: Supabase may have already processed token
- Either one means user is authorized

**Why `window.location.hash`**:
- Supabase puts token in URL hash (after #)
- Format: `#access_token=...&type=recovery`
- We check for `type=recovery` to identify password reset

---

### Step 7: Update Login Route

**File Modified**: `apps/web/src/routes/login.tsx`

```typescript
function LoginLayout() {
  const location = useLocation();
  const isMagicLinkRoute = location.pathname === "/login/magic-link";
  const isForgotPasswordRoute = location.pathname === "/login/forgot-password";
  
  if (isMagicLinkRoute || isForgotPasswordRoute) {
    return <Outlet />;
  }
  
  return <LoginPage />;
}
```

**What This Does**:
- Checks current pathname
- Renders child route if on magic-link or forgot-password
- Renders main login page otherwise

**Why This Was Needed**:
- TanStack Router requires `<Outlet />` to render child routes
- Without this, child routes wouldn't render
- Same pattern as magic link route

---

### Step 8: Update PasswordField Component

**File Modified**: `apps/web/src/pages/authenticated/auth/login/components/PasswordField.tsx`

**Before**:
```typescript
<a href="#" className="...">
  Forgot Your Password?
</a>
```

**After**:
```typescript
import { Link } from "@tanstack/react-router";

<Link
  to="/login/forgot-password"
  className="..."
>
  Forgot Your Password?
</Link>
```

**What This Does**:
- Replaces anchor tag with TanStack Router `Link`
- Navigates to forgot password page
- Uses client-side routing (faster, no page reload)

**Why `Link` Instead of `<a>`**:
- Client-side navigation (faster)
- Preserves app state
- Better user experience
- TanStack Router requirement

---

### Step 9: Update Auth Callback

**File Modified**: `apps/web/src/routes/auth/callback.tsx`

```typescript
const handleAuthCallback = async () => {
  // Check if this is a password reset flow
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const type = hashParams.get("type");
  
  if (type === "recovery") {
    // This is a password reset flow, redirect to reset password page
    navigate({ to: "/reset-password" });
    return;
  }

  // ... rest of OAuth/magic link handling
};
```

**What This Does**:
- Checks URL hash for `type=recovery`
- If found, redirects to reset password page
- Otherwise, continues with normal auth flow

**Why This Was Needed**:
- Some email clients may redirect to `/auth/callback` first
- Ensures password reset always goes to correct page
- Handles edge cases

**How It Works**:
1. User clicks reset link in email
2. Supabase redirects to callback (or directly to reset-password)
3. Callback checks for recovery token
4. Redirects to reset password page
5. User can set new password

---

## How the Complete Flow Works

### Step-by-Step User Journey

1. **User clicks "Forgot Your Password?"**
   - Link in `PasswordField` component
   - Navigates to `/login/forgot-password`

2. **User enters email**
   - Types email in form
   - Validation happens in real-time
   - Clicks "Send Reset Instructions"

3. **Email is sent**
   - `useForgotPasswordForm` calls Supabase
   - Supabase sends email with reset link
   - User sees confirmation screen

4. **User clicks email link**
   - Link format: `https://yourapp.com/reset-password#access_token=...&type=recovery`
   - Supabase processes token
   - Creates temporary session

5. **User lands on reset password page**
   - Route checks for recovery token or session
   - If valid, shows password form
   - If invalid, redirects to login

6. **User enters new password**
   - Types password (validated in real-time)
   - Confirms password
   - Clicks "Reset Password"

7. **Password is updated**
   - `useResetPasswordForm` calls Supabase
   - Password is updated in database
   - Success message shown

8. **User redirected to login**
   - After 1.5 seconds
   - Can now log in with new password

---

## Key Concepts Explained

### What is a Recovery Token?

A recovery token is a temporary, secure code that Supabase generates when a user requests a password reset. It:
- Is unique to each reset request
- Expires after 1 hour
- Can only be used once
- Is sent via email for security

**Why Tokens?**
- More secure than emailing passwords
- Can expire automatically
- Prevents unauthorized access
- Standard security practice

### What is a Session?

A session is Supabase's way of tracking that a user is authenticated. When a user clicks the reset link:
- Supabase creates a temporary session
- This session allows `updateUser` to work
- Session is tied to the recovery token
- After password update, session remains valid

**Why Temporary?**
- Security: limits time window for password reset
- Prevents abuse: can't reset password days later
- User must complete reset quickly

### Why Two Password Fields?

Having both "Password" and "Confirm Password" fields:
- **Prevents Typos**: User must type password twice
- **Visual Confirmation**: User sees what they typed
- **Standard Practice**: Expected by users
- **Better UX**: Catches mistakes before submission

### Why Real-Time Validation?

Validating as user types (`mode: "onChange"`):
- **Immediate Feedback**: User knows if password is valid
- **Better UX**: Don't wait until submit to see errors
- **Guides User**: Shows requirements as they type
- **Prevents Frustration**: Fixes issues before submission

---

## Testing the Implementation

### Manual Testing Steps

1. **Test Forgot Password Flow**
   - Go to login page
   - Click "Forgot Your Password?"
   - Enter valid email
   - Check email for reset link
   - Verify confirmation screen appears

2. **Test Reset Password Flow**
   - Click reset link in email
   - Verify redirect to reset password page
   - Enter new password (meets requirements)
   - Confirm password matches
   - Submit form
   - Verify redirect to login

3. **Test Validation**
   - Try invalid email format
   - Try password too short
   - Try password without uppercase
   - Try mismatched passwords
   - Verify error messages appear

4. **Test Edge Cases**
   - Click reset link twice (should work once)
   - Wait 1+ hour then click link (should expire)
   - Try resetting while logged in (should redirect)
   - Try accessing reset page without token (should redirect)

### Common Issues and Solutions

#### Issue: Email Not Received

**Possible Causes**:
1. Check spam/junk folder
2. Verify email address is correct
3. Check Supabase email logs
4. Verify SMTP configuration

**Solution**:
- Check Supabase Dashboard → Authentication → Email Templates
- Verify email provider is configured
- Check rate limits (Supabase has limits)

#### Issue: "Invalid Token" Error

**Possible Causes**:
1. Token expired (1 hour limit)
2. Token already used
3. URL hash not preserved
4. Browser cleared cookies/localStorage

**Solution**:
- Request new reset email
- Ensure URL hash is preserved
- Don't copy/paste link (click directly)
- Complete reset within 1 hour

#### Issue: Redirect Not Working

**Possible Causes**:
1. Redirect URL not configured in Supabase
2. URL mismatch
3. Route not created
4. Auth callback interfering

**Solution**:
- Add `/reset-password` to Supabase Redirect URLs
- Verify URL matches exactly (no trailing slash)
- Check route file exists
- Verify auth callback logic

#### Issue: Password Update Fails

**Possible Causes**:
1. No valid session
2. Token expired
3. Password doesn't meet requirements
4. Network error

**Solution**:
- Verify session exists (check browser console)
- Request new reset email
- Check password meets all requirements
- Check network tab for errors

---

## Security Considerations

### What Makes This Secure?

1. **Token-Based Reset**
   - Tokens are unique and expire
   - Can't be guessed or reused
   - Sent via email (requires email access)

2. **Time-Limited**
   - Tokens expire after 1 hour
   - Prevents old links from working
   - Forces timely completion

3. **Session Validation**
   - Route checks for valid session/token
   - Prevents unauthorized access
   - Redirects invalid requests

4. **Password Requirements**
   - Minimum length (8 characters)
   - Complexity requirements (uppercase, lowercase, number)
   - Prevents weak passwords

5. **No Password in Email**
   - Only reset link is sent
   - Password never transmitted via email
   - User creates password on secure page

### Best Practices

1. **Always use HTTPS**
   - Protects tokens in transit
   - Required for production

2. **Configure Redirect URLs**
   - Only allow trusted domains
   - Prevents redirect attacks

3. **Rate Limiting**
   - Supabase has built-in limits
   - Prevents abuse
   - Consider additional limits if needed

4. **Monitor Reset Requests**
   - Watch for suspicious activity
   - Alert on unusual patterns
   - Log all reset attempts

---

## Code Organization

### File Structure

```
apps/web/src/
├── hooks/
│   ├── useForgotPasswordForm.ts      # Forgot password logic
│   └── useResetPasswordForm.ts       # Reset password logic
├── lib/
│   └── validations.ts                 # Validation schemas
├── pages/authenticated/auth/
│   ├── forgot-password/
│   │   └── index.tsx                  # Forgot password page
│   └── reset-password/
│       ├── index.tsx                 # Reset password page
│       └── components/
│           ├── PasswordField.tsx     # Password input
│           └── ConfirmPasswordField.tsx # Confirm password input
└── routes/
    ├── login/
    │   └── forgot-password.tsx       # Forgot password route
    ├── reset-password.tsx            # Reset password route
    └── auth/
        └── callback.tsx              # Auth callback (updated)
```

### Why This Structure?

- **Hooks**: Reusable logic separated from UI
- **Pages**: Full page components
- **Components**: Reusable UI pieces
- **Routes**: Route configuration
- **Validations**: Centralized schema definitions

---

## Future Enhancements

Potential improvements to consider:

1. **Password Strength Meter**
   - Visual indicator of password strength
   - Real-time feedback
   - Encourages stronger passwords

2. **Email Template Customization**
   - Branded reset emails
   - Custom messaging
   - Better user experience

3. **Reset Link Expiration Customization**
   - Configurable expiration time
   - User preference
   - Security vs UX balance

4. **Multi-Factor Authentication**
   - Require MFA for password reset
   - Additional security layer
   - Optional for users

5. **Analytics**
   - Track reset requests
   - Monitor success rates
   - Identify issues

6. **Rate Limiting UI**
   - Show user when rate limited
   - Explain why
   - Suggest alternatives

---

## Summary

This implementation provides a complete, secure password reset flow that:

✅ Allows users to request password reset via email
✅ Sends secure reset links via Supabase
✅ Validates passwords meet security requirements
✅ Provides clear user feedback at each step
✅ Handles errors gracefully
✅ Follows existing code patterns
✅ Is well-documented and maintainable

The flow is production-ready and follows security best practices while providing an excellent user experience.
