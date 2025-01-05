import { create } from "zustand";

interface AssetBrowserState {
  currentPath: string;
  setCurrentPath: (path: string) => void;
}

export const useAssetBrowserStore = create<AssetBrowserState>((set) => ({
  currentPath: "/",
  setCurrentPath: (path) => set({ currentPath: path }),
}));
