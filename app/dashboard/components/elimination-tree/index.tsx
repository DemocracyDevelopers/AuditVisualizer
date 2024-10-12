"use client";
import CandidateListBar from "@/app/dashboard/components/elimination-tree/candidate-list-bar";
import Dropdown from "@/app/dashboard/components/elimination-tree/dropdown";
import StepByStep from "@/app/dashboard/components/elimination-tree/step-by-step";
// import { demoFromCore } from "@/app/dashboard/components/elimination-tree/demo";
import Tree from "../../../../components/tree";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Undo2 } from "lucide-react";
import useMultiWinnerDataStore from "@/store/MultiWinnerData";
import TooltipWithIcon from "@/app/dashboard/components/Information-icon-text";

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

  const [resetHiddenNodes, setResetHiddenNodes] = useState(false);

  // Use useEffect to initialize selectedWinnerId when multiWinner loads
  useEffect(() => {
    if (multiWinner && multiWinner.length > 0) {
      setSelectedWinnerId(multiWinner[0].winnerInfo.id);
    }
  }, [multiWinner]);

  // Memoize the possible winner list from demoFromCore
  const possibleWinnerList = useMemo(() => {
    return Array.isArray(multiWinner)
      ? multiWinner.map((cur) => cur.winnerInfo)
      : []; // Default to an empty array if demoFromCore is not an array
  }, [multiWinner]); // Ensure this value does not change between renders

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

  const isNextDisabled = selectedStep >= stepSize;

  const NextComponent = (
    <Button
      variant="ghost"
      onClick={() => setSelectedStep((prevStep) => prevStep + 1)}
      disabled={isNextDisabled} // Disable button based on condition
    >
      Next <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );

  const isBackDisabled = selectedStep <= 1;

  const BackComponent = (
    <Button
      variant="ghost"
      onClick={() => setSelectedStep((prevStep) => prevStep - 1)}
      disabled={isBackDisabled} // Disable button based on condition
    >
      <ArrowLeft className="mr-2 h-4 w-4" /> Back
    </Button>
  );

  const handleRevertAssertion = () => {
    setResetHiddenNodes(true);
  };

  const handleResetComplete = () => {
    setResetHiddenNodes(false);
  };

  return (
    <div className="border border-gray-300 rounded-lg p-6 h-auto flex flex-col justify-between pl-10">
      <div className="flex items-center justify-between">
        {/* Elimination Tree title and Tooltip with Icon */}
        <div className="flex items-center">
          <h3 className="text-2xl font-bold">Elimination Tree</h3>
          <TooltipWithIcon
            title="Need Help?"
            description="For detailed guidance on the elimination tree process, please refer to our"
            linkText="Tutorial"
            linkHref="/tutorial"
          />
        </div>

        {/* <Dropdown /> */}
      </div>
      <div>
        <CandidateListBar
          selectedWinnerId={selectedWinnerId}
          handleSelectWinner={(id: number) => {
            handleRevertAssertion();
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
            key={`${selectedWinnerId}-${selectedStep}`}
            nextComponent={NextComponent}
            backComponent={BackComponent}
            resetHiddenNodes={resetHiddenNodes}
            onResetComplete={handleResetComplete}
          />
        </div>
        <div className="w-48 flex flex-col gap-4">
          <div>
            <div className="font-bold">Applied Assertion: </div>
            <div>{data.process[selectedStep].assertion}</div>
          </div>

          <div>
            <Button onClick={handleRevertAssertion}>
              Revert Assertion
              <Undo2 className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EliminationTree;
