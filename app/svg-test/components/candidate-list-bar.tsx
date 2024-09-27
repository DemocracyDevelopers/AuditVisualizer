import { Input } from "@/components/ui/input";
import SearchDropdown from "./search-dropdown";
import { candidateList } from "../constants";

function CandidateListBar() {
  return (
    <div className="flex justify-center">
      {candidateList.map((candidate) => (
        <div key={candidate.id} className="flex flex-col items-center w-14">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div>{candidate.name}</div>
        </div>
      ))}
      <SearchDropdown />
    </div>
  );
}

export default CandidateListBar;
