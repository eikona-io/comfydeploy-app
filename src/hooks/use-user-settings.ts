import { useQuery } from "@tanstack/react-query";

export function useUserSettings() {
  return useQuery<any>({
    queryKey: ["platform", "user-settings"],
  });
}
