import { useMemo } from "react";
import { useFileDataStore } from "@/store/fileData";
import { getCandidateNumber } from "@/app/explain-assertions/components/explain-process";
import { getSteps } from "@/app/steps";

/**
 * Hook to dynamically generate Tour steps based on current uploaded file.
 * Ensures steps re-compute whenever candidate count changes.
 */
export const useReactiveTourProvider = () => {
  const fileData = useFileDataStore((state) => state.fileData);

  const candidateCount = getCandidateNumber(fileData);
  const ready = !!fileData && typeof candidateCount === "number";

  //   const steps = useMemo(() => {
  //     if (!ready) return [];
  //     return getSteps(candidateCount);
  //   }, [candidateCount, ready]);

  const steps = useMemo(() => {
    return ready ? getSteps(candidateCount) : [];
  }, [candidateCount, ready]);

  // hash key from selectors to force re-render
  const tourKey = useMemo(() => {
    return steps.length === 0
      ? "empty"
      : steps
          .filter(
            (
              s,
            ): s is {
              selector: string;
              content: ({
                setCurrentStep,
              }: {
                setCurrentStep: (step: number) => void;
              }) => JSX.Element;
            } => Boolean(s && "selector" in s && "content" in s),
          )
          .map((s) => s.selector)
          .join("|");
  }, [steps]);

  return { steps, tourKey, ready };
};
