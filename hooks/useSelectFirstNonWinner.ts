// src/hooks/useSelectFirstNonWinner.ts
import useMultiWinnerDataStore from "@/store/multi-winner-data";
import useTreeSelectionStore from "@/store/use-tree-selection-store";

export const useSelectFirstNonWinner = () => {
  const { candidateList, winnerInfo } = useMultiWinnerDataStore();
  const setSelectedTreeId = useTreeSelectionStore((s) => s.setSelectedTreeId);

  return () => {
    if (!winnerInfo) return;

    const firstNonWinner = candidateList.find(
      (candidate) => candidate.id !== winnerInfo.id,
    );

    if (firstNonWinner) {
      setSelectedTreeId(firstNonWinner.id);
    }
  };
};
