import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Tree from "../../../../components/tree";
import { useEffect, useState, useRef } from "react";
import { TreeNode } from "@/components/tree/helper";
import { deepCloneTree } from "./utils";

interface OneClickAnimationProps {
  process: Array<{
    step: number;
    trees?: TreeNode | null; // step 0 will have initial tree
    assertion?: { index: number; content: string };
    before?: TreeNode | null; // step 1, 3, 5... will have before trees
    after?: TreeNode | null; // step 2, 4, 6... will have after trees
    treeUnchanged?: boolean;
  }>;
  selectedWinnerId: number;
}

function OneClickAnimation({
  process,
  selectedWinnerId,
}: OneClickAnimationProps) {
  const [open, setOpen] = useState(false);
  const [resetHiddenNodes, setResetHiddenNodes] = useState(false);
  const [currentTree, setCurrentTree] = useState<TreeNode | null>(null);
  const [currentAssertion, setCurrentAssertion] = useState<{
    index: number;
    content: string;
  } | null>(null);
  const currentAssertionString = `[${(currentAssertion?.index || 0) + 1}] Pruned by: ${
    currentAssertion?.content
  }`;
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isLastStep, setIsLastStep] = useState(false);
  const isManualNavigation = useRef(false);

  // Add a key state to force tree re-renders
  const [treeKey, setTreeKey] = useState(0);

  const totalSteps =
    process && process.length > 0
      ? process.length * 2 - 1 // Initial tree + (before & after for each process item)
      : 0;

  // Reset animation state when selectedWinnerId changes
  useEffect(() => {
    setCurrentStep(0);
    setIsAnimating(false);
    setIsPaused(false);
    setAnimationComplete(false);
    setResetHiddenNodes(true);
    setIsLastStep(false);
    isManualNavigation.current = false;
    // Increment tree key to force a re-render
    setTreeKey((prev) => prev + 1);

    // Only initialize the tree if dialog is open
    if (open && process && process.length > 0) {
      setCurrentTree(deepCloneTree(process[0].trees) || null);
      setCurrentAssertion(process[0]?.assertion ?? null);
    }
  }, [selectedWinnerId, process, open]);

  // Auto-start animation when dialog opens
  useEffect(() => {
    if (
      open &&
      !isAnimating &&
      !isPaused && // Don't restart if paused
      !animationComplete &&
      process &&
      process.length > 0 &&
      !isManualNavigation.current // Check if this is a manual navigation
    ) {
      // Reset to the first step
      setCurrentStep(0);
      setIsAnimating(true);
      setIsLastStep(false);
      // Increment tree key to force a re-render
      setTreeKey((prev) => prev + 1);
    }

    // Reset manual navigation flag when dialog opens
    isManualNavigation.current = false;
  }, [open, isAnimating, isPaused, animationComplete, process]);

  const isBefore = (currentStep - 1) % 2 === 0; // Even offset (1,3,5...) = before, Odd offset (2,4,6...) = after

  // Handle tree updates based on current step
  useEffect(() => {
    if (!process || process.length === 0) return;

    // Check if this is the last step
    setIsLastStep(currentStep >= totalSteps - 1);

    // Increment tree key to force a re-render
    setTreeKey((prev) => prev + 1);

    // Update tree and assertion based on current step
    if (currentStep === 0) {
      // First step uses process[0].trees
      setCurrentTree(deepCloneTree(process[0].trees) || null);
      setCurrentAssertion(process[0]?.assertion ?? null);
    } else {
      // Calculate which process item and whether it's before or after
      const processIndex = Math.floor((currentStep + 1) / 2);

      if (isBefore) {
        setCurrentTree(deepCloneTree(process[processIndex].before) || null);
      } else {
        setCurrentTree(deepCloneTree(process[processIndex].after) || null);
      }
      setCurrentAssertion(process[processIndex]?.assertion ?? null);
    }
  }, [currentStep, process, totalSteps]);

  // Animation timer effect - This effect runs only when isAnimating is true, not manually navigating, and not paused
  useEffect(() => {
    // If manual navigation or paused, do not run auto animation
    if (isManualNavigation.current || isPaused) {
      return;
    }

    let animationTimer: NodeJS.Timeout | null = null;

    // Only continue animation if we're not at the last step
    if (isAnimating && currentStep < totalSteps - 1) {
      animationTimer = setTimeout(() => {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);

        if (nextStep >= totalSteps - 1) {
          // We've reached the final step - stop the animation
          setIsAnimating(false);
          setIsPaused(false); // Reset pause state when complete
          setAnimationComplete(true);
          setIsLastStep(true);
        }
      }, 1000);
    } else if (isAnimating && currentStep >= totalSteps - 1) {
      // Force stop animation if we're already at or beyond the last step
      setIsAnimating(false);
      setIsPaused(false);
      setAnimationComplete(true);
      setIsLastStep(true);
    }

    return () => {
      if (animationTimer) {
        clearTimeout(animationTimer);
      }
    };
  }, [currentStep, isAnimating, isPaused, totalSteps]);

  // Reset animation complete flag when animation starts
  useEffect(() => {
    if (isAnimating && !isManualNavigation.current && !isPaused) {
      setAnimationComplete(false);
      setIsLastStep(false);
    }
  }, [isAnimating, isPaused]);

  const handleResetComplete = () => {
    setResetHiddenNodes(false);
  };

  const handleReplay = () => {
    // For replay functionality
    setCurrentStep(0);
    setResetHiddenNodes(true);
    setIsAnimating(true);
    setIsPaused(false); // Ensure not paused when replaying
    setAnimationComplete(false);
    setIsLastStep(false);
    isManualNavigation.current = false;
    // Increment tree key to force a re-render
    setTreeKey((prev) => prev + 1);
  };

  // Handle play/pause toggling
  const handlePlayPauseToggle = () => {
    if (animationComplete) {
      // If animation is complete, replay from beginning
      handleReplay();
    } else if (isPaused) {
      // If paused, resume animation
      setIsPaused(false);
      setIsAnimating(true);
      isManualNavigation.current = false;
    } else if (isAnimating) {
      // If playing, pause animation
      setIsPaused(true);
      setIsAnimating(false);
    } else {
      // If not playing and not paused, start animation
      setIsAnimating(true);
      setIsPaused(false);
      isManualNavigation.current = false;
    }
  };

  // Handle indicator click
  const handleIndicatorClick = (index: number) => {
    // Set manual navigation flag
    isManualNavigation.current = true;

    if (isAnimating) {
      setIsAnimating(false);
      setIsPaused(true); // Set to paused state when manually navigating
    }

    setCurrentStep(index);

    setResetHiddenNodes(false);

    // Increment tree key to force a re-render
    setTreeKey((prev) => prev + 1);

    // Check if it's the last step
    if (index >= totalSteps - 1) {
      setAnimationComplete(true);
      setIsLastStep(true);
      setIsPaused(false);
    } else {
      setAnimationComplete(false);
      setIsLastStep(false);
    }
  };

  // Generate progress indicators
  const renderProgressIndicators = () => {
    if (!process || totalSteps === 0) return null;

    return (
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentStep ? "bg-blue-500" : "bg-gray-300"
            } hover:bg-blue-400 transition-colors duration-200 cursor-pointer`}
            aria-label={`Jump to step ${index + 1} of ${totalSteps}`}
            onClick={() => handleIndicatorClick(index)}
            disabled={false}
            type="button"
          />
        ))}
      </div>
    );
  };

  // Determine button label based on animation state
  const getButtonLabel = () => {
    if (animationComplete) {
      return "Replay";
    } else if (isPaused) {
      return "Resume";
    } else if (isAnimating) {
      return "Pause";
    } else {
      return "Play";
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (newOpen) {
          // When opening the dialog, reset and start animation
          setCurrentStep(0);
          setIsAnimating(true);
          setIsPaused(false); // Reset pause state when opening
          setAnimationComplete(false);
          setIsLastStep(false);
          isManualNavigation.current = false;
          // Increment tree key to force a re-render
          setTreeKey((prev) => prev + 1);
        } else {
          // When closing, stop the animation
          setIsAnimating(false);
          setIsPaused(false); // Reset pause state when closing
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="absolute top-4 right-4"
          aria-label="Open Tree View"
        >
          Run Elimination
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[80vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Elimination Journey</DialogTitle>
        </DialogHeader>
        <div className="w-full h-[70vh] flex flex-col">
          <div className="flex-grow relative">
            {currentTree && (
              <Tree
                currentAssertionString={currentAssertionString}
                key={treeKey} // Add a key prop that changes to force re-renders
                data={currentTree}
                resetHiddenNodes={resetHiddenNodes}
                onResetComplete={handleResetComplete}
                onNodeCut={() => {}}
                nextComponent={<div />}
                backComponent={<div />}
              />
            )}

            {!currentTree && !isLastStep && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                No tree data available
              </div>
            )}
            {!currentTree && isLastStep && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-700 text-xl font-medium">
                Elimination Process Complete
              </div>
            )}
          </div>

          <div className="mt-auto">
            {renderProgressIndicators()}

            <div className="flex justify-center items-baseline gap-8 mt-4">
              <div>
                {isBefore && currentAssertion && (
                  <div>
                    <span className="text-dark-500">
                      {currentAssertion.index + 1}.{" "}
                    </span>
                    {currentAssertion.content}
                  </div>
                )}

                {isBefore &&
                  process[Math.floor((currentStep + 1) / 2)]?.treeUnchanged ===
                    true && (
                    <p className="text-sm text-gray-500 italic mt-2 text-center">
                      This assertion did{" "}
                      <span className="font-bold text-red-500">not</span>{" "}
                      eliminate any elimination orders.
                    </p>
                  )}
                <div className="flex justify-center mt-2">
                  <Button size="sm" onClick={handlePlayPauseToggle}>
                    {getButtonLabel()}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OneClickAnimation;
