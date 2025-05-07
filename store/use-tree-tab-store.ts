import { create } from "zustand";
import { devtools } from "zustand/middleware";

type TabValue = "default" | "step-by-step";

interface TreeTabState {
  currentTab: TabValue;
  previousTab: TabValue;
  setCurrentTab: (value: TabValue) => void;
  backupTab: () => void;
  restoreTab: () => void;
}

const useTreeTabStore = create<TreeTabState>()(
  devtools(
    (set, get) => ({
      currentTab: "default",
      previousTab: "default",
      setCurrentTab: (value) => set({ currentTab: value }),
      backupTab: () => set({ previousTab: get().currentTab }),
      restoreTab: () => set({ currentTab: get().previousTab }),
    }),
    { name: "tree-tab" },
  ),
);

export default useTreeTabStore;
