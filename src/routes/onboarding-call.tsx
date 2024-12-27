import {
  BookcallForm,
  OnboardingCall,
} from "@/components/bookcall/BookcallForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding-call")({
  component: RouteComponent,
});

function RouteComponent() {
  return <OnboardingCall />;
}
