import { SecretsList } from "@/components/secrets-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/secrets")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SecretsList />;
}
