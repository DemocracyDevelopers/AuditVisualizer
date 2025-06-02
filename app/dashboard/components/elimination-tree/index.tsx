"use client";
import TooltipWithIcon from "@/app/dashboard/components/Information-icon-text";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock } from "lucide-react";
import { useEffect, useState } from "react";
import StepByStepView from "../step-by-step-view";
import LazyLoadView from "../lazyload-view";
import { getCandidateNumber } from "@/app/explain-assertions/components/explain-process";
import { useFileDataStore } from "@/store/fileData";
import useTreeTabStore from "@/store/use-tree-tab-store";

function EliminationTree() {
  const { currentTab, setCurrentTab } = useTreeTabStore();
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [selectedWinnerId, setSelectedWinnerId] = useState<number>(0);

  const fileData = useFileDataStore((state) => state.fileData);

  useEffect(() => {
    const candidateNumber = getCandidateNumber(fileData);
    if (candidateNumber < 6) {
      setIsLocked(false);
    }
  }, [fileData]);

  const handleTabChange = (value: string) => {
    if (!isLocked) {
      setCurrentTab(value as "default" | "step-by-step");
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-6 h-auto flex flex-col justify-between pl-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h3 className="text-2xl font-bold">Elimination Tree</h3>
            <TooltipWithIcon
              title="Need Help?"
              description="For detailed guidance on the elimination tree process, please refer to our"
              linkText="Tutorial"
              linkHref="/tutorial"
            />
          </div>
        </div>
        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="default">Default</TabsTrigger>
            <TabsTrigger value="step-by-step" data-tour="step-by-step-button">
              Step by Step
              {isLocked && <Lock className="text-red-500 ml-2" size={16} />}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {isLocked || currentTab === "default" ? (
        <LazyLoadView />
      ) : (
        <StepByStepView
          selectedWinnerId={selectedWinnerId}
          setSelectedWinnerId={setSelectedWinnerId}
        />
      )}
    </div>
  );
}

export default EliminationTree;
