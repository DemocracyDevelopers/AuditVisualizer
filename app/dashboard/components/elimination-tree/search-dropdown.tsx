"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Candidate } from "./constants";
import { Card } from "@/components/ui/card";

function SearchDropdown({
  candidateList,
  onSelect,
}: {
  candidateList: Candidate[];
  onSelect: (candidateId: number) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredList = candidateList.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelect = (candidate: Candidate) => {
    setSearchTerm(candidate.name);
    onSelect(candidate.id);
    setIsOpen(false);
  };
  return (
    <div className="relative">
      <Input
        value={searchTerm}
        type="search"
        placeholder="Search for candidate"
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      />
      {isOpen && (
        <Card className="z-10 absolute w-full p-1 mt-2 gap-2">
          {filteredList.length > 0 ? (
            filteredList.map((candidate) => (
              <div
                key={candidate.id}
                onMouseDown={() => handleSelect(candidate)}
                className="cursor-pointer p-2 rounded-sm hover:bg-gray-200 "
              >
                {candidate.name}
              </div>
            ))
          ) : (
            <div className="p-2">No candidates found</div>
          )}
        </Card>
      )}
    </div>
  );
}

export default SearchDropdown;
