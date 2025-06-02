import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { Crown } from "lucide-react";
import { Candidate } from "./constants";
import { useEffect, useRef } from "react";
import useMultiWinnerDataStore from "@/store/multi-winner-data";
import { Avatar, getSmartDisplayName } from "@/components/ui/avatar";
import SearchDropdown from "./search-dropdown";

type CandidateListBarProps = {
  selectedTreeId: number | null;
  setSelectedTreeId: (id: number) => void;
  handleSelectWinner?: (id: number) => void;
  candidateList: Candidate[];
};

// Component for displaying candidate avatars + search dropdown
function DefaultCandidateListBar({
  selectedTreeId,
  setSelectedTreeId,
  candidateList,
}: CandidateListBarProps) {
  const { winnerInfo } = useMultiWinnerDataStore();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollLeft += e.deltaX;
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Handle avatar selection (sets current tree selection)
  const handleCandidateSelect = (candidateId: number) => {
    setSelectedTreeId(candidateId);
  };

  return (
    <div
      className="flex justify-center items-end mb-5 gap-10"
      data-tour="fifth-step"
    >
      <div
        className="flex gap-2 rounded-md w-[220px] px-2 overflow-x-scroll"
        ref={scrollContainerRef}
      >
        {candidateList.map((candidate) => {
          const { shortName, explanation } = getSmartDisplayName(
            candidate.id,
            candidateList,
          );

          return (
            <div
              key={candidate.id}
              className="flex flex-col items-center w-12 flex-shrink-0"
            >
              <div className="h-5 mb-1 flex items-center justify-center">
                {winnerInfo?.id === candidate.id ? (
                  <Crown className="text-yellow-500 h-5 w-5" />
                ) : (
                  <div className="h-5 w-5 opacity-0" />
                )}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div onClick={() => handleCandidateSelect(candidate.id)}>
                      <Avatar
                        candidateId={candidate.id}
                        className={`cursor-pointer ${
                          selectedTreeId === candidate.id
                            ? "border-blue-500"
                            : "border-black"
                        }`}
                        displayStyle="smart"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {explanation || candidate.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        })}
      </div>
      <SearchDropdown
        candidateList={candidateList}
        onSelect={handleCandidateSelect}
      />
    </div>
  );
}

export default DefaultCandidateListBar;
