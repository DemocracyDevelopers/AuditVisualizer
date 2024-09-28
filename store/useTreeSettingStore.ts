import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface TreeSettingsState {
  stepByStep: boolean;
  hideAvatar: boolean;
  setStepByStep: (value: boolean) => void;
  setHideAvatar: (value: boolean) => void;
}

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
