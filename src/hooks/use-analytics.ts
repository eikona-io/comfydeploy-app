import { usePostHog } from "posthog-js/react";
import { useCallback } from "react";

/**
 * Custom hook for PostHog analytics with safe fallbacks
 * This hook provides a safe interface to PostHog analytics that gracefully handles
 * cases where PostHog is not initialized (e.g., when VITE_PUBLIC_POSTHOG_KEY is not set)
 */
export function useAnalytics() {
  const posthog = usePostHog();
  const isEnabled = !!process.env.VITE_PUBLIC_POSTHOG_KEY && !!posthog;

  const track = useCallback(
    (eventName: string, properties?: Record<string, any>) => {
      if (!isEnabled) return;
      posthog.capture(eventName, properties);
    },
    [posthog, isEnabled],
  );

  const identify = useCallback(
    (userId: string, properties?: Record<string, any>) => {
      if (!isEnabled) return;
      posthog.identify(userId, properties);
    },
    [posthog, isEnabled],
  );

  const setPersonProperties = useCallback(
    (properties: Record<string, any>) => {
      if (!isEnabled) return;
      posthog.setPersonProperties(properties);
    },
    [posthog, isEnabled],
  );

  const setPersonPropertiesForFlags = useCallback(
    (properties: Record<string, any>) => {
      if (!isEnabled) return;
      posthog.setPersonPropertiesForFlags(properties);
    },
    [posthog, isEnabled],
  );

  const reset = useCallback(() => {
    if (!isEnabled) return;
    posthog.reset();
  }, [posthog, isEnabled]);

  const isFeatureEnabled = useCallback(
    (flagKey: string, defaultValue = false) => {
      if (!isEnabled) return defaultValue;
      return posthog.isFeatureEnabled(flagKey) ?? defaultValue;
    },
    [posthog, isEnabled],
  );

  const getFeatureFlag = useCallback(
    (flagKey: string, defaultValue?: any) => {
      if (!isEnabled) return defaultValue;
      return posthog.getFeatureFlag(flagKey) ?? defaultValue;
    },
    [posthog, isEnabled],
  );

  return {
    track,
    identify,
    setPersonProperties,
    setPersonPropertiesForFlags,
    reset,
    isFeatureEnabled,
    getFeatureFlag,
    isEnabled,
    posthog: isEnabled ? posthog : null,
  };
}
