import { create } from 'zustand';

interface AuthState {
    token: string | null;
    isLoading: boolean;
    fetchToken: () => Promise<string | null>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    token: null,
    isLoading: false,
    fetchToken: async () => {
        const pollInterval = 500; // Poll every 500ms
        const maxAttempts = 60; // Max 30 seconds of polling

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const currentToken = get().token;
            if (currentToken) {
                return currentToken;
            }
            await new Promise(resolve => setTimeout(resolve, pollInterval));
        }

        throw new Error("Timeout: Failed to retrieve auth token");
    },
}));