# Clerk Redirect Fix - COM-1575

## Issue
Users were being redirected to `comfydeploy.com` instead of `app.comfydeploy.com` after signing up with Clerk.

## Root Cause
The Clerk configuration in the frontend application was missing explicit redirect URLs for after sign-up and sign-in actions. Without these configured, Clerk was using default behavior which redirected to the base domain instead of the app subdomain.

## Solution Implemented

### 1. Updated ClerkProvider Configuration
Modified `src/main.tsx` to include proper redirect URLs:

```typescript
<ClerkProvider
  // ... other props
  afterSignUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL || "/workflows"}
  afterSignInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL || "/workflows"}
  signUpFallbackRedirectUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL}
  signInFallbackRedirectUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL}
>
```

### 2. Added Environment Variables
Added new environment variables to `.env.example`:

```env
# Clerk redirect URLs - ensure users are redirected to the correct domain after auth
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=https://app.comfydeploy.com/workflows
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=https://app.comfydeploy.com/workflows
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=https://app.comfydeploy.com/workflows
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=https://app.comfydeploy.com/workflows
```

### 3. Updated Build Configurations
Updated both `vite.config.ts` and `rsbuild.config.ts` to include the new environment variables in the build process.

## Deployment Steps Required

### 1. Set Environment Variables
In your production deployment environment, set the following environment variables:

```bash
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=https://app.comfydeploy.com/workflows
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=https://app.comfydeploy.com/workflows
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=https://app.comfydeploy.com/workflows
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=https://app.comfydeploy.com/workflows
```

### 2. Verify Clerk Dashboard Settings
In the Clerk dashboard (https://dashboard.clerk.com), ensure that:

1. **Allowed redirect URLs** include:
   - `https://app.comfydeploy.com/workflows`
   - `https://app.comfydeploy.com/*` (if you want to allow any path)

2. **Sign-up redirect URL** is set to:
   - `https://app.comfydeploy.com/workflows`

3. **Sign-in redirect URL** is set to:
   - `https://app.comfydeploy.com/workflows`

### 3. Deploy and Test
1. Deploy the updated code with the new environment variables
2. Test the sign-up flow to ensure users are redirected to `app.comfydeploy.com/workflows`
3. Test the sign-in flow to ensure the same behavior

## How It Works

1. **Force Redirect URLs**: These URLs will always be used after authentication, overriding any other redirect settings
2. **Fallback Redirect URLs**: These serve as backup URLs if no other redirect URL is specified
3. **Environment Variable Fallback**: If environment variables are not set, the application defaults to `/workflows` (relative path)

## Testing

To test locally:
1. Set the environment variables in your local `.env` file
2. Start the development server
3. Go through the sign-up flow
4. Verify you're redirected to the correct URL

## Notes

- The `vercel.json` configuration already properly handles routing for `app.comfydeploy.com`
- This fix ensures consistent behavior across all authentication flows
- The environment variables allow for different configurations in different environments (staging, production, etc.)