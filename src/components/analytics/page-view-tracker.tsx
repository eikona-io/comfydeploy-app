import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { useAnalytics } from "@/hooks/use-analytics";

/**
 * Component to track page views manually
 * This should be placed in the root of your app to track all route changes
 */
export function PageViewTracker() {
  const location = useLocation();
  const { track, isEnabled } = useAnalytics();

  useEffect(() => {
    if (!isEnabled) return;

    // Track page view on route change
    track("$pageview", {
      $current_url: window.location.href,
      $pathname: location.pathname,
      $search: location.search,
    });
  }, [location.pathname, location.search, track, isEnabled]);

  return null;
}