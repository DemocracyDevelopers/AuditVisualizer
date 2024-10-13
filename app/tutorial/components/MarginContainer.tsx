// components/MarginContainer.tsx

import React from "react";

interface MarginContainerProps {
  collapsed: boolean;
  sidebarWidth: number;
  children: React.ReactNode;
}

const MarginContainer: React.FC<MarginContainerProps> = ({
  collapsed,
  sidebarWidth,
  children,
}) => {
  return (
    <div
      className="p-4"
      style={{
        marginLeft: collapsed ? 0 : sidebarWidth, // Adjust position based on sidebar state
        transition: "margin-left 0.3s ease",
      }}
    >
      {children}
    </div>
  );
};

export default MarginContainer;
