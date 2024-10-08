import React, { useEffect } from "react";
import { useStore } from "@/store/resultDetailStore"; // 引入 zustand store
import { AvatarColor } from "@/utils/avatarColor";

const Avatar = () => {
  const { candidateList, updateCandidateColor } = useStore();
  const avatarColor = new AvatarColor();

  useEffect(() => {
    candidateList.forEach((candidate, index) => {
      if (!candidate.color) {
        // 如果 color 为空，则分配颜色
        const color = avatarColor.getColor(index);
        updateCandidateColor(candidate.id, color); // 更新颜色
      }
    });
  }, [candidateList.length, avatarColor, updateCandidateColor]); // 依赖项为 candidateList.length 以避免不必要的重渲染

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

export default Avatar;
