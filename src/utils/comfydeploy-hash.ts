import { useQuery } from "@tanstack/react-query";

const FALLBACK_COMFYDEPLOY_HASH = "c47865ec266daf924cc7ef19223e9cf70122eb41";
const FALLBACK_COMFYUI_HASH = "158419f3a0017c2ce123484b14b6c527716d6ec8";

interface LatestHashesResponse {
  comfydeploy_hash: string;
  comfyui_hash: string;
}

export function useLatestHashes() {
  return useQuery({
    queryKey: ["latest-hashes"],
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 2,
    select: (data: LatestHashesResponse) => ({
      comfydeploy_hash: data?.comfydeploy_hash || FALLBACK_COMFYDEPLOY_HASH,
      comfyui_hash: data?.comfyui_hash || FALLBACK_COMFYUI_HASH
    })
  });
}

export const comfydeploy_hash = FALLBACK_COMFYDEPLOY_HASH;
export const comfyui_hash = FALLBACK_COMFYUI_HASH;
