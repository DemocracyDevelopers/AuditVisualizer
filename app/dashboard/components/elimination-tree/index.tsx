import CandidateListBar from "@/app/dashboard/components/elimination-tree/candidate-list-bar";
import Dropdown from "@/app/dashboard/components/elimination-tree/dropdown";
import StepByStep from "@/app/dashboard/components/elimination-tree/step-by-step";
import { demoFromCore } from "@/app/dashboard/components/elimination-tree/demo";
import Tree from "@/components/Tree";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

function EliminationTree() {
  const [selectedWinnerId, setSelectedWinnerId] = useState<number>(
    demoFromCore[0].winnerInfo.id,
  );
  const oneWinnerTrees = useMemo(
    () => demoFromCore.find((cur) => cur.winnerInfo.id === selectedWinnerId)!,
    [selectedWinnerId],
  ); // 暂时写成一定能找到
  const { winnerInfo, data } = oneWinnerTrees;
  const stepSize = data.process.length - 1; // 处理stepSize为0的情况
  const [selectedStep, setSelectedStep] = useState<number>(1);

  const possibleWinnerList = useMemo(
    () => demoFromCore.map((cur) => cur.winnerInfo),
    [demoFromCore],
  );

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
      disabled={isNextDisabled} // 根据条件禁用按钮
    >
      Next <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
  return (
    // <div className="border border-gray-300 rounded-lg p-6 h-96 flex flex-col justify-between pl-10">
    <div className="border border-gray-300 rounded-lg p-6 h-auto flex flex-col justify-between pl-10">
      <div className="flex justify-between">
        <h3 className="text-2xl font-bold">Elimination Tree</h3>
        <Dropdown />
      </div>
      <div>
        <CandidateListBar
          selectedWinnerId={selectedWinnerId}
          handleSelectWinner={(id: number) => {
            setSelectedStep(1); // 重置step
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
