import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Status = "uploading" | "completed" | "aborted" | "error";

export type UploadRow = {
  id: string;
  name: string;
  size: number;
  uploaded: number;
  percent: number;
  eta: number;
  status: Status;
  s3Key?: string;
  uploadId?: string;
  cancel?: () => void;
};

type Store = {
  items: Record<string, UploadRow>;
  add: (row: UploadRow) => void;
  update: (id: string, patch: Partial<UploadRow>) => void;
  remove: (id: string) => void;
  attachCancel: (id: string, fn: () => void) => void;
  cancelById: (id: string) => void;
};

export const useUploadsProgressStore = create<Store>()(
  persist(
    (set, get) => ({
      items: {},
      add: (row) => set((s) => ({ items: { ...s.items, [row.id]: row } })),
      update: (id, patch) =>
        set((s) => ({ items: { ...s.items, [id]: { ...s.items[id], ...patch } } })),
      remove: (id) =>
        set((s) => {
          const next = { ...s.items };
          delete next[id];
          return { items: next };
        }),
      attachCancel: (id, fn) =>
        set((s) => ({ items: { ...s.items, [id]: { ...s.items[id], cancel: fn } } })),
      cancelById: (id) => {
        const it = get().items[id];
        it?.cancel?.();
      },
    }),
    {
      name: "uploads-progress-v1",
      storage: {
        getItem: (name: string) => (typeof window !== "undefined" ? localStorage.getItem(name) : null),
        setItem: (name: string, value: string) => {
          if (typeof window !== "undefined") localStorage.setItem(name, value);
        },
        removeItem: (name: string) => {
          if (typeof window !== "undefined") localStorage.removeItem(name);
        },
      } as any,
    }
  )
);
