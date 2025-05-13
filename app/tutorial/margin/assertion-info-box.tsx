// AssertionInfoBox.tsx
import React, { FC, ReactNode } from "react";

interface AssertionInfoBoxProps {
  title: string;
  children: ReactNode;
}

/**
 * AssertionInfoBox - A component for displaying information about assertion auditing
 */
const AssertionInfoBox: FC<AssertionInfoBoxProps> = ({ title, children }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-md mb-4">
      <h3 className="font-semibold mb-2 text-blue-600">{title}</h3>
      {children}
    </div>
  );
};

export default AssertionInfoBox;
