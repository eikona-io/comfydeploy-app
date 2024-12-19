import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useRef } from "react";
import { toast } from "sonner";
import { create } from "zustand";

type ViewMode = "mixed" | "private" | "public";

export type VolFSStructure = {
  contents: (VolFolder | VolFile)[];
};

export type VolFolder = {
  path: string;
  type: "folder";
  contents: (VolFolder | VolFile)[];
};

export type VolFile = {
  path: string;
  type: "file";
};

export interface Model {
  id: string;
  path: string;
  name: string;
  size: number;
  type: string;
  isPrivate: boolean;
  isPublic: boolean;
  category: string;
  created_at?: Date;
  error_log?: string;
  status?: string;
}

const modelBrowserState = create<{
  addModelModalOpen: boolean;
  setAddModelModalOpen: (addModelModalOpen: boolean) => void;
  insertModalSource:
    | "huggingface"
    | "civitai"
    | "link"
    | "local"
    | "comfymanager"
    | undefined;
  setInsertModalSource: (
    insertModalSource:
      | "huggingface"
      | "civitai"
      | "link"
      | "local"
      | "comfymanager"
      | undefined,
  ) => void;

  filter: string;
  viewMode: ViewMode;
  // isMinimized: boolean;
  selectedCategories: string[];
  setFilter: (filter: string) => void;
  setViewMode: (viewMode: ViewMode) => void;
  setSelectedCategories: (selectedCategories: string[]) => void;
  isPrivateModelRefreshing: boolean;
  setIsPrivateModelRefreshing: (isPrivateModelRefreshing: boolean) => void;

  isPublicModelRefreshing: boolean;
  setIsPublicModelRefreshing: (isPublicModelRefreshing: boolean) => void;

  status: "ready" | "refreshing";
  setStatus: (status: "ready" | "refreshing") => void;
}>((set) => ({
  insertModalSource: undefined,
  setInsertModalSource: (
    insertModalSource:
      | "huggingface"
      | "civitai"
      | "link"
      | "local"
      | "comfymanager"
      | undefined,
  ) => set({ insertModalSource }),

  filter: "",
  viewMode: "mixed",
  // isMinimized: false,
  selectedCategories: [],
  setFilter: (filter: string) => set({ filter }),
  setViewMode: (viewMode: ViewMode) => set({ viewMode }),
  setSelectedCategories: (selectedCategories: string[]) =>
    set({ selectedCategories }),
  isPrivateModelRefreshing: false,
  setIsPrivateModelRefreshing: (isPrivateModelRefreshing: boolean) =>
    set({ isPrivateModelRefreshing }),

  isPublicModelRefreshing: false,
  setIsPublicModelRefreshing: (isPublicModelRefreshing: boolean) =>
    set({ isPublicModelRefreshing }),

  status: "ready",
  setStatus: (status: "ready" | "refreshing") => set({ status }),

  addModelModalOpen: false,
  setAddModelModalOpen: (addModelModalOpen: boolean) =>
    set({ addModelModalOpen }),
}));

