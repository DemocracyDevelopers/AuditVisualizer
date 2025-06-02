import { TreeNode } from "@/components/tree/helper";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Interface for the multi-winner data store
interface MultiWinnerData {
  multiWinner:
    | {
        winnerInfo: {
          id: number;
          name: string;
        };
        data: {
          type: string;
          process: Array<{
            step: number;
            trees?: TreeNode | null;
            assertion?: {
              index: number;
              content: string;
            };
            before?: TreeNode | null;
            after?: TreeNode | null;
          }>;
        };
      }[]
    | null;
  setMultiWinner: (data: any) => void;
  clearMultiWinner: () => void;
  winnerInfo: { id: number; name: string } | null;
  setWinnerInfo: (data: { id: number; name: string }) => void;
  clearWinnerInfo: () => void;
  candidateList: { id: number; name: string; color: string }[];
  setCandidateList: (data: any) => void;
  clearCandidateList: () => void;
  assertionList: any[];
  setAssertionList: (data: any) => void;
  clearAssertionList: () => void;
}

// Zustand store implementation with devtools and persistence
const useMultiWinnerDataStore = create<MultiWinnerData>()(
  devtools(
    persist(
      (set) => ({
        winnerInfo: null,
        setWinnerInfo: (data) => set({ winnerInfo: data }),
        clearWinnerInfo: () => set({ winnerInfo: null }),
        multiWinner: null,
        setMultiWinner: (data) => set({ multiWinner: data }),
        clearMultiWinner: () => set({ multiWinner: null }),
        candidateList: [],
        setCandidateList: (data) => set({ candidateList: data }),
        clearCandidateList: () => set({ candidateList: [] }),
        assertionList: [],
        setAssertionList: (data) => set({ assertionList: data }),
        clearAssertionList: () => set({ assertionList: [] }),
      }),
      {
        name: "multiWinner-store",
      },
    ),
    { name: "multiWinner-store" },
  ),
);

export default useMultiWinnerDataStore;
