import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Candidate } from "./constants";
import SearchDropdown from "./search-dropdown";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

type CandidateListBarProps = {
  selectedWinnerId: number;
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
  return (
    <div className="flex justify-center mb-5 gap-10">
      <div className="flex">
        {candidateList.map((candidate) => (
          <div key={candidate.id} className="flex flex-col items-center w-12">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  onClick={() => handleSelectWinner(candidate.id)}
                  className="leading-9 w-10 h-10 rounded-full cursor-pointer text-center border-2 border-black text-xs overflow-hidden whitespace-nowrap text-ellipsis"
                >
                  {candidate.name}
                </TooltipTrigger>
                <TooltipContent>{candidate.name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
      <SearchDropdown candidateList={candidateList} />
    </div>
  );
}

export default CandidateListBar;
