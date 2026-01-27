# Magic Link Login Implementation Documentation

## Overview

This document explains the step-by-step implementation of passwordless authentication via magic link on the login page. Users can enter their email address to receive a secure one-time link that authenticates them when clicked.

## Architecture

The magic link authentication flow works as follows:

1. User clicks "Sign in with Magic Link" on the login page
2. User is redirected to `/login/magic-link` page
3. User enters their email address
4. User clicks "Send Magic Link" button
5. Supabase sends email with magic link
6. User clicks link in email → redirects to `/auth/callback`
7. Callback handler processes authentication
8. User is redirected to dashboard

## Implementation Steps

### Step 1: Create Magic Link Form Hook

**File Created**: `apps/web/src/hooks/useMagicLinkForm.ts`

This hook manages the magic link form state and submission logic.

**Key Features**:
- Email validation using Zod schema
- Magic link email sending via Supabase `signInWithOtp`
- Email sent confirmation state
- Resend functionality
- Error handling with toast notifications

**Implementation Details**:
```typescript
- Uses React Hook Form with Zod validation
- Validates email format before submission
- Calls `supabase.auth.signInWithOtp()` with redirect URL
- Stores email value for resend functionality
- Manages loading and success states
```

### Step 2: Create Magic Link Login Page Component

**File Created**: `apps/web/src/pages/authenticated/auth/login/magic-link/index.tsx`

This is the dedicated page for magic link authentication.

**Key Features**:
- Email input field only (no password field)
- "Back to Login" navigation link
- Success message after email is sent
- Resend button functionality
- Consistent UI with main login page (Logo, DashboardPreview)

**UI States**:
1. **Initial State**: Shows email input form with "Send Magic Link" button
2. **Success State**: Shows confirmation message with email address and resend option

### Step 3: Create Route Configuration

**File Created**: `apps/web/src/routes/login/magic-link.tsx`

This file configures the route for the magic link page.

**Key Features**:
- Route path: `/login/magic-link`
- Authentication check (redirects if already logged in)
- Component mapping to `MagicLinkLoginPage`

### Step 4: Update Login Route to Support Child Routes

**File Modified**: `apps/web/src/routes/login.tsx`

The login route was updated to support nested routes using TanStack Router's `<Outlet />` component.

**Changes**:
- Added `LoginLayout` component that conditionally renders:
  - `<Outlet />` when on `/login/magic-link` (renders child route)
  - `<LoginPage />` when on `/login` (renders main login page)
- Uses `useLocation` hook to detect current pathname

**Why This Was Necessary**:
TanStack Router requires parent routes to use `<Outlet />` to render child routes. Without this, the child route component wouldn't render even though the URL changed.

### Step 5: Update LoginActions Component

**File Modified**: `apps/web/src/pages/authenticated/auth/login/components/LoginActions.tsx`

Simplified the component to navigate to the magic link page instead of handling it inline.

**Changes**:
- Removed all magic link-related props and state
- Added navigation to `/login/magic-link` when "Sign in with Magic Link" button is clicked
- Simplified component interface

### Step 6: Simplify useLoginForm Hook

**File Modified**: `apps/web/src/hooks/useLoginForm.ts`

Removed all magic link functionality since it's now handled on a separate page.

**Changes**:
- Removed magic link states (`isMagicLinkLoading`, `isEmailSent`, etc.)
- Removed magic link handler functions
- Removed email watching logic
- Kept only email/password login functionality

### Step 7: Update LoginPage Component

**File Modified**: `apps/web/src/pages/authenticated/auth/login/index.tsx`

Simplified the component by removing magic link-related props.

**Changes**:
- Removed magic link props from `useLoginForm` destructuring
- Removed conditional password field hiding
- Simplified `LoginActions` props

### Step 8: Make EmailField Component Generic

**File Modified**: `apps/web/src/pages/authenticated/auth/login/components/EmailField.tsx`

