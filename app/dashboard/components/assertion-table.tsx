import React from "react";
import { Avatar } from "@/components/ui/avatar";

interface Assertion {
  index: number;
  content: string;
  type: string;
  winner: number; // candidate ID
  name: string; // candidate name
}

interface AssertionTableProps {
  assertions: Assertion[];
}

const AssertionTable: React.FC<AssertionTableProps> = ({ assertions }) => {
  return (
    <div>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Index</th>
            <th className="px-4 py-2 border-b">Content</th>
            <th className="px-4 py-2 border-b">Type</th>
          </tr>
        </thead>
        <tbody>
          {assertions.map((assertion) => (
            <tr key={assertion.index}>
              <td className="px-4 py-2 text-center border-b">
                {assertion.index}
              </td>
              <td className="px-4 py-2 text-left border-b">
                <div className="flex items-center justify-start">
                  <Avatar candidateId={assertion.winner} className="mr-2" />
                  <span>{assertion.content}</span>
                </div>
              </td>
              <td className="px-4 py-2 text-center border-b">
                {assertion.type}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssertionTable;
