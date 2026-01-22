# Google OAuth Setup Guide

This guide will walk you through setting up Google OAuth authentication for your Cofrinio application.

## Prerequisites

- A Supabase project
- A Google Cloud Platform account
- Access to your Supabase project dashboard

---

## Step 1: Create OAuth Credentials in Google Cloud Console

### 1.1. Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project or select an existing one

### 1.2. Enable Google+ API

1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google+ API" or "Google Identity Services"
3. Click on it and click **Enable**

### 1.3. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. If prompted, configure the OAuth consent screen first:
   - **User Type**: External (for testing) or Internal (for Google Workspace)
   - **App name**: Cofrinio (or your app name)
   - **User support email**: Your email
   - **Developer contact information**: Your email
   - Click **Save and Continue**
   - Add scopes (optional): `email`, `profile`, `openid`
   - Click **Save and Continue**
   - Add test users if needed (for external apps)
   - Click **Save and Continue**
   - Review and click **Back to Dashboard**

4. Now create the OAuth client:
   - **Application type**: Web application
   - **Name**: Cofrinio Web Client (or any name)
   - **Authorized JavaScript origins**:
     ```
     https://your-project-id.supabase.co
     ```
     Replace `your-project-id` with your actual Supabase project ID
   
   - **Authorized redirect URIs**:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
     Replace `your-project-id` with your actual Supabase project ID

5. Click **Create**
6. **IMPORTANT**: Copy the **Client ID** and **Client Secret** - you'll need these in the next step

---

## Step 2: Configure Google OAuth in Supabase

### 2.1. Enable Google Provider

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** > **Providers** (or **Settings** > **Auth** > **Providers**)
4. Find **Google** in the list of providers
5. Click **Enable** or toggle it on

### 2.2. Enter OAuth Credentials

1. In the Google provider settings, enter:
   - **Client ID (for OAuth)**: Paste the Client ID from Google Cloud Console
   - **Client Secret (for OAuth)**: Paste the Client Secret from Google Cloud Console

2. Click **Save**

---

## Step 3: Configure Redirect URLs in Supabase

### 3.1. Set Site URL

1. In Supabase Dashboard, go to **Authentication** > **URL Configuration**
2. Set **Site URL**:
   - For development: `http://localhost:5173` (or your dev port)
   - For production: `https://yourdomain.com`

### 3.2. Add Redirect URLs

1. In the same **URL Configuration** section
2. Under **Redirect URLs**, add:
   - For development: `http://localhost:5173/auth/callback`
   - For production: `https://yourdomain.com/auth/callback`

3. Click **Save**

**Important**: The redirect URLs must match exactly what's in your code (`/auth/callback`)

---

## Step 4: Verify Configuration

### 4.1. Check Provider Status

1. Go to **Authentication** > **Providers**
2. Verify that **Google** shows as **Enabled** (green toggle)

### 4.2. Test the Flow

1. Start your development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. Navigate to your login page
3. Click "Entrar com o Google" or "Registrar com o Google"
4. You should be redirected to Google's sign-in page
5. After signing in, you should be redirected back to `/auth/callback`
6. You should then be redirected to `/dashboard`

---

## Troubleshooting

### Error: "Unsupported provider: provider is not enabled"

**Solution**: 
- Go to Supabase Dashboard > **Authentication** > **Providers**
- Make sure **Google** is toggled **ON** (enabled)
- Verify that Client ID and Client Secret are entered correctly

### Error: "redirect_uri_mismatch"

**Solution**:
- Check that the redirect URI in Google Cloud Console matches exactly:
  - `https://your-project-id.supabase.co/auth/v1/callback`
- Check that the redirect URL in Supabase matches your app:
  - Development: `http://localhost:5173/auth/callback`
  - Production: `https://yourdomain.com/auth/callback`

### Error: "invalid_client"

**Solution**:
- Verify that Client ID and Client Secret in Supabase match those from Google Cloud Console
- Make sure there are no extra spaces when copying/pasting
- Regenerate credentials in Google Cloud Console if needed

### OAuth works but user is not created in usuarios table

**Solution**:
- Check the browser console for errors
- Verify that RLS policies allow INSERT on usuarios table
- Check that the callback route (`/auth/callback`) is working correctly
- Verify that `auth_user_id` column exists in `usuarios` table

### Redirect loop or stuck on callback page

**Solution**:
- Clear browser cache and localStorage
- Check that the callback route is properly handling the session
- Verify that `detectSessionInUrl: true` is set in Supabase client config
- Check browser console for JavaScript errors

---

## Production Checklist

Before deploying to production:

- [ ] Update **Site URL** in Supabase to your production domain
- [ ] Add production redirect URL: `https://yourdomain.com/auth/callback`
- [ ] Update **Authorized JavaScript origins** in Google Cloud Console to include production domain
- [ ] Update **Authorized redirect URIs** in Google Cloud Console to include production domain
- [ ] Test the complete OAuth flow in production
- [ ] Verify that users are created correctly in the `usuarios` table
- [ ] Test that RLS policies work correctly for new OAuth users

---

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase OAuth Providers Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)
