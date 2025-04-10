import { SecretsList } from "@/components/secrets/secrets-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/secrets")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SecretsList />;
}
