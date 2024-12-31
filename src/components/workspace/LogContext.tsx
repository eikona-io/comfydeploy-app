import { v4 } from "uuid";
import { create } from "zustand";

export interface LogEntry {
  id: string;
  message: string;
  time: number;
  timestamp?: string; // Optional property
  previousTime?: string;
  type: LogType;
}

const determineLogType = (message: string): LogType => {
  const msg = message.toLowerCase();
  if (msg.includes("error") || msg.includes("fail")) return { type: "Error" };
  if (msg.includes("warn")) return { type: "Warning" };
  if (msg.includes("start queue")) return { type: "Function" };
  return { type: "All" };
};

export interface LogType {
  type: "All" | "Error" | "Warning" | "Function";
}

interface LogStore {
  logs: string[];
  processedLogs: LogEntry[];
  totalCount: number;
  errorCount: number;
  warningCount: number;
  addLog: (log: string) => void;
  clearLogs: () => void;
}

export const useLogStore = create<LogStore>((set) => ({
  logs: [],
  processedLogs: [],
  totalCount: 0,
  errorCount: 0,
  warningCount: 0,
  addLog: (log) =>
    set((state) => {
      if (log.trim() === "") return state;

      const logData = JSON.parse(log.slice(5).trim());

      if (!logData.logs) return state;

      const logType = determineLogType(logData.logs);
      const logEntry: LogEntry = {
        id: v4(),
        message: logData.logs.replace(/\r/g, "\n"),
        type: logType,
        time: logData.timestamp * 1000,
      };

      let errorCount = state.errorCount;
      let warningCount = state.warningCount;

      if (logType.type === "Error") {
        errorCount++;
      }
      if (logType.type === "Warning") {
        warningCount++;
      }
      let totalCount = state.totalCount;
      totalCount++;

      if (logData.timestamp !== undefined) {
        let previousTimestamp =
          state.processedLogs[state.processedLogs.length - 1]?.time;

        const currentTimestamp = logData.timestamp * 1000;
        logEntry.timestamp = new Date(currentTimestamp).toLocaleTimeString(
          "en-GB",
          {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            fractionalSecondDigits: 3,
          },
        );

        if (previousTimestamp) {
          const timeDiff = currentTimestamp - previousTimestamp;
          logEntry.previousTime =
            timeDiff < 1 ? "0s" : `${(timeDiff / 1000).toFixed(3)}s`;
        }
      }

      return {
        processedLogs: [...state.processedLogs, logEntry],
        logs: [...state.logs, log],
        errorCount,
        warningCount,
        totalCount,
      };
    }),
  clearLogs: () =>
    set({
      logs: [],
      processedLogs: [],
      totalCount: 0,
      errorCount: 0,
      warningCount: 0,
    }),
}));

// Remove the LogProvider component as it's no longer needed

// Rename useLog to useLogStore for consistency
export const useLog = useLogStore;

export const LogProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
