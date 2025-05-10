"use client";
import Dropdown from "@/app/dashboard/components/elimination-tree/dropdown";
import TooltipWithIcon from "@/app/dashboard/components/Information-icon-text";
import useMultiWinnerDataStore from "@/store/multi-winner-data";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import StepByStepView from "../step-by-step-view";
import LazyLoadView from "../lazyload-view";
import {
  explainAssertions,
  getCandidateNumber,
} from "@/app/explain-assertions/components/explain-process";
import { useFileDataStore } from "@/store/fileData";
import useTreeTabStore from "@/store/use-tree-tab-store";

function EliminationTree() {
  const { currentTab, setCurrentTab } = useTreeTabStore();
  // "default" | "step-by-step"
  // const [tabValue, setTabValue] = useState<string>("default");
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [selectedWinnerId, setSelectedWinnerId] = useState<number>(0);

  const fileData = useFileDataStore((state) => state.fileData);

  useEffect(() => {
    const candidateNumber = getCandidateNumber(fileData);
    // NOTE: 根据情况修改
    if (candidateNumber < 6) {
      setIsLocked(false);
    }
  }, [fileData]);

  // const handleTabChange = (value: string) => {
  //   // Only allow changing tabs if not locked
  //   if (!isLocked || value === tabValue) {
  //     setTabValue(value);
  //   }
  // };

  const handleTabChange = (value: string) => {
    if (!isLocked) {
      setCurrentTab(value as "default" | "step-by-step");
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-6 h-auto flex flex-col justify-between pl-10">
      <div className="flex items-center justify-between">
        {/* Elimination Tree title and Tooltip with Icon */}
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
        {/* <Tabs
          defaultValue="default"
          onValueChange={handleTabChange}
          value={tabValue}
          orientation="horizontal"
          dir="ltr"
          activationMode="automatic"
        >
          <TabsList>
            <TabsTrigger
              value="default"
              className={
                isLocked && tabValue !== "default"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            >
              Default
            </TabsTrigger>
            <TabsTrigger
              value="step-by-step"
              className={
                isLocked && tabValue !== "step-by-step"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            >
              Step By Step
              {isLocked && <Lock className="text-red-500 ml-2" size={16} />}
            </TabsTrigger>
          </TabsList>
          
        </Tabs> */}
        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="default">Default</TabsTrigger>
            <TabsTrigger value="step-by-step">
              Step by Step
              {isLocked && <Lock className="text-red-500 ml-2" size={16} />}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* {isLocked || tabValue === "default" ? (
        <LazyLoadView />
      ) : (
        <StepByStepView
          selectedWinnerId={selectedWinnerId}
          setSelectedWinnerId={setSelectedWinnerId}
        />
      )} */}
      {/* Views */}
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
