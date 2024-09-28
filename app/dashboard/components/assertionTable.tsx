import React from "react";

interface AssertionTableProps {
  assertions: {
    index: number;
    content: string;
    type: string;
    color: string;
  }[];
}

const AssertionTable: React.FC<AssertionTableProps> = ({ assertions }) => {
  return (
    <table className="w-full text-center text-gray-600">
      <thead>
        <tr>
          <th className="py-4 border-b">Index</th>
          <th className="py-4 border-b">Content</th>
          <th className="py-4 border-b">Type</th>
        </tr>
      </thead>
      <tbody>
        {assertions.map((assertion) => (
          <tr key={assertion.index} className="border-b">
            <td className="py-6">{assertion.index}</td>
            <td className="py-6 flex justify-center items-center">
              <span
                className="rounded-full p-2 mr-2"
                style={{ backgroundColor: assertion.color }}
              ></span>
              {assertion.content}
            </td>
            <td className="py-6">{assertion.type}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AssertionTable;