export function useModels() {
  const setIsPrivateModelRefreshing = modelBrowserState(
    (s) => s.setIsPrivateModelRefreshing,
  );

  const setIsPublicModelRefreshing = modelBrowserState(
    (s) => s.setIsPublicModelRefreshing,
  );

  const disableCacheRef = useRef(false);

  const { data: private_volume, refetch: _refetchPrivateVolume } = useQuery({
    queryKey: ["volume", "private-models"],
    queryFn: async ({ queryKey }) => {
      console.log("refreshing private models");
      setIsPrivateModelRefreshing(true);
      const contents = await api({
        url: queryKey.join("/"),
      });
      setIsPrivateModelRefreshing(false);
      disableCacheRef.current = false;
      toast.success("Private Models Refreshed");
      return {
        structure: contents.structure as VolFSStructure,
        models: contents.models as any[],
      };
    },
    refetchInterval: (data) => {
      return 30000;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: public_volume, refetch: _refetchPublicVolume } = useQuery({
    queryKey: ["volume", "public-models"],
    queryFn: async ({ queryKey }) => {
      setIsPublicModelRefreshing(true);
      const contents = await api({
        url: queryKey.join("/"),
      });
      setIsPublicModelRefreshing(false);
      disableCacheRef.current = false;
      toast.success("Public Models Refreshed");
      return {
        structure: contents.structure as VolFSStructure,
        models: contents.models as any[],
      };
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: downloadingModels, refetch: refetchDownloadingModels } =
    useQuery({
      queryKey: ["volume", "downloading-models"],
      queryFn: async ({ queryKey }) => {
        const contents = await api({
          url: queryKey.join("/"),
        });
        return contents;
      },
      refetchOnWindowFocus: false,
      refetchInterval: (data) => {
        if (data?.state.data?.length === 0) {
          return 50000;
        }
        return 1000;
      },
    });

  const flattenedModels = useMemo<Model[]>(() => {
    const flatten = (
      items: (VolFolder | VolFile)[],
      models: any[],
      prefix = "",
      isPrivate: boolean,
    ): Model[] => {
      return items.reduce<Model[]>((acc, item) => {
        const path = `${item.path}`;
        const pathParts = path.split("/");
        const category = pathParts.length > 1 ? pathParts[0] : "other";
        if (item.type === "file") {
          const name = pathParts.pop() || "";
          const type = pathParts[0];
          const existingModel = acc.find((m) => m.path === path);
          if (existingModel) {
            existingModel.isPrivate = existingModel.isPrivate || isPrivate;
            existingModel.isPublic = existingModel.isPublic || !isPrivate;
          } else {
            const model = models.find((m) => {
              const folder_path = m.folder_path
                ? [m.folder_path, m.model_name].join("/")
                : m.model_name;
              const status = m.status;
              if (!folder_path || status !== "success") return false;
              return folder_path?.includes(path);
            });
            if (!model?.id) return acc;
            acc.push({
              id: model?.id, // Use path as fallback ID if model is not found
              path,
              name,
              type,
              isPrivate,
              isPublic: !isPrivate,
              category,
              created_at: model?.created_at || new Date(), // Add created time
              error_log: model?.error_log || "",
              status: model?.status || "failed", // Add status field
              size: model?.size || 0,
            });
          }
        } else if (item.type === "folder" && item.contents) {
          return [
            ...acc,
            ...flatten(item.contents, models, `${path}/`, isPrivate),
          ];
        }
        return acc;
      }, []);
    };

    const publicModels = public_volume
      ? flatten(
          public_volume.structure.contents,
          public_volume.models,
          "",
          false,
        )
      : [];
    const privateModels = private_volume
      ? flatten(
          private_volume.structure.contents,
          private_volume.models,
          "",
          true,
        )
      : [];

    // Combine and merge public and private models, prioritizing private model IDs
    return [...publicModels, ...privateModels].reduce((acc, model) => {
      const existingModel = acc.find((m) => m.path === model.path);
      if (existingModel) {
        existingModel.isPrivate = existingModel.isPrivate || model.isPrivate;
        existingModel.isPublic = existingModel.isPublic || model.isPublic;
        // If the model is private, use its ID
        if (model.isPrivate) existingModel.id = model.id;
      } else {
        acc.push(model);
      }
      return acc;
    }, [] as Model[]);
  }, [public_volume, private_volume]);

  const refetchPrivateVolume = (disableCache = false) => {
    disableCacheRef.current = disableCache;
    return _refetchPrivateVolume();
  };

  const refetchPublicVolume = (disableCache = false) => {
    disableCacheRef.current = disableCache;
    return _refetchPublicVolume();
  };

  return {
    flattenedModels,
    public_volume,
    private_volume,
    downloadingModels,
    refetchDownloadingModels,
    refetchPrivateVolume,
    refetchPublicVolume,
  };
}
