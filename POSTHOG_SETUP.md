# PostHog Analytics Setup

PostHog has been successfully installed and configured in this frontend application. This document explains the setup and how to use it.

## Installation Status ✅

- **Package**: `posthog-js@^1.200.1` is already installed
- **React Integration**: `posthog-js/react` provider is configured
- **TypeScript Support**: Custom hooks and types are implemented
- **Environment Configuration**: Proper environment variable handling

## Configuration

### Environment Variables

PostHog requires the following environment variables:

```bash
# Required for PostHog to work
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_project_key_here

# Optional - defaults to https://app.posthog.com
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

**Note**: If `NEXT_PUBLIC_POSTHOG_KEY` is not set, PostHog will be disabled gracefully without breaking the app.

### Current Setup

1. **Initialization** (`src/lib/providers.tsx`):
   - PostHog is initialized with privacy-friendly settings
   - Automatic pageview capture is disabled (we handle it manually)
   - Debug mode is enabled in development
   - Session recording is configured with input masking

2. **User Identification** (`src/lib/providers.tsx`):
   - Automatic user identification when users sign in via Clerk
   - Organization context is tracked for multi-tenant features
   - User properties include email, name, and organization info

3. **Page View Tracking** (`src/components/analytics/page-view-tracker.tsx`):
   - Manual page view tracking on route changes
   - Includes pathname and search parameters

## Usage

### Using the Custom Hook

The recommended way to use PostHog is through the custom `useAnalytics` hook:

```typescript
import { useAnalytics } from "@/hooks/use-analytics";

function MyComponent() {
  const { track, isEnabled, isFeatureEnabled } = useAnalytics();

  const handleButtonClick = () => {
    track("button_clicked", {
      button_name: "subscribe",
      location: "header",
      user_type: "premium"
    });
  };

  const showNewFeature = isFeatureEnabled("new_dashboard_ui", false);

  if (!isEnabled) {
    // PostHog is disabled, handle gracefully
    return <div>Analytics disabled</div>;
  }

  return (
    <button onClick={handleButtonClick}>
      {showNewFeature ? "New Subscribe" : "Subscribe"}
    </button>
  );
}
```

### Available Methods

The `useAnalytics` hook provides these methods:

- `track(eventName, properties)` - Track custom events
- `identify(userId, properties)` - Identify users (usually handled automatically)
- `setPersonProperties(properties)` - Set user properties
- `setPersonPropertiesForFlags(properties)` - Set properties for feature flags
- `reset()` - Reset user session
- `isFeatureEnabled(flagKey, defaultValue)` - Check feature flags
- `getFeatureFlag(flagKey, defaultValue)` - Get feature flag values
- `isEnabled` - Check if PostHog is enabled
- `posthog` - Access raw PostHog instance (when enabled)

### Direct PostHog Usage (Not Recommended)

If you need to use PostHog directly:

```typescript
import { usePostHog } from "posthog-js/react";

function MyComponent() {
  const posthog = usePostHog();
  
  // Always check if PostHog is available
  if (!posthog || !process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return null;
  }

  posthog.capture("custom_event", { property: "value" });
}
```

## Testing

### Development Testing

A test component is available in development mode:

```typescript
import { AnalyticsTest } from "@/components/analytics/analytics-test";

// This component will show PostHog status and allow testing events
<AnalyticsTest />
```

### Verifying Setup

1. **Check Console**: In development, you should see "PostHog loaded successfully" in the console
2. **Network Tab**: Look for requests to your PostHog host (default: app.posthog.com)
3. **PostHog Dashboard**: Events should appear in your PostHog project dashboard

## Privacy & Compliance

The current configuration is privacy-friendly:

- **Input Masking**: All form inputs are masked in session recordings
- **Selective Autocapture**: Text content capture is disabled
- **Manual Tracking**: Only explicitly tracked events are sent
- **Graceful Degradation**: App works fine when analytics are disabled

## Common Events to Track

Consider tracking these events for better insights:

```typescript
// User engagement
track("workflow_created", { workflow_type: "image_generation" });
track("deployment_started", { environment: "production" });
track("feature_used", { feature_name: "custom_nodes" });

// Business metrics
track("subscription_upgraded", { from_plan: "free", to_plan: "pro" });
track("payment_completed", { amount: 29.99, currency: "USD" });

// User journey
track("onboarding_step_completed", { step: 3, total_steps: 5 });
track("tutorial_finished", { tutorial_name: "getting_started" });
```

## Feature Flags

PostHog feature flags can be used to:

- **A/B Test**: Test different UI variations
- **Gradual Rollouts**: Roll out features to specific user segments
- **Kill Switches**: Quickly disable features if issues arise

```typescript
const { isFeatureEnabled } = useAnalytics();

const showBetaFeatures = isFeatureEnabled("beta_features", false);
const dashboardVariant = getFeatureFlag("dashboard_variant", "default");
```

## Troubleshooting

### PostHog Not Working

1. **Check Environment Variables**: Ensure `NEXT_PUBLIC_POSTHOG_KEY` is set
2. **Check Console**: Look for PostHog-related errors or warnings
3. **Network Issues**: Verify requests are reaching PostHog servers
4. **Ad Blockers**: Some ad blockers may block PostHog requests

### Common Issues

- **Events Not Appearing**: Check if the PostHog key is correct and the project exists
- **User Not Identified**: Ensure Clerk authentication is working properly
- **Feature Flags Not Working**: Verify the flag exists in PostHog and is enabled

### Debug Mode

In development, PostHog runs in debug mode and logs additional information to the console.

## Next Steps

1. **Set Environment Variables**: Add your PostHog project key to your environment
2. **Start Tracking**: Begin tracking key user actions and business metrics
3. **Set Up Feature Flags**: Create feature flags for new features you want to test
4. **Monitor Dashboard**: Regularly check your PostHog dashboard for insights

## Files Modified/Created

- ✅ `src/lib/providers.tsx` - PostHog initialization and user identification
- ✅ `src/hooks/use-analytics.ts` - Custom analytics hook
- ✅ `src/components/analytics/page-view-tracker.tsx` - Page view tracking
- ✅ `src/components/analytics/analytics-test.tsx` - Development testing component
- ✅ `.env.example` - Environment variable documentation
- ✅ `POSTHOG_SETUP.md` - This documentation file

PostHog is now ready to use! 🎉