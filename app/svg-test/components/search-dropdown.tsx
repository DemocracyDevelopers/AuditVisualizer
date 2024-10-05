"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Candidate, candidateList } from "../constants";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

function SearchDropdown() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const [isOpen, setIsOpen] = useState(false);
  //不能用shadcn的popover,因为他的popover弹出瞬间会让input失去焦点

  const filteredList = candidateList.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const handleSelect = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setSearchTerm(candidate.name);
    console.log("Selected Candidate:", candidate.name);
    setIsOpen(false);
  };
  return (
    <div className="relative">
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      />
      {/* 虽然没用,但是得有这个才能正常触发popover */}
      {isOpen && (
        <Card className="z-10 absolute w-full p-1 mt-2 gap-2">
          {filteredList.length > 0 ? (
            filteredList.map((candidate) => (
              <div
                key={candidate.id}
                // onClick 在 onBlur 之后,onMouseDown 在 onBlur 之前. 这是可能的Bug原因
                onMouseDown={() => handleSelect(candidate)}
                className="cursor-pointer p-2 rounded-sm hover:bg-gray-200 "
              >
                {/* {candidate.avatar && (
                  <Image
                    src={candidate.avatar}
                    alt={candidate.name}
                    className="inline-block w-6 h-6 mr-2"
                  />
                )} */}
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
