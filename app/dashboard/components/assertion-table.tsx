import React, { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
const assertion_per_page = 5;

const AssertionTable: React.FC<AssertionTableProps> = ({ assertions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(assertions.length / assertion_per_page);
  const startIndex = (currentPage - 1) * assertion_per_page;
  const endIndex = startIndex + assertion_per_page;
  const currentAssertions = assertions.slice(startIndex, endIndex);
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const renderPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }

    return pageNumbers.map((page, index) => (
      <button
        key={index}
        onClick={() => typeof page === "number" && handlePageChange(page)}
        disabled={page === "..."}
        className={`px-3 py-1 rounded-md border ${
          currentPage === page ? "bg-black text-white" : "bg-white text-black"
        } ${page === "..." ? "cursor-default" : "cursor-pointer"}`}
      >
        {page}
      </button>
    ));
  };

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
          {currentAssertions.map((assertion) => (
            <tr key={assertion.index} className="h-24">
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
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt; Previous
          </Button>

          {/* Page numbers */}
          {renderPageNumbers()}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next &gt;
          </Button>
        </div>
      )}
    </div>
  );
};

export default AssertionTable;
