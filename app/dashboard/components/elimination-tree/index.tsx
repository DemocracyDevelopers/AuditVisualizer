"use client";
import Dropdown from "@/app/dashboard/components/elimination-tree/dropdown";
import TooltipWithIcon from "@/app/dashboard/components/Information-icon-text";
import useMultiWinnerDataStore from "@/store/multi-winner-data";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import StepByStepView from "../step-by-step-view";
import { Candidate } from "@/app/dashboard/components/elimination-tree/constants";

// Define the interface for OneWinnerTree based on StepByStepView props
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

function EliminationTree() {
  const [tabValue, setTabValue] = useState<string>("default");
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [selectedWinnerId, setSelectedWinnerId] = useState<number>(0);

  const handleTabChange = (value: string) => {
    // Only allow changing tabs if not locked
    if (!isLocked || value === tabValue) {
      setTabValue(value);
    }
  };

  // Update the type definition to match StepByStepView's expected type
  const { multiWinner } = useMultiWinnerDataStore() as {
    multiWinner: OneWinnerTree[] | null;
  };

  // Define loading state
  const isLoading = multiWinner === null;

  // Use useEffect to initialize selectedWinnerId when multiWinner loads
  useEffect(() => {
    if (multiWinner && multiWinner.length > 0) {
      setSelectedWinnerId(multiWinner[0].winnerInfo.id);
    }
  }, [multiWinner]);

  // Memoize the possible winner list from multiWinner
  const possibleWinnerList = useMemo(() => {
    return Array.isArray(multiWinner)
      ? multiWinner.map((cur) => cur.winnerInfo)
      : []; // Default to an empty array if multiWinner is not an array
  }, [multiWinner]); // Ensure this value does not change between renders

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        loading {/* Replace with your loading component */}
      </div>
    );
  }

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
        <Tabs
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
        </Tabs>
      </div>

      {tabValue === "default" ? (
        <div>default</div>
      ) : (
        <StepByStepView
          possibleWinnerList={possibleWinnerList}
          multiWinner={multiWinner}
          selectedWinnerId={selectedWinnerId}
          setSelectedWinnerId={setSelectedWinnerId}
        />
      )}
    </div>
  );
}

export default EliminationTree;
