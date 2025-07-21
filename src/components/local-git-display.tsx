import { GitBranch } from "lucide-react";
import { Badge } from "./ui/badge";
import { useQuery } from "@tanstack/react-query";

export function LocalGitDisplay() {
  const { data: currentGitBranch } = useQuery({
    queryKey: ["currentGitBranch"],
    queryFn: async () => {
      try {
        const response = await fetch("/git-info.json");
        const data = await response.json();
        return data;
      } catch (error) {
        return null;
      }
    },
    refetchInterval: 3000,
    enabled: window.location.hostname === "localhost",
  });

  if (window.location.hostname !== "localhost") {
    return null;
  }

  return (
    <div className="fixed top-2 right-2 z-[9999] flex items-center gap-2 opacity-65">
      <Badge className="pointer-events-none bg-orange-300 text-orange-700 shadow-md dark:bg-orange-900/50 dark:text-orange-400">
        Localhost
      </Badge>

      <Badge variant="emerald" className="pointer-events-none shadow-md">
        <GitBranch className="h-4 w-4" />
        {currentGitBranch?.branch || `Please run "bun githooks"`}
      </Badge>
    </div>
  );
}
