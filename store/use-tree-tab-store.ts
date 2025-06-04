import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Type definition for valid tab values
type TabValue = "default" | "step-by-step";

// Interface for managing tab state in the tree view
interface TreeTabState {
  currentTab: TabValue;
  previousTab: TabValue;
  setCurrentTab: (value: TabValue) => void;
  backupTab: () => void;
  restoreTab: () => void;
}

// Zustand store for managing the current and previous tab states
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
