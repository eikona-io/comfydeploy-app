import { create } from "zustand";

interface UploadState {
  isUploading: boolean;
  progress: number | null;
  setProgress: (progress: number | null) => void;
  fileInput: HTMLInputElement | null;
  setFileInput: (input: HTMLInputElement | null) => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  isUploading: false,
  progress: null,
  setProgress: (progress) => set({ progress, isUploading: progress !== null }),
  fileInput: null,
  setFileInput: (input) => set({ fileInput: input }),
}));
