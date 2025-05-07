import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Undo2 } from "lucide-react";
import Tree from "../../../../components/tree";
import CandidateListBar from "@/app/dashboard/components/elimination-tree/candidate-list-bar";
import StepByStep from "@/app/dashboard/components/elimination-tree/step-by-step";
import { useEffect, useMemo, useState } from "react";
import { Candidate } from "../elimination-tree/constants";
import useMultiWinnerDataStore from "@/store/multi-winner-data";
import { AvatarColor } from "@/utils/avatar-color";
import { explainAssertions } from "@/app/explain-assertions/components/explain-process";
import { useFileDataStore } from "@/store/fileData";
import OneClickAnimation from "./one-click-animation";

interface ProcessStep {
  before: OneWinnerTree;
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
    const avatarColor = new AvatarColor();
    const response = explainAssertions(fileData);
    // 根据核心库返回的 response 进行处理
    if (response.success) {
      // 成功解析并校验，将数据存储到全局状态中
      setMultiWinner(response.data);
      const jsonData = JSON.parse(fileData);
      const candidateList = jsonData.metadata.candidates.map(
        (name: string, index: number) => ({
          id: index,
          name: name,
          color: avatarColor.getColor(index),
        }),
      );

      setCandidateList(candidateList);
    }
  }, [fileData, setMultiWinner, setCandidateList]);

  const possibleWinnerList = useMemo(() => {
    return Array.isArray(multiWinner)
      ? multiWinner.map((cur) => cur.winnerInfo)
      : []; // Default to an empty array if multiWinner is not an array
  }, [multiWinner]);

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

  const currentStepData = data.process[selectedStep];

  // 安全防御：如果当前 step 数据不存在，则返回 fallback UI
  if (!currentStepData || !currentStepData.before) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">No data for step {selectedStep}.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Pass selectedWinnerId to OneClickAnimation */}
      <OneClickAnimation
        process={data.process}
        selectedWinnerId={selectedWinnerId}
      />
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
          {/* <Tree
            data={data.process[selectedStep].before!}
            key={`${selectedWinnerId}-${selectedStep}`}
            nextComponent={NextComponent}
            backComponent={BackComponent}
            resetHiddenNodes={resetHiddenNodes}
            onResetComplete={handleResetComplete}
            onNodeCut={handleNodeCut}
          /> */}
          <Tree
            data={currentStepData.before}
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
            {/* <div>{data.process[selectedStep].assertion}</div> */}
            <div>{currentStepData.assertion}</div>
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
    </div>
  );
}

export default StepByStepView;
