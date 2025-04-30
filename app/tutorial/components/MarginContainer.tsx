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
      <div className="px-6 pt-6 max-w-5xl mx-auto transition-all duration-300">
          {children}
      </div>
  );
};

export default MarginContainer;
