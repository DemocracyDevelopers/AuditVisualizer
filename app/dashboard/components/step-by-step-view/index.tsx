import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Undo2 } from "lucide-react";
import Tree from "../../../../components/tree";
import CandidateListBar from "@/app/dashboard/components/elimination-tree/candidate-list-bar";
import StepByStep from "@/app/dashboard/components/elimination-tree/step-by-step";
import { useState } from "react";
import { Candidate } from "../elimination-tree/constants";

interface ProcessStep {
  before: any;
  assertion: string;
}

interface TreeData {
  process: ProcessStep[];
}

interface OneWinnerTree {
  winnerInfo: Candidate;
  data: TreeData;
}

interface StepByStepViewProps {
  possibleWinnerList: Candidate[];
  multiWinner: OneWinnerTree[] | null;
  selectedWinnerId: number;
  setSelectedWinnerId: (id: number) => void;
}

function StepByStepView({
  possibleWinnerList,
  multiWinner,
  selectedWinnerId,
  setSelectedWinnerId,
}: StepByStepViewProps) {
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [resetHiddenNodes, setResetHiddenNodes] = useState(false);
  const [hasNodeBeenCut, setHasNodeBeenCut] = useState(false);

  // Find the selected winner's tree data
  const oneWinnerTrees = multiWinner
    ? multiWinner.find((cur) => cur.winnerInfo.id === selectedWinnerId) || null
    : null;

  // Handle case when oneWinnerTrees is null
  if (!oneWinnerTrees) {
    return (
      <div className="flex items-center justify-center h-full">
        loading {/* Replace with your loading component */}
      </div>
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

  return (
    <>
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
        <div className="w-full h-96" data-tour="seventh-step">
          <Tree
            data={data.process[selectedStep].before!}
            key={`${selectedWinnerId}-${selectedStep}`}
            nextComponent={NextComponent}
            backComponent={BackComponent}
            resetHiddenNodes={resetHiddenNodes}
            onResetComplete={handleResetComplete}
            onNodeCut={handleNodeCut}
          />
        </div>
        <div className="w-48 flex flex-col gap-4" data-tour="ninth-step">
          <div>
            <div className="font-bold">Applied Assertion: </div>
            <div>{data.process[selectedStep].assertion}</div>
          </div>

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
    </>
  );
}

export default StepByStepView;
