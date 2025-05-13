import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface TreeSelectionState {
  selectedTreeId: number;
  setSelectedTreeId: (id: number) => void;
}

const useTreeSelectionStore = create<TreeSelectionState>()(
  devtools((set) => ({
    selectedTreeId: 0,
    setSelectedTreeId: (id) => set({ selectedTreeId: id }),
  })),
);

export default useTreeSelectionStore;
