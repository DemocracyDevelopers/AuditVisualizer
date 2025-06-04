import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Defines the shape of the tree view settings state
interface TreeSettingsState {
  stepByStep: boolean;
  hideAvatar: boolean;
  setStepByStep: (value: boolean) => void;
  setHideAvatar: (value: boolean) => void;
}

// Zustand store for managing tree display settings
const useTreeSettingsStore = create<TreeSettingsState>()(
  devtools(
    (set) => ({
      stepByStep: false,
      hideAvatar: true,
      setStepByStep: (value) => set({ stepByStep: value }),
      setHideAvatar: (value) => set({ hideAvatar: value }),
    }),
    { name: "tree-settings" },
  ),
);

export default useTreeSettingsStore;
