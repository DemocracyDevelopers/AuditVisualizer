import { Button } from "@/components/ui/button";
import useTreeTabStore from "@/store/use-tree-tab-store";

interface TourNavButtonsProps {
  back?: number;
  next?: number;
  backLabel?: string;
  nextLabel?: string;
  backSwitchTo?: "default" | "step-by-step";
  nextSwitchTo?: "default" | "step-by-step";
  setCurrentStep: (step: number) => void;
}

export const TourNavButtons = ({
  back,
  next,
  backLabel = "Back",
  nextLabel = "Next",
  backSwitchTo,
  nextSwitchTo,
  setCurrentStep,
}: TourNavButtonsProps) => {
  const { setCurrentTab } = useTreeTabStore();

  const handleStep = (target?: number, direction?: "back" | "next") => {
    if (typeof target !== "number") return;
    if (direction === "back" && backSwitchTo) setCurrentTab(backSwitchTo);
    if (direction === "next" && nextSwitchTo) setCurrentTab(nextSwitchTo);
    setCurrentStep(target);
  };

  return (
    <div className="mt-4 flex space-x-2">
      {typeof back === "number" && (
        <Button
          onClick={() => handleStep(back, "back")}
          className="bg-gray-600 text-white"
        >
          {backLabel}
        </Button>
      )}
      {typeof next === "number" && (
        <Button
          onClick={() => handleStep(next, "next")}
          className="bg-blue-600 text-white"
        >
          {nextLabel}
        </Button>
      )}
    </div>
  );
};
