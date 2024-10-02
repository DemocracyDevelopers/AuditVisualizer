// dashboard/components/Avatar.tsx

import React from "react";
import { AvatarColor } from "@/utils/avatarColor";

interface AvatarProps {
  userId: number;
  userName: string;
  totalUsers: number;
}

const avatarColor = new AvatarColor();

const Avatar: React.FC<AvatarProps> = ({ userId, userName, totalUsers }) => {
  const isWithinColorLimit = userId < 16; //
  const avatarSize = 40; // avatar size

  const styles: React.CSSProperties = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFF",
    fontWeight: "bold",
    backgroundColor: isWithinColorLimit
      ? avatarColor.getColor(userId)
      : "#CCCCCC", // 超出16时使用默认灰色
    fontSize: 14,
    textTransform: "uppercase",
  };

  return (
    <div style={styles}>
      {isWithinColorLimit
        ? null
        : // first five
          userName.substring(0, 5)}
    </div>
  );
};

export default Avatar;