Made the component generic to work with both `LoginFormData` and `MagicLinkFormData`.

**Changes**:
- Added generic type parameter `<T extends FieldValues>`
- Updated props interface to use generic types
- Allows component to be reused across different form types

### Step 9: Centralize Email Validation

**File Modified**: `apps/web/src/lib/formatters.ts`

Added reusable email validation function to avoid code duplication.

**Changes**:
- Added `isValidEmail()` function
- Uses regex pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Handles null/undefined values safely

**Files Updated to Use Centralized Function**:
- `apps/web/src/hooks/useLoginForm.ts` (removed, but would use it if needed)
- `apps/web/src/pages/authenticated/auth/login/components/LoginActions.tsx` (removed, but would use it if needed)

### Step 10: Verify Auth Callback Handler

**File Modified**: `apps/web/src/routes/auth/callback.tsx`

Verified that the existing callback handler works correctly with magic link tokens.

**Verification**:
- The callback uses `supabase.auth.getSession()` which works for both OAuth and magic links
- Magic links use URL hash fragments like OAuth
- User creation logic works for new magic link users
- No changes were needed to the existing implementation

## Files Created

1. `apps/web/src/hooks/useMagicLinkForm.ts` - Magic link form hook
2. `apps/web/src/pages/authenticated/auth/login/magic-link/index.tsx` - Magic link page component
3. `apps/web/src/routes/login/magic-link.tsx` - Route configuration

## Files Modified

1. `apps/web/src/routes/login.tsx` - Added layout component with Outlet support
2. `apps/web/src/pages/authenticated/auth/login/components/LoginActions.tsx` - Added navigation to magic link page
3. `apps/web/src/hooks/useLoginForm.ts` - Removed magic link logic
4. `apps/web/src/pages/authenticated/auth/login/index.tsx` - Removed magic link props
5. `apps/web/src/pages/authenticated/auth/login/components/EmailField.tsx` - Made component generic
6. `apps/web/src/lib/formatters.ts` - Added `isValidEmail()` function
7. `apps/web/src/routes/auth/callback.tsx` - Updated comment to clarify magic link support

## Supabase Configuration

### Required Settings

1. **Enable Magic Link**:
   - Navigate to: Authentication → Emails → Magic link
   - Ensure magic link is enabled
   - Default template should include `{{ .ConfirmationURL }}`

2. **Configure Redirect URLs**:
   - Navigate to: Authentication → URL Configuration
   - **Site URL**: `http://localhost:8080` (dev) or production URL
   - **Redirect URLs**: Must include `/auth/callback`
     - Development: `http://localhost:8080/auth/callback`
     - Production: `https://yourdomain.com/auth/callback`

3. **Email Template** (Optional):
   - Customize the magic link email template in Authentication → Email Templates
   - Default template works out of the box

### Email Redirect Configuration

The magic link email uses the `emailRedirectTo` option when calling `signInWithOtp`:

```typescript
await supabase.auth.signInWithOtp({
  email: emailValue,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

This ensures the magic link redirects to the correct callback URL.

## User Flow

### Normal Flow

1. User visits `/login`
2. User clicks "Sign in with Magic Link" button
3. User is redirected to `/login/magic-link`
4. User enters email address
5. User clicks "Send Magic Link"
6. Success message appears: "Check your email for the magic link!"
7. User receives email with magic link
8. User clicks link in email
9. Browser redirects to `/auth/callback`
10. Callback handler processes authentication
11. User is redirected to `/dashboard`

### Error Handling

- **Invalid Email**: Form validation prevents submission
- **Network Error**: Toast notification shows error message
- **Supabase Error**: Error message from Supabase is displayed
- **Resend**: User can click "Resend" button to send another email

## Technical Details

### Route Structure

```
/login (parent route)
  └── /login/magic-link (child route)
