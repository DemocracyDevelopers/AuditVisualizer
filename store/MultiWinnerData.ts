// stores/useGlobalJsonStore.ts
import { TreeNode } from "@/components/Tree/helper";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

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
            assertion?: string;
            before?: TreeNode | null;
            after?: TreeNode | null;
          }>;
        };
      }[]
    | null; // 用于存储 JSON 数据
  setMultiWinner: (data: any) => void; // 设置 JSON 数据
  clearMultiWinner: () => void; // 清空 JSON 数据
  candidateList: any[];
  setCandidateList: (data: any) => void;
  clearCandidateList: () => void;
  assertionList: any[];
  setAssertionList: (data: any) => void;
  clearAssertionList: () => void;
}

const useMultiWinnerDataStore = create<MultiWinnerData>()(
  devtools(
    // 存入localStorage, 让刷新页面不会丢失数据
    persist(
      (set) => ({
        multiWinner: null, // 初始状态为空
        setMultiWinner: (data) => set({ multiWinner: data }), // 设置 JSON 数据
        clearMultiWinner: () => set({ multiWinner: null }), // 清空 JSON 数据
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
