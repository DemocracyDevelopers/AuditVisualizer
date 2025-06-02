import { useEffect } from "react";
import { useTour } from "@reactour/tour";
import { expandTreeLayerByLayer } from "@/utils/treeActions";

/**
 * Defines side effects associated with specific tour steps.
 * When a tour step is reached, the corresponding effect (if defined) will be triggered.
 */
const stepEffects: Record<number, () => void> = {
  6: () => {
    console.log("Simulate Expand All");
    expandTreeLayerByLayer();
  },
};

/**
 * TourStepWatcher
 * A non-visual component that watches the current tour step and
 * triggers any side effects mapped in `stepEffects`.
 */
export const TourStepWatcher = () => {
  const { currentStep } = useTour();

  useEffect(() => {
    const effect = stepEffects[currentStep];
    if (effect) effect();
  }, [currentStep]);

  return null;
};