```

The parent route uses conditional rendering:
- If pathname is `/login/magic-link` → render `<Outlet />` (child route)
- Otherwise → render `<LoginPage />` (main login)

### Form Validation

Magic link form uses Zod schema:
```typescript
const magicLinkSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});
```

### State Management

The `useMagicLinkForm` hook manages:
- Form state (via React Hook Form)
- Loading state (`isLoading`)
- Email sent state (`isEmailSent`)
- Email value (for resend functionality)

### Security Considerations

1. **Token Expiration**: Magic links expire after 1 hour (Supabase default)
2. **One-Time Use**: Each magic link can only be used once
3. **HTTPS Required**: In production, ensure HTTPS is enabled
4. **Email Verification**: Supabase handles email verification automatically

## Testing Checklist

- [ ] Navigate to `/login` and verify login form appears
- [ ] Click "Sign in with Magic Link" and verify redirect to `/login/magic-link`
- [ ] Verify only email field is shown (no password field)
- [ ] Enter invalid email and verify validation error
- [ ] Enter valid email and click "Send Magic Link"
- [ ] Verify success message appears with email address
- [ ] Check email inbox for magic link
- [ ] Click magic link in email
- [ ] Verify redirect to `/auth/callback` then `/dashboard`
- [ ] Test "Resend" button functionality
- [ ] Test "Back to Login" navigation
- [ ] Verify user record is created in database for new users
- [ ] Test with existing user account
- [ ] Test error handling (network errors, invalid tokens)

## Troubleshooting

### Issue: URL changes but page doesn't update

**Solution**: Ensure the parent route (`/login`) uses `<Outlet />` to render child routes. See Step 4.

### Issue: Magic link email not received

**Possible Causes**:
1. Check spam/junk folder
2. Verify email address is correct
3. Check Supabase email logs
4. Verify SMTP configuration (if using custom SMTP)

### Issue: Redirect URL mismatch

**Solution**: Ensure the redirect URL in Supabase Dashboard matches exactly what's in the code:
- Code: `${window.location.origin}/auth/callback`
- Supabase: Must include `/auth/callback` in Redirect URLs

### Issue: "Invalid token" error

**Possible Causes**:
1. Token expired (1 hour limit)
2. Token already used
3. URL hash fragment not preserved

## Future Enhancements

Potential improvements:
1. Add rate limiting for magic link requests
2. Add "Remember this device" option
3. Custom email template branding
4. Magic link expiration customization
5. Analytics tracking for magic link usage
6. A/B testing between password and magic link flows

## Code Explanation for Beginners

This section provides a detailed, beginner-friendly explanation of each code file. We'll break down what each part does and why it's needed.

### File 1: `useMagicLinkForm.ts` - The Form Logic Hook

**What is a Hook?**
A hook in React is a special function that lets you "hook into" React features like state management. Custom hooks (like this one) let us reuse logic across components.

**Full Code Breakdown:**

```typescript
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
```

**What this does:**
- `useState`: React's built-in hook for managing component state (like remembering if a button was clicked)
- `useForm`: From React Hook Form library - helps manage form inputs, validation, and submission
- `zodResolver`: Connects Zod (validation library) with React Hook Form
- `z`: Zod library for creating validation rules
- `toast`: Shows popup notifications to users (success/error messages)
- `supabase`: Our database and authentication service

```typescript
const magicLinkSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});
```

**What this does:**
This creates a validation "rule book" for our form. It says:
- The email field must be a string (text)
- It must have at least 1 character (not empty)
- It must be a valid email format (has @ and domain)
- If validation fails, show the error messages provided

**Think of it like:** A bouncer at a club checking IDs - it only lets valid emails through.

```typescript
export type MagicLinkFormData = z.infer<typeof magicLinkSchema>;
```

**What this does:**
TypeScript automatically creates a type definition from our schema. This gives us autocomplete and type checking in our code.

**Example:** TypeScript now knows that `MagicLinkFormData` has an `email` property that's a string.

```typescript
export const useMagicLinkForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailValue, setEmailValue] = useState<string>("");
```

**What this does:**
Creates three pieces of state (memory) for our component:
- `isLoading`: Tracks if we're currently sending the email (true/false)
- `isEmailSent`: Tracks if the email was successfully sent (true/false)
- `emailValue`: Stores the email address the user entered

**Why we need this:**
- `isLoading`: So we can show "Sending..." on the button and disable it while sending
- `isEmailSent`: So we can show the success message instead of the form
- `emailValue`: So we can resend the email if needed

```typescript
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
    mode: "onChange",
  });
