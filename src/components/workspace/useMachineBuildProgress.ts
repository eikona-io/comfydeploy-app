import type { LogsType } from "@/components/log/logs-viewer";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useMemo, useState } from "react";
import useWebSocket from "react-use-websocket";

interface UseBuildProgressProps {
  machine_id: string;
  endpoint: string;
  instance_id: string;
  auth_token: string | null;
}

export function useMachineBuildProgress({
  machine_id,
  endpoint,
  instance_id,
  auth_token,
}: UseBuildProgressProps) {
  const [logs, setLogs] = useState<LogsType>([]);
  const [finished, setFinished] = useState(false);
  const [status, setStatus] = useState<"failed" | "success">();

  let wsEndpoint = endpoint?.replace(/^http/, "ws");
  if (wsEndpoint?.includes("modal_builder")) {
    wsEndpoint = wsEndpoint.replace("modal_builder", "localhost");
  }

  const { lastMessage, readyState } = useWebSocket(
    auth_token ? `${wsEndpoint}/ws/${machine_id}` : null,
    {
      shouldReconnect: () => !finished,
      reconnectAttempts: 20,
      reconnectInterval: 1000,
      queryParams: {
        fly_instance_id: instance_id,
        cd_token: auth_token ?? "",
      },
    },
  );

  useEffect(() => {
    if (!lastMessage?.data) return;

    const message = JSON.parse(lastMessage.data);
    if (message?.event === "LOGS") {
      setLogs((logs) => [...(logs ?? []), message.data]);
    } else if (message?.event === "FINISHED") {
      setFinished(true);
      setStatus(message.data.status);
    }
  }, [lastMessage]);

  return {
    logs,
    finished,
    status,
    readyState,
  };
}

interface BuildProgressBarProps {
  machine_id: string;
  endpoint: string;
  instance_id: string;
  machine: any;
}

export function getMachineBuildProgress({
  machine_id,
  endpoint,
  instance_id,
  machine,
}: BuildProgressBarProps) {
  if (
    machine.type !== "comfy-deploy-serverless" ||
    machine.status !== "building"
  ) {
    return null;
  }

  const { getToken } = useAuth();
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    getToken().then(setAuthToken);
  }, [getToken]);

  const { logs, finished } = useMachineBuildProgress({
    machine_id,
    endpoint,
    instance_id,
    auth_token: authToken,
  });

  const progress = useMemo(() => {
    const totalSteps = 5 + (machine.docker_command_steps?.steps.length || 0);

    const getCurrentStep = () => {
      const stepMarkers = [
        "Builder Version:",
        "Cloning into '/comfyui'...",
        "https://github.com/bennykok/comfyui-deploy",
        "get_static_assets",
        "✓ Created objects.",
      ];

      for (let i = stepMarkers.length - 1; i >= 0; i--) {
        if (logs.some((log) => log.logs.includes(stepMarkers[i]))) {
          return i + 1 + (machine.docker_command_steps?.steps.length || 0);
        }
      }
      return 0;
    };

    const currentStep = getCurrentStep();
    const progress = (currentStep / totalSteps) * 100;

    if (finished) return null;
    return progress;
  }, [logs, machine.docker_command_steps?.steps.length, finished]);

  return progress;
}
