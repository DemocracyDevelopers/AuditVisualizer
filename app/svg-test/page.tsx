"use client";
import { Button } from "@/components/ui/button";
import Tree from "../../components/Tree";
import Dropdown from "./components/dropdown";
import StepByStep from "./components/step-by-step";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download } from "lucide-react";
import CandidateListBar from "./components/candidate-list-bar";
import { demoFromCore } from "./demo";
import { useMemo, useState } from "react";

function SvgTest() {
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

  return (
    <div>
      <div>page</div>
      <div className="flex justify-center">
        <Dropdown />
      </div>

      {/* <Svg data={testData} /> */}

      <div className="flex">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div>Process Explores</div>
              <Button size="sm">
                Save
                <Download className="ml-1 h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <div className="flex justify-between pl-10">
            <StepByStep
              stepSize={stepSize}
              setSelectedStep={setSelectedStep}
              selectedStep={selectedStep}
            />
            <div className="w-full h-[400px]">
              <CandidateListBar
                selectedWinnerId={selectedWinnerId}
                handleSelectWinner={(id: number) => {
                  setSelectedStep(1); // 重置step
                  setSelectedWinnerId(id);
                }}
                useAvatar={false}
                candidateList={possibleWinnerList}
              />
              {/* <Tree data={dataOneTree2} /> */}

              <Tree
                data={data.process[selectedStep].before!}
                key={selectedStep}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default SvgTest;
