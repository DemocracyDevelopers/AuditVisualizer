import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Candidate } from "./constants";
import SearchDropdown from "./search-dropdown";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { useState } from "react";
import { useEffect, useRef } from "react";

type CandidateListBarProps = {
  selectedWinnerId: number | null;
  handleSelectWinner: (id: number) => void;
  useAvatar: boolean;
  candidateList: Candidate[];
};

function CandidateListBar({
  selectedWinnerId,
  handleSelectWinner,
  useAvatar,
  candidateList,
}: CandidateListBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null); // Ref for the scroll container
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handleCandidateSelect = (candidateId: number) => {
    // setSelectedCandidateId(candidateId);
    handleSelectWinner(candidateId); // Call to display the tree or other action
  };
  return (
    <div className="flex justify-center mb-5 gap-10">
      <div
        className="flex overflow-x-auto w-64 border rounded-md px-2 gap-2"
        ref={scrollContainerRef}
      >
        {candidateList.map((candidate) => (
          <div
            key={candidate.id}
            className="flex flex-col items-center w-12 flex-shrink-0"
          >
            <TooltipProvider>
              <Tooltip>
                {/*<TooltipTrigger*/}
                {/*  onClick={() => handleSelectWinner(candidate.id)}*/}
                {/*  className="leading-9 w-10 h-10 rounded-full cursor-pointer text-center border-2 border-black text-xs overflow-hidden whitespace-nowrap text-ellipsis"*/}
                {/*>*/}
                {/*  {candidate.name}*/}
                {/*</TooltipTrigger>*/}

                <TooltipTrigger
                  onClick={() => handleCandidateSelect(candidate.id)}
                  className={`leading-9 w-10 h-10 rounded-full cursor-pointer text-center border-2 text-xs overflow-hidden whitespace-nowrap text-ellipsis ${
                    selectedWinnerId === candidate.id
                      ? "border-blue-500" // Outer blue circle when selected
                      : "border-black"
                  }`}
                >
                  {candidate.name}
                </TooltipTrigger>
                <TooltipContent>{candidate.name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
      {/*<SearchDropdown candidateList={candidateList} />*/}
      <SearchDropdown
        candidateList={candidateList}
        onSelect={handleCandidateSelect}
      />
    </div>
  );
}

export default CandidateListBar;
