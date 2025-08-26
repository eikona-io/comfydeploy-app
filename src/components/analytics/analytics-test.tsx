import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/use-analytics";

/**
 * Test component for verifying PostHog analytics integration
 * This component should only be used in development mode
 */
export function AnalyticsTest() {
  const { track, isEnabled } = useAnalytics();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const handleTestEvent = () => {
    track("test_analytics_event", {
      test_property: "test_value",
      timestamp: new Date().toISOString(),
      source: "analytics_test_component",
    });
    
    console.log("Test analytics event sent!");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg border bg-white p-4 shadow-lg">
      <div className="mb-2 text-sm font-medium">
        PostHog Status: {isEnabled ? "✅ Enabled" : "❌ Disabled"}
      </div>
      <Button
        size="sm"
        onClick={handleTestEvent}
        disabled={!isEnabled}
        variant={isEnabled ? "default" : "secondary"}
      >
        Test Analytics
      </Button>
      {!isEnabled && (
        <div className="mt-2 text-xs text-gray-500">
          Set NEXT_PUBLIC_POSTHOG_KEY to enable analytics
        </div>
      )}
    </div>
  );
}