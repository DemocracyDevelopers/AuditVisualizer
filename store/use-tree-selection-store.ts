import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Defines the shape of the state for tree selection
interface TreeSelectionState {
  selectedTreeId: number;
  setSelectedTreeId: (id: number) => void;
}

// Zustand store to manage and track the selected tree ID
const useTreeSelectionStore = create<TreeSelectionState>()(
  devtools((set) => ({
    selectedTreeId: 0,
    setSelectedTreeId: (id) => set({ selectedTreeId: id }),
  })),
);

export default useTreeSelectionStore;
