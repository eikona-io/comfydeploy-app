import { APIKeyList } from "@/components/api-key-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api-keys/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <APIKeyList />;
}
