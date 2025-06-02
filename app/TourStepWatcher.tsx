// TourStepWatcher.tsx
import { useEffect } from "react";
import { useTour } from "@reactour/tour";
import { expandTreeLayerByLayer } from "@/utils/treeActions";

/** 映射每一步对应的副作用 */
const stepEffects: Record<number, () => void> = {
  6: () => {
    console.log("模拟Expand All");
    // 可以触发标记已看、埋点、或者状态更新
    expandTreeLayerByLayer();
  },
};
export const TourStepWatcher = () => {
  const { currentStep } = useTour();

  useEffect(() => {
    const effect = stepEffects[currentStep];
    if (effect) effect();
  }, [currentStep]);

  return null; // 不渲染任何 UI
};
