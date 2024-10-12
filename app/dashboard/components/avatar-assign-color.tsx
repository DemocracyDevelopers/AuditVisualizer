//avatar-assign-color.tsx
import React, { useEffect, useMemo, useState } from "react";
import useMultiWinnerDataStore from "@/store/MultiWinnerData";
import { AvatarColor } from "@/utils/avatarColor";

interface AvatarProps {
  onComplete: () => void;
}

const AvatarAssignColor: React.FC<AvatarProps> = ({ onComplete }) => {
  const { candidateList, setCandidateList } = useMultiWinnerDataStore();
  const avatarColor = useMemo(() => new AvatarColor(), []);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    if (hasCompleted) return;

    console.log("candidateList:", candidateList);

    if (candidateList.length === 0) {
      onComplete();
      setHasCompleted(true);
      return;
    }

    let hasUpdated = false;

    const updatedCandidates = candidateList.map((candidate, index) => {
      if (!candidate.color) {
        hasUpdated = true;
        const color = avatarColor.getColor(index);
        return { ...candidate, color };
      }
      return candidate;
    });

    if (hasUpdated) {
      setCandidateList(updatedCandidates);
    }

    onComplete();
    setHasCompleted(true);
  }, [candidateList, avatarColor, setCandidateList, onComplete, hasCompleted]);

  return (
    <div>
      {candidateList.map((candidate) => (
        <div key={candidate.id} style={{ backgroundColor: candidate.color }}>
          {candidate.name}
        </div>
      ))}
    </div>
  );
};

export default AvatarAssignColor;
