import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Undo2 } from "lucide-react";
import Tree from "../../../../components/tree";
import CandidateListBar from "@/app/dashboard/components/elimination-tree/candidate-list-bar";
import StepByStep from "@/app/dashboard/components/elimination-tree/step-by-step";
import { useEffect, useMemo, useState } from "react";
import { Candidate } from "../elimination-tree/constants";
import useMultiWinnerDataStore from "@/store/multi-winner-data";
import { explainAssertions } from "@/app/explain-assertions/components/explain-process";
import { useFileDataStore } from "@/store/fileData";
import OneClickAnimation from "./one-click-animation";

interface ProcessStep {
  before: OneWinnerTree;
  assertion: string;
  treeUnchanged?: boolean;
}

interface TreeData {
  process: ProcessStep[];
}

interface OneWinnerTree {
  winnerInfo: Candidate;
  data: TreeData;
}

interface StepByStepViewProps {
  selectedWinnerId: number;
  setSelectedWinnerId: (id: number) => void;
}

function StepByStepView({
  selectedWinnerId,
  setSelectedWinnerId,
}: StepByStepViewProps) {
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [resetHiddenNodes, setResetHiddenNodes] = useState(false);
  const [hasNodeBeenCut, setHasNodeBeenCut] = useState(false);
  const fileData = useFileDataStore((state) => state.fileData);

  const { setCandidateList, setMultiWinner, multiWinner } =
    useMultiWinnerDataStore();

  useEffect(() => {
    if (multiWinner && multiWinner.length > 0) {
      setSelectedWinnerId(multiWinner[0].winnerInfo.id);
    }
  }, [multiWinner]);

  useEffect(() => {
    const response = explainAssertions(fileData);
    if (response.success) {
      setMultiWinner(response.data);
      const jsonData = JSON.parse(fileData);
      const candidateList = jsonData.metadata.candidates.map(
        (name: string, index: number) => ({
          id: index,
          name: name,
        }),
      );

      setCandidateList(candidateList);
    }
  }, [fileData, setMultiWinner, setCandidateList]);

  const possibleWinnerList = useMemo(() => {
    return Array.isArray(multiWinner)
      ? multiWinner.map((cur) => cur.winnerInfo)
      : [];
  }, [multiWinner]);

  const oneWinnerTrees = multiWinner
    ? multiWinner.find((cur) => cur.winnerInfo.id === selectedWinnerId) || null
    : null;

  if (!oneWinnerTrees) {
    return (
      <div className="flex items-center justify-center h-full">loading</div>
    );
  }

  const { data } = oneWinnerTrees;
  const stepSize = data.process.length - 1;

  const isNextDisabled = selectedStep >= stepSize;
  const isBackDisabled = selectedStep <= 1;

  const handleRevertAssertion = () => {
    setResetHiddenNodes(true);
    setHasNodeBeenCut(false);
  };

  const handleResetComplete = () => {
    setResetHiddenNodes(false);
  };

  const handleNodeCut = () => {
    setHasNodeBeenCut(true);
  };

  const NextComponent = (
    <Button
      variant="ghost"
      onClick={() => setSelectedStep((prevStep) => prevStep + 1)}
      disabled={isNextDisabled}
    >
      Next <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );

  const BackComponent = (
    <Button
      variant="ghost"
      onClick={() => setSelectedStep((prevStep) => prevStep - 1)}
      disabled={isBackDisabled}
    >
      <ArrowLeft className="mr-2 h-4 w-4" /> Back
    </Button>
  );

  const currentStepData = data.process[selectedStep];

  if (!currentStepData || !currentStepData.before) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">No data for step {selectedStep}.</p>
      </div>
    );
  }

  const currentAssertionString = `[${(currentStepData.assertion?.index || 0) + 1}] Pruned by: ${
    currentStepData.assertion?.content
  }`;

  return (
    <div className="relative">
      <OneClickAnimation
        process={data.process}
        selectedWinnerId={selectedWinnerId}
      />
      <div>
        <CandidateListBar
          selectedWinnerId={selectedWinnerId}
          handleSelectWinner={(id: number) => {
            handleRevertAssertion();
            setSelectedStep(1);
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
        <div className="w-full h-96" data-tour="seventh-step">
          <Tree
            data={currentStepData.before}
            key={`${selectedWinnerId}-${selectedStep}`}
            nextComponent={NextComponent}
            backComponent={BackComponent}
            resetHiddenNodes={resetHiddenNodes}
            onResetComplete={handleResetComplete}
            onNodeCut={handleNodeCut}
            currentAssertionString={currentAssertionString}
          />
        </div>

        <div className="w-48 flex flex-col gap-4" data-tour="ninth-step">
          <div>
            <div className="font-bold">Applied Assertion:</div>
            <div>
              <span className="text-dark-500">
                {(currentStepData.assertion?.index ?? -1) + 1 || "N/A"}.{" "}
              </span>
              {currentStepData.assertion?.content ??
                "No assertion content available"}
            </div>
          </div>
          {(data.process[selectedStep] as any).treeUnchanged === true && (
            <p className="text-xs text-gray-500 italic mt-2">
              This assertion did{" "}
              <span className="font-bold text-red-500">not</span> rule out any
              elimination orders.
            </p>
          )}
          <div>
            {hasNodeBeenCut && (
              <Button onClick={handleRevertAssertion}>
                Revert Assertion
                <Undo2 className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepByStepView;
