"use client";
import CandidateListBar from "@/app/dashboard/components/elimination-tree/candidate-list-bar";
import Dropdown from "@/app/dashboard/components/elimination-tree/dropdown";
import StepByStep from "@/app/dashboard/components/elimination-tree/step-by-step";
import { demoFromCore } from "@/app/dashboard/components/elimination-tree/demo";
import Tree from "@/components/Tree";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import useMultiWinnerDataStore from "@/store/MultiWinnerData";

function EliminationTree() {
  const { multiWinner } = useMultiWinnerDataStore();
  useEffect(() => {
    console.log("?", multiWinner);
  }, [multiWinner]);

  // Define loading state
  const isLoading = multiWinner === null;

  // Ensure multiWinner has at least one winnerInfo
  const [selectedWinnerId, setSelectedWinnerId] = useState<number>(0);
  const [selectedStep, setSelectedStep] = useState<number>(1); // Ensure this is always defined

  // Use useEffect to initialize selectedWinnerId when multiWinner loads
  useEffect(() => {
    if (multiWinner && multiWinner.length > 0) {
      setSelectedWinnerId(multiWinner[0].winnerInfo.id);
    }
  }, [multiWinner]);

  // Memoize the possible winner list from demoFromCore
  const possibleWinnerList = useMemo(() => {
    return Array.isArray(demoFromCore)
      ? demoFromCore.map((cur) => cur.winnerInfo)
      : []; // Default to an empty array if demoFromCore is not an array
  }, [demoFromCore]); // Ensure this value does not change between renders

  const oneWinnerTrees = useMemo(() => {
    return multiWinner
      ? multiWinner.find((cur) => cur.winnerInfo.id === selectedWinnerId) ||
          null
      : null;
  }, [selectedWinnerId, multiWinner]);

  // Handle case when oneWinnerTrees is null
  if (isLoading || !oneWinnerTrees) {
    return (
      <div className="flex items-center justify-center h-full">
        loading {/* Replace with your loading component */}
      </div>
    );
  }

  const { winnerInfo, data } = oneWinnerTrees;
  const stepSize = data.process.length - 1; // Handle stepSize for 0 case

  const handleNext = () => {
    if (selectedStep < stepSize) {
      setSelectedStep((prevStep) => prevStep + 1);
    }
  };

  const isNextDisabled = selectedStep >= stepSize;

  const NextComponent = (
    <Button
      variant="ghost"
      onClick={handleNext}
      disabled={isNextDisabled} // Disable button based on condition
    >
      Next <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <div className="border border-gray-300 rounded-lg p-6 h-auto flex flex-col justify-between pl-10">
      <div className="flex justify-between">
        <h3 className="text-2xl font-bold">Elimination Tree</h3>
        <Dropdown />
      </div>
      <div>
        <CandidateListBar
          selectedWinnerId={selectedWinnerId}
          handleSelectWinner={(id: number) => {
            setSelectedStep(1); // Reset step
            setSelectedWinnerId(id);
          }}
          useAvatar={false}
          candidateList={possibleWinnerList}
        />
      </div>
      <div className="flex">
        <StepByStep
          stepSize={stepSize}
          setSelectedStep={setSelectedStep}
          selectedStep={selectedStep}
        />
        <div className="w-full h-96">
          <Tree
            data={data.process[selectedStep].before!}
            key={selectedStep}
            nextComponent={NextComponent}
          />
        </div>
      </div>
    </div>
  );
}

export default EliminationTree;