```

**What this does:**
Sets up React Hook Form with our validation rules:
- `register`: Function to connect form inputs to the form system
- `handleSubmit`: Function that runs when form is submitted (after validation)
- `watch`: Lets us watch/read the current value of form fields
- `errors`: Object containing any validation errors
- `isValid`: Boolean telling us if the form is currently valid

**The options:**
- `resolver: zodResolver(magicLinkSchema)`: Use our Zod schema for validation
- `mode: "onChange"`: Validate as the user types (not just on submit)

```typescript
  const onSubmit = async (data: MagicLinkFormData) => {
    setIsLoading(true);
    setEmailValue(data.email);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message || "Failed to send magic link. Please try again.");
      } else {
        toast.success("Check your email for the magic link!");
        setIsEmailSent(true);
      }
    } catch (error: any) {
      console.error("Magic link error:", error);
      toast.error(error.message || "Failed to send magic link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
```

**What this does (step by step):**

1. **`setIsLoading(true)`**: Turn on loading state (button shows "Sending...")
2. **`setEmailValue(data.email)`**: Save the email so we can resend later
3. **`async`**: This function can wait for things (like API calls) to finish
4. **`try/catch/finally`**: Error handling structure
   - `try`: Try to do something, if it fails...
   - `catch`: Handle the error
   - `finally`: Always run this (turn off loading)

5. **`supabase.auth.signInWithOtp()`**: 
   - Asks Supabase to send a magic link email
   - `email`: The user's email address
   - `emailRedirectTo`: Where to send the user after they click the link

6. **Error handling**:
   - If error: Show error message to user
   - If success: Show success message and mark email as sent

7. **`setIsLoading(false)`**: Always turn off loading when done

**Real-world analogy:** Like ordering food online - you click "Order", it shows "Processing...", then either "Order confirmed!" or "Error occurred".

```typescript
  const handleResend = async () => {
    if (!emailValue) {
      setIsEmailSent(false);
      return;
    }

    setIsLoading(true);
    // ... (similar to onSubmit, sends email again)
  };
```

**What this does:**
Allows user to request another magic link email. Uses the saved `emailValue` so they don't have to type it again.

```typescript
  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isValid,
    isLoading,
    isEmailSent,
    emailValue: emailValue || watchedEmail || "",
    handleResend,
  };
};
```

**What this does:**
Returns everything the component needs to use. Think of it as a "toolbox" - the component gets all these tools to build the form.

---

### File 2: `magic-link/index.tsx` - The Page Component

**What is a Component?**
A component is like a LEGO block - a reusable piece of UI. This component is the entire magic link page.

**Full Code Breakdown:**

```typescript
import { useMagicLinkForm } from "@/hooks/useMagicLinkForm";
import { Logo } from "../components/Logo";
import { EmailField } from "../components/EmailField";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Mail, ArrowLeft } from "lucide-react";
import { DashboardPreview } from "../components/DashboardPreview";
```

**What this does:**
Imports all the pieces we need:
- Our custom hook (the form logic)
- UI components (Logo, EmailField, Button)
- Router's Link component (for navigation)
- Icons (Mail, ArrowLeft)
- Dashboard preview (the right side of the page)

```typescript
export function MagicLinkLoginPage() {
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
  } = useMagicLinkForm();
