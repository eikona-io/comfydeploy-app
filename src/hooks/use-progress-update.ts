import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { EventSourcePolyfill } from "event-source-polyfill";
import { convertDateFields } from "@/lib/api";
import { toast } from "sonner";

export interface ProgressUpdate {
  run_id: string;
  workflow_id: string;
  machine_id: string;
  progress: number;
  status: string;
  node_class: string;
  timestamp: string;
  // New fields from Redis pub/sub
  user_id?: string;
  org_id?: string;
  gpu_event_id?: string;
  workflow_version_id?: string;
  log_type?: string;
  log?: string;
}

// New message types from Redis pub/sub
export interface RedisMessage {
  type:
    | "connection_established"
    | "subscribed"
    | "keepalive"
    | "error"
    | "stream_cancelled"
    | "stream_complete";
  channels?: string[];
  channel?: string;
  timestamp?: string;
  message?: string;
  reason?: string;
  source?: string;
}

export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export function useProgressUpdates({
  runId,
  workflowId,
  machineId,
  onUpdate,
  returnRun,
  fromStart,
  reconnect,

  status,
  deploymentId,
}: {
  runId?: string;
  workflowId?: string;
  machineId?: string;
  onUpdate?: (update: ProgressUpdate) => void;
  returnRun?: boolean;
  fromStart?: boolean;
  reconnect?: boolean;

  status?: string;
  deploymentId?: string;
}) {
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connecting");
  const fetchToken = useAuthStore((state) => state.fetchToken);

  useEffect(() => {
    // Clear the timeline when runId changes
    setProgressUpdates([]);

    let eventSource: EventSource;
    let unmounted = false;
    let retryCount = 0;
    const maxRetries = 5;
    const retryDelay = 3000; // 3 seconds

    const setupEventSource = async () => {
      setConnectionStatus("connecting");
      const token = await fetchToken();

      if (unmounted) return;

      const url = new URL(
        `${process.env.NEXT_PUBLIC_CD_API_URL}/api/v2/stream-progress`,
      );
      if (runId) {
        url.searchParams.append("run_id", runId);
      }
      if (workflowId) {
        url.searchParams.append("workflow_id", workflowId);
      }
      if (machineId) {
        url.searchParams.append("machine_id", machineId);
      }
      if (returnRun) {
        url.searchParams.append("return_run", "true");
      }
      if (fromStart) {
        url.searchParams.append("from_start", "true");
      }

      if (status) {
        url.searchParams.append("status", status);
      }
      if (deploymentId) {
        url.searchParams.append("deployment_id", deploymentId);
      }

      eventSource = new EventSourcePolyfill(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }) as unknown as EventSource;

      eventSource.onmessage = (event) => {
        let data = JSON.parse(event.data);
        data = convertDateFields(data);

        // Handle Redis pub/sub system messages
        if (data.type) {
          switch (data.type) {
            case "connection_established":
              console.log(
                "Redis pub/sub connection established, channels:",
                data.channels,
              );
              setConnectionStatus("connected");
              toast.success("Real-time updates connected");
              return;

            case "subscribed":
              console.log("Successfully subscribed to channel:", data.channel);
              setConnectionStatus("connected");
              return;

            case "keepalive":
              // Silent keepalive, just update connection status
              setConnectionStatus("connected");
              return;

            case "error":
              console.error("Redis pub/sub error:", data.message);
              toast.error(`Connection error: ${data.message}`);
              setConnectionStatus("error");
              return;

            case "stream_cancelled":
              console.log("Stream cancelled:", data.reason);
              toast.info("Real-time updates ended");
              setConnectionStatus("disconnected");
              return;

            case "stream_complete":
              console.log("Stream completed from:", data.source);
              toast.info("Updates completed");
              setConnectionStatus("disconnected");
              return;

            default:
              console.warn("Unknown message type:", data.type);
              return;
          }
        }

        // Handle actual progress updates (no type field means it's progress data)
        console.log("Progress update:", data);
        if (onUpdate) {
          onUpdate(data);
        }
        setProgressUpdates((prevUpdates) => [...prevUpdates, data]);
        setConnectionStatus("connected");
      };

      eventSource.onerror = (event) => {
        console.error("EventSource failed:", event);
        eventSource.close();
        setConnectionStatus("error");

        if (reconnect) {
          if (retryCount < maxRetries && !unmounted) {
            retryCount++;
            console.log(
              `Attempting to reconnect to Redis pub/sub (${retryCount}/${maxRetries})...`,
            );
            toast.info(
              `Reconnecting real-time updates (${retryCount}/${maxRetries})...`,
            );
            setTimeout(setupEventSource, retryDelay);
          } else if (retryCount >= maxRetries) {
            console.error("Max retries reached. Real-time updates disabled.");
            toast.error(
              "Unable to establish real-time connection. Please refresh the page.",
            );
          }
        }
      };

      eventSource.onopen = () => {
        console.log(
          "EventSource connection opened - waiting for Redis pub/sub confirmation",
        );
        setConnectionStatus("connecting"); // Keep as connecting until we get Redis confirmation
        retryCount = 0; // Reset retry count on successful connection
      };
    };

    setupEventSource();

    return () => {
      unmounted = true;
      if (eventSource) {
        eventSource.close();
      }
      setConnectionStatus("disconnected");
    };
  }, [runId, workflowId, machineId, fetchToken]);

  return { progressUpdates, connectionStatus };
}

// Enhanced hook specifically for Redis pub/sub v2 endpoint
export function useProgressUpdatesV2({
  runId,
  workflowId,
  machineId,
  onUpdate,
  onConnectionChange,
  returnRun = false,
  reconnect = true,
  status,
  deploymentId,
}: {
  runId?: string;
  workflowId?: string;
  machineId?: string;
  onUpdate?: (update: ProgressUpdate) => void;
  onConnectionChange?: (status: ConnectionStatus) => void;
  returnRun?: boolean;
  reconnect?: boolean;
  status?: string;
  deploymentId?: string;
}) {
  const result = useProgressUpdates({
    runId,
    workflowId,
    machineId,
    onUpdate,
    returnRun,
    fromStart: false, // v2 starts from current time by default
    reconnect,
    status,
    deploymentId,
  });

  // Notify about connection changes
  useEffect(() => {
    if (onConnectionChange) {
      onConnectionChange(result.connectionStatus);
    }
  }, [result.connectionStatus, onConnectionChange]);

  return {
    ...result,
    // Add helper methods for v2
    isConnected: result.connectionStatus === "connected",
    isConnecting: result.connectionStatus === "connecting",
    hasError: result.connectionStatus === "error",
  };
}
