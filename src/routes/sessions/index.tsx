import React from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { SessionItem } from "@/components/sessions/SessionItem";
import { useAllSessionsAPI } from "@/hooks/use-session-api";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/sessions/")({
  component: SessionsOverview,
}) as any;

function SessionsOverview() {
  const { listAllSessions } = useAllSessionsAPI();
  const { data: sessions, isLoading } = listAllSessions;
  const router = useRouter();

  const handleSessionSelect = (sessionId: string, session: any) => {
    router.navigate({
      to: "/sessions/$sessionId",
      params: { sessionId },
      search: session.workflowId ? { 
        workflowId: session.workflowId 
      } : {},
    });
  };

  const handleSessionDelete = async (sessionId: string) => {
    console.log("Delete session:", sessionId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Active Sessions</h1>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Active Sessions</h1>
      {!sessions || sessions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No active sessions found
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session, index) => (
            <div key={session.session_id} className="border rounded-lg p-4">
              <SessionItem
                session={session}
                index={index}
                isActive={true}
                onSelect={() => handleSessionSelect(session.session_id, session)}
                onDelete={handleSessionDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
