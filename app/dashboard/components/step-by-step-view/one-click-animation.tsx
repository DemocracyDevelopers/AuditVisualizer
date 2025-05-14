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

interface OneClickAnimationProps {
  process: Array<{
    step: number;
    trees?: TreeNode | null; // step 0
    assertion?: { index: number; content: string };
    before?: TreeNode | null;
    after?: TreeNode | null;
    treeUnchanged?: boolean;
  }>;
  selectedWinnerId: number; // Add selectedWinnerId as a prop
}

// Helper function to deep clone tree data
function deepCloneTree(tree: TreeNode | undefined | null): TreeNode | null {
  if (!tree) return null;
  return JSON.parse(JSON.stringify(tree));
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
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isLastStep, setIsLastStep] = useState(false);
  // Add a key state to force tree re-renders
  const [treeKey, setTreeKey] = useState(0);
  // 添加一个标志，表示当前操作是否是由用户点击指示器触发的
  const isManualNavigation = useRef(false);

  const totalSteps =
    process && process.length > 0
      ? process.length * 2 - 1 // Initial tree + (before & after for each process item)
      : 0;

  useEffect(() => {
    console.log("Selected winner ID changed:", selectedWinnerId, process);
  }, [selectedWinnerId, process, currentStep]);

  // Reset animation state when selectedWinnerId changes
  useEffect(() => {
    setCurrentStep(0);
    setIsAnimating(false);
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
      !animationComplete &&
      process &&
      process.length > 0 &&
      !isManualNavigation.current // 只有当不是手动导航时才自动开始动画
    ) {
      // Reset to the first step
      setCurrentStep(0);
      setIsAnimating(true);
      setIsLastStep(false);
      // Increment tree key to force a re-render
      setTreeKey((prev) => prev + 1);
    }

    // 重置手动导航标志
    isManualNavigation.current = false;
  }, [open, isAnimating, animationComplete, process]);

  const isBefore = (currentStep - 1) % 2 === 0; // Even offset (1,3,5...) = before, Odd offset (2,4,6...) = after

  // Handle tree updates based on current step
  useEffect(() => {
    if (!process || process.length === 0) return;

    console.log(
      `Updating tree for step ${currentStep} of ${totalSteps} total steps`,
    );

    // Check if this is the last step
    setIsLastStep(currentStep >= totalSteps - 1);

    // Increment tree key to force a re-render
    setTreeKey((prev) => prev + 1);

    // Update tree and assertion based on current step
    if (currentStep === 0) {
      // First step uses process[0].trees
      console.log("Setting tree to process[0].trees");
      setCurrentTree(deepCloneTree(process[0].trees) || null);
      setCurrentAssertion(process[0]?.assertion ?? null);
    } else {
      // Calculate which process item and whether it's before or after
      const processIndex = Math.floor((currentStep + 1) / 2);

      if (isBefore) {
        console.log(`Setting tree to process[${processIndex}].before`);
        setCurrentTree(deepCloneTree(process[processIndex].before) || null);
      } else {
        console.log(`Setting tree to process[${processIndex}].after`);
        setCurrentTree(deepCloneTree(process[processIndex].after) || null);
      }
      setCurrentAssertion(process[processIndex]?.assertion ?? null);
    }
  }, [currentStep, process, totalSteps]);

  // Animation timer effect - 只有在isAnimating为true且不是手动导航时才会运行
  useEffect(() => {
    // 如果是手动导航，不执行自动动画
    if (isManualNavigation.current) {
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
          setAnimationComplete(true);
          setIsLastStep(true);
          console.log("Animation complete at step:", nextStep);
        }
      }, 1000); // 1 second per step
    } else if (isAnimating && currentStep >= totalSteps - 1) {
      // Force stop animation if we're already at or beyond the last step
      setIsAnimating(false);
      setAnimationComplete(true);
      setIsLastStep(true);
      console.log("Animation stopped - already at final step");
    }

    return () => {
      if (animationTimer) {
        clearTimeout(animationTimer);
      }
    };
  }, [currentStep, isAnimating, totalSteps]);

  // Reset animation complete flag when animation starts
  useEffect(() => {
    if (isAnimating && !isManualNavigation.current) {
      setAnimationComplete(false);
      setIsLastStep(false);
    }
  }, [isAnimating]);

  const handleResetComplete = () => {
    setResetHiddenNodes(false);
  };

  const handleReplay = () => {
    setCurrentStep(0);
    setResetHiddenNodes(true);
    setIsAnimating(true);
    setAnimationComplete(false);
    setIsLastStep(false);
    isManualNavigation.current = false;
    // Increment tree key to force a re-render
    setTreeKey((prev) => prev + 1);
  };

  // Handle indicator click
  const handleIndicatorClick = (index: number) => {
    // 设置手动导航标志
    isManualNavigation.current = true;

    // 如果动画正在播放，停止它
    if (isAnimating) {
      setIsAnimating(false);
    }

    // 设置当前步骤为点击的索引
    setCurrentStep(index);

    // 设置其他相关状态
    setResetHiddenNodes(false);

    // Increment tree key to force a re-render
    setTreeKey((prev) => prev + 1);

    // 检查是否是最后一步
    if (index >= totalSteps - 1) {
      setAnimationComplete(true);
      setIsLastStep(true);
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
            disabled={false} // 不再禁用按钮，即使在动画中也可以点击
            type="button"
          />
        ))}
      </div>
    );
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
          setAnimationComplete(false);
          setIsLastStep(false);
          isManualNavigation.current = false;
          // Increment tree key to force a re-render
          setTreeKey((prev) => prev + 1);
        } else {
          // When closing, stop the animation
          setIsAnimating(false);
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
              </div>
              <Button
                onClick={handleReplay}
                disabled={isAnimating && !isManualNavigation.current}
                className="px-8"
              >
                {isAnimating && !isManualNavigation.current
                  ? "Playing..."
                  : animationComplete
                    ? "Replay"
                    : "Play"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OneClickAnimation;
