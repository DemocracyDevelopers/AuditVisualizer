"use client";

import { useEffect } from "react";
import { useTour, StepType } from "@reactour/tour";
import { useFileDataStore } from "@/store/fileData";
import { getCandidateNumber } from "@/app/explain-assertions/components/explain-process";
import { getSteps } from "@/app/steps";

export const TourSyncWatcher = () => {
  const fileData = useFileDataStore((state) => state.fileData);
  const { setSteps, setCurrentStep } = useTour();

  useEffect(() => {
    if (!fileData) return;

    const count = getCandidateNumber(fileData);
    if (typeof count === "number") {
      const newSteps = getSteps(count);
      setSteps?.(newSteps as StepType[]);
      setCurrentStep?.(0); // Reset to the first step
    }
  }, [fileData, setSteps]);

  return null;
};
