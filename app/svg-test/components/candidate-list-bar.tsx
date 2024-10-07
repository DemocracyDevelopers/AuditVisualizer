import { Candidate } from "../constants";
import SearchDropdown from "./search-dropdown";

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
    <div className="flex justify-center mb-5">
      {candidateList.map((candidate) => (
        <div key={candidate.id} className="flex flex-col items-center w-12">
          <div
            // onClick={() => setSelectedWinnerId(candidate.id)}
            onClick={() => handleSelectWinner(candidate.id)}
            className="w-10 h-10 rounded-full cursor-pointer flex items-center justify-center border-2 border-black text-xs"
          >
            {candidate.name}
          </div>
        </div>
      ))}
      <SearchDropdown />
    </div>
  );
}

export default CandidateListBar;
