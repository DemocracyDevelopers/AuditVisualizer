import React from "react";

interface MarginContainerProps {
  collapsed: boolean;
  sidebarWidth: number;
  children: React.ReactNode;
}

/**
 * Simple wrapper that centres content and keeps smooth left-margin animation.
 * No fixed colours → 自动跟随主题。
 */
const MarginContainer: React.FC<MarginContainerProps> = ({
  collapsed,
  sidebarWidth,
  children,
}) => {
  return (
    <div
      className="px-6 pt-6 max-w-5xl mx-auto transition-all duration-300"
      style={{ marginLeft: collapsed ? 0 : sidebarWidth }}
    >
      {children}
    </div>
  );
};

export default MarginContainer;