```

**What this does:**
- Creates the component function
- Gets all the tools from our hook (like opening the toolbox)

```typescript
  if (isEmailSent) {
    return (
      // Success message UI
    );
  }
```

**What this does:**
Conditional rendering - if email was sent, show the success screen instead of the form.

**Why:** Better user experience - they don't need to see the form again, just confirmation.

```typescript
  return (
    <main className="flex flex-col lg:flex-row w-full min-h-screen overflow-hidden">
      <section className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col justify-center bg-white">
```

**What this does:**
- `main`: The main container for the page
- `className`: Tailwind CSS classes for styling
  - `flex flex-col lg:flex-row`: Stack vertically on mobile, side-by-side on large screens
  - `w-full`: Full width
  - `min-h-screen`: At least full screen height
- `section`: Left half of the page (form area)

**CSS Explanation:**
- `flex`: Makes items arrange in a row or column
- `flex-col`: Stack vertically (mobile)
- `lg:flex-row`: Side-by-side on large screens (desktop)
- `w-1/2`: Half width
- `p-4 sm:p-8`: Padding (spacing inside) - 4 units on mobile, 8 on larger screens

```typescript
        <div className="max-w-lg mx-auto w-full px-4 sm:px-0 min-h-screen">
          <Logo />
```

**What this does:**
- `max-w-lg`: Maximum width (so form doesn't stretch too wide on large screens)
- `mx-auto`: Center horizontally (margin: auto)
- Shows the logo at the top

```typescript
          <div className="mb-6">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
          </div>
```

**What this does:**
- Creates a "Back to Login" link
- `Link`: Router component (like `<a>` tag but for single-page app navigation)
- `to="/login"`: Where to navigate when clicked
- `ArrowLeft`: Left arrow icon
- `hover:text-foreground`: Changes color when mouse hovers

```typescript
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <EmailField register={register} errors={errors} />

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
              disabled={!isValid || isLoading}
            >
              <Mail className="h-4 w-4" />
              {isLoading ? "Sending..." : "Send Magic Link"}
            </Button>
          </form>
```

**What this does:**
- `form`: HTML form element
- `onSubmit={handleSubmit(onSubmit)}`: When form is submitted:
  1. `handleSubmit` validates the form
  2. If valid, calls `onSubmit` function
  3. If invalid, shows errors

- `EmailField`: Our reusable email input component
  - `register={register}`: Connects it to the form system
  - `errors={errors}`: Passes validation errors to show

- `Button`:
  - `type="submit"`: Makes it submit the form when clicked
  - `disabled={!isValid || isLoading}`: Disable button if:
    - Form is invalid (`!isValid`)
    - OR currently sending (`isLoading`)
  - `{isLoading ? "Sending..." : "Send Magic Link"}`: 
    - If loading: Show "Sending..."
    - Otherwise: Show "Send Magic Link"
    - This is called a "ternary operator" (shorthand if/else)

**Success State Code:**

```typescript
  if (isEmailSent) {
    return (
      <main>
        {/* ... layout ... */}
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <Mail className="h-12 w-12 text-green-600" />
            <div className="space-y-2">
              <p className="text-base font-medium text-green-900">
                Check your email
              </p>
              <p className="text-sm text-green-700">
                We've sent a magic link to <strong>{emailValue}</strong>
              </p>
```

**What this does:**
Shows a green success box with:
- Large mail icon
- "Check your email" heading
- Email address in bold (`<strong>`)
- `{emailValue}`: Inserts the actual email address (this is JSX interpolation)

```typescript
              <div className="flex gap-2 mt-4 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResend}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Sending..." : "Resend"}
                </Button>
                <Link to="/login">
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>
```

**What this does:**
Two buttons side by side:
- **Resend**: Calls `handleResend` function to send another email
- **Back to Login**: Navigates back to `/login` page

**Key Concepts:**
- `onClick={handleResend}`: When clicked, run this function
- `variant="outline"`: Button style (outlined border)
- `variant="ghost"`: Button style (transparent background)
- `flex-1`: Each button takes equal space

---

### File 3: `routes/login.tsx` - Route Configuration

**What is Routing?**
Routing decides which component to show based on the URL. Like a GPS for your app - `/login` shows login page, `/dashboard` shows dashboard.

**Full Code Breakdown:**

```typescript
import { createFileRoute, redirect, Outlet, useLocation } from "@tanstack/react-router";
import { LoginPage } from "@/pages/authenticated/auth/login";
import { supabase } from "@/integrations/supabase/client";
```

**What this does:**
- `createFileRoute`: TanStack Router function to create a route
- `redirect`: Function to redirect users to another page
- `Outlet`: Special component that renders child routes
- `useLocation`: Hook to get current URL/pathname
- `LoginPage`: The main login component
- `supabase`: For checking if user is logged in

```typescript
export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    // If user is already authenticated, redirect to dashboard
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginLayout,
});
```

**What this does:**
Creates the `/login` route with:
- `beforeLoad`: Runs BEFORE the page loads
  - Checks if user is already logged in
  - If logged in: Redirect to dashboard (no need to login again)
  - `throw redirect`: Stops loading this page and goes to dashboard
- `component: LoginLayout`: The component to render for this route

**Why `beforeLoad`?**
Prevents logged-in users from seeing the login page unnecessarily.

```typescript
function LoginLayout() {
  const location = useLocation();
  const isMagicLinkRoute = location.pathname === "/login/magic-link";
  
  // If we're on the magic link route, render the outlet (child route)
  // Otherwise, render the LoginPage
  if (isMagicLinkRoute) {
    return <Outlet />;
  }
  
  return <LoginPage />;
}
```

**What this does (step by step):**

1. **`useLocation()`**: Gets current URL information
   - `location.pathname`: The path part of URL (e.g., "/login/magic-link")

2. **`isMagicLinkRoute`**: Checks if we're on the magic link page
   - `===`: Strict equality check (must be exactly "/login/magic-link")

3. **Conditional rendering**:
   - If on magic link route: Render `<Outlet />` (shows child route component)
   - Otherwise: Render `<LoginPage />` (shows main login page)

**Why we need this:**
TanStack Router needs parent routes to use `<Outlet />` to show child routes. Without this, the child route (`/login/magic-link`) wouldn't render.

**Real-world analogy:**
Like a TV remote - the parent route is the remote, `<Outlet />` is the button that changes the channel (shows different pages).

---

### File 4: `routes/login/magic-link.tsx` - Child Route

```typescript
import { createFileRoute, redirect } from "@tanstack/react-router";
import { MagicLinkLoginPage } from "@/pages/authenticated/auth/login/magic-link";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login/magic-link")({
  beforeLoad: async () => {
    // If user is already authenticated, redirect to dashboard
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: MagicLinkLoginPage,
});
```

**What this does:**
Creates the `/login/magic-link` route:
- **Path**: `/login/magic-link` (child of `/login`)
- **beforeLoad**: Same check as parent - redirect if already logged in
- **component**: Shows `MagicLinkLoginPage` when this route is active

**Why it's a child route:**
- Keeps URL structure organized (`/login` → `/login/magic-link`)
- Can share `beforeLoad` logic with parent
- Parent route handles the layout/outlet logic

---

### File 5: `components/LoginActions.tsx` - Navigation Button

**Simplified version showing just the magic link button:**

```typescript
import { useNavigate } from "@tanstack/react-router";
import { Mail } from "lucide-react";

