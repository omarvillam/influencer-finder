import { create } from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

interface KeyState {
  apiKey: string | null;
  isHydrated: boolean;
  setKey: (key: string) => void;
  clearKey: () => void;
  setHydrated: () => void;
}

export const useKey = create(
  persist<KeyState>(
    (set) => ({
      apiKey: null,
      isHydrated: false,
      setKey: (key) => set(() => ({ apiKey: key })),
      clearKey: () => set(() => ({ apiKey: null })),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "api-key-storage",
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated();
        }
      },
    }
  )
);
