// TourStepWatcher.tsx
import { useEffect } from "react";
import { useTour } from "@reactour/tour";
import { expandTreeLayerByLayer } from "@/utils/treeActions";

const stepEffects: Record<number, () => void> = {
  6: () => {
    expandTreeLayerByLayer();
  },
};
export const TourStepWatcher = () => {
  const { currentStep } = useTour();

  useEffect(() => {
    const effect = stepEffects[currentStep];
    if (effect) effect();
  }, [currentStep]);

  return null; 
};