export const LoginActions = ({ isValid, isLoading, isLoaded }: LoginActionsProps) => {
  const navigate = useNavigate();

  const handleMagicLinkClick = () => {
    navigate({ to: "/login/magic-link" });
  };

  return (
    <>
      {/* ... other buttons ... */}
      
      <Button
        type="button"
        variant="outline"
        onClick={handleMagicLinkClick}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2"
      >
        <Mail className="h-4 w-4" />
        Sign in with Magic Link
      </Button>
    </>
  );
};
```

**What this does:**
- `useNavigate()`: Gets navigation function from router
- `handleMagicLinkClick`: Function that runs when button is clicked
  - `navigate({ to: "/login/magic-link" })`: Changes URL to magic link page
- Button with mail icon that triggers navigation

**Why `type="button"`?**
Prevents the button from submitting the form (since it's inside a form element).

---

## How It All Works Together

### The Complete Flow:

1. **User visits `/login`**
   - Route system loads `LoginLayout`
   - `LoginLayout` sees pathname is `/login` (not magic-link)
   - Renders `<LoginPage />`
   - User sees email + password form

2. **User clicks "Sign in with Magic Link"**
   - `LoginActions` component's button calls `handleMagicLinkClick()`
   - `navigate({ to: "/login/magic-link" })` changes URL
   - Browser URL bar shows `/login/magic-link`

3. **Route system detects URL change**
   - `LoginLayout` runs again (React re-renders)
   - `useLocation()` gets new pathname: `/login/magic-link`
   - `isMagicLinkRoute` becomes `true`
   - Renders `<Outlet />` instead of `<LoginPage />`

4. **Child route renders**
   - `/login/magic-link` route's component (`MagicLinkLoginPage`) renders
   - User sees email-only form

5. **User submits form**
   - `useMagicLinkForm` hook's `onSubmit` runs
   - Calls Supabase to send email
   - Updates state: `isEmailSent = true`
   - Component re-renders, shows success message

6. **User clicks magic link in email**
   - Browser goes to `/auth/callback` with token in URL
   - Callback handler processes authentication
   - User redirected to `/dashboard`

### Key React Concepts Used:

1. **State Management**: `useState` to remember things (loading, email sent, etc.)
2. **Custom Hooks**: `useMagicLinkForm` to reuse form logic
3. **Conditional Rendering**: `if (isEmailSent)` to show different UI
4. **Event Handlers**: `onClick`, `onSubmit` to respond to user actions
5. **Props**: Passing data between components (`register`, `errors`, etc.)
6. **Async/Await**: Handling API calls that take time

### Why This Architecture?

1. **Separation of Concerns**:
   - Hook = Logic (what to do)
   - Component = UI (what to show)
   - Route = Navigation (where to go)

2. **Reusability**:
   - `EmailField` can be used in multiple forms
   - `useMagicLinkForm` could be used elsewhere if needed

3. **Maintainability**:
   - Each file has one clear purpose
   - Easy to find and fix bugs
   - Easy to add features

4. **User Experience**:
   - Clear navigation flow
   - Loading states prevent confusion
   - Error messages help users understand problems

## Common Beginner Questions

### Q: Why use `async/await`?
**A:** API calls (like sending emails) take time. `async/await` lets us wait for them to finish before continuing, so we can show success/error messages at the right time.

### Q: What's the difference between `useState` and regular variables?
**A:** `useState` creates "reactive" variables. When they change, React automatically re-renders the component to show the new value. Regular variables don't trigger re-renders.

### Q: Why use a custom hook instead of putting everything in the component?
**A:** 
- Keeps components clean and focused on UI
- Makes logic reusable
- Easier to test
- Better organization

### Q: What does `<Outlet />` do?
**A:** It's a placeholder that says "render the child route component here". Like a picture frame - the frame stays the same, but you can put different pictures in it.

### Q: Why check `isValid` before enabling the button?
**A:** Prevents users from submitting invalid forms, which would waste time and show confusing errors. Better UX to disable the button until the form is valid.

## References

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Magic Link Guide](https://supabase.com/docs/guides/auth/auth-magic-link)
- [TanStack Router Documentation](https://tanstack.com/router/latest)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [React useState Hook](https://react.dev/reference/react/useState)
- [TypeScript Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)
