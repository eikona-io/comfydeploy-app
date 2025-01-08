import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

type sessionResp = {
  session_id: string;
  url: string;
  gpu_event_id: string;
  gpu: string;
  created_at: string;
  timeout: number;
  machine_id: string;
};

export function getSession(sessionId: string) {
  return useQuery<sessionResp>({
    queryKey: ["session", sessionId],
    enabled: !!sessionId,
  });
}

export function increaseSessionTimeout(
  timeout: number,
  machine_id: string,
  session_id: string,
  gpu: string,
) {
  return api({
    url: "session/increase-timeout",
    init: {
      method: "POST",
      body: JSON.stringify({
        timeout,
        machine_id,
        session_id,
        gpu,
      }),
    },
  });
}
