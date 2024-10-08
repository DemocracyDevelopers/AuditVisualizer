import React, { useEffect } from "react";
import { AvatarColor } from "@/utils/avatarColor";
import create from "zustand";

interface AvatarProps {
  userId: number;
  userName: string;
  totalUsers: number;
}
interface Candidate {
  id: number;
  name: string;
  color: string;
}

const useStore = create<{
  candidateList: Candidate[];
  assignColorsToCandidates: () => void;
}>((set) => ({
  candidateList: [
    {
      id: 0,
      name: "Candidate 1",
      color: "",
    },
    {
      id: 1,
      name: "Candidate 2",
      color: "",
    },
  ],

  assignColorsToCandidates: () => {
    const avatarColor = new AvatarColor();
    set((state) => ({
      candidateList: state.candidateList.map((candidate) => ({
        ...candidate,
        color: avatarColor.getColor(candidate.id),
      })),
    }));
  },
}));

const avatarColor = new AvatarColor();

const Avatar: React.FC<AvatarProps> = ({ userId, userName, totalUsers }) => {
  const isWithinColorLimit = userId < 16; //
  const avatarSize = 40; // avatar size

  const assignColorsToCandidates = useStore(
    (state) => state.assignColorsToCandidates,
  );
  const candidateList = useStore((state) => state.candidateList);

  useEffect(() => {
    assignColorsToCandidates();
  }, [assignColorsToCandidates]);

  const candidate = candidateList.find((candidate) => candidate.id === userId);
  const backgroundColor = candidate ? candidate.color : "#CCCCCC";

  return (
    <div
      className={`w-[${avatarSize}] h-[${avatarSize}] rounded-full flex items-center justify-center text-white font-bold bg-[${backgroundColor}] text-[14px] uppercase`}
    >
      {isWithinColorLimit
        ? null
        : // first five
          userName.substring(0, 5)}
    </div>
  );
};

export default Avatar;
