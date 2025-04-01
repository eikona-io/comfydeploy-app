import { create } from "zustand";

export type Secret = {
  id: string;
  key: string;
  user_id: string;
  org_id: string | null;
  created_at: Date;
  updated_at: Date;
};

interface SecretsState {
  secrets: Secret[];
  setSecrets: (secrets: Secret[]) => void;
  filteredSecrets: Secret[];
  setFilteredSecrets: (secrets: Secret[]) => void;
}

export const useUpdateSecrets = create<SecretsState>((set) => ({
  secrets: [],
  setSecrets: (secrets) => set({ secrets }),
  filteredSecrets: [],
  setFilteredSecrets: (filteredSecrets) => set({ filteredSecrets }),
}));
