import React, { useState, useRef } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Assertion {
  index: number;
  content: string;
  type: string;
  winner: number;
  name: string;
}

interface AssertionTableProps {
  assertions: Assertion[];
}

const pageSize = 4;

const AssertionTable: React.FC<AssertionTableProps> = ({ assertions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(assertions.length / pageSize);
  const tableRef = useRef<HTMLDivElement>(null);

  const paged = assertions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 表格区域 - 滚动 */}
      <div ref={tableRef} className="flex-1 overflow-y-auto border rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              <th className="px-4 py-2 border-b">Index</th>
              <th className="px-4 py-2 border-b">Content</th>
              <th className="px-4 py-2 border-b">Type</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((a) => (
              <tr key={a.index} className="h-[48px]">
                <td className="px-4 py-2 text-center border-b">{a.index}</td>
                <td className="px-4 py-2 text-left border-b">
                  <div className="flex items-center">
                    <Avatar candidateId={a.winner} className="mr-2" />
                    <span>{a.content}</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-center border-b">{a.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页按钮固定底部 */}
      <div className="mt-2 pt-2 border-t flex justify-center items-center gap-2 flex-wrap">
        <Button
          size="sm"
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Prev
        </Button>

        <div className="flex items-center gap-1 text-sm text-gray-700">
          Page
          <select
            value={currentPage}
            onChange={(e) => handlePageChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {(() => {
              const rangeSize = 5; // 显示几页
              const half = Math.floor(rangeSize / 2);
              let start = Math.max(1, currentPage - half);
              let end = Math.min(totalPages, start + rangeSize - 1);

              // 向前补足范围不足时的偏移
              if (end - start + 1 < rangeSize && start > 1) {
                start = Math.max(1, end - rangeSize + 1);
              }

              return Array.from(
                { length: end - start + 1 },
                (_, i) => start + i,
              ).map((page) => (
                <option key={page} value={page}>
                  {page}
                </option>
              ));
            })()}
          </select>
          of {totalPages}
        </div>

        <Button
          size="sm"
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AssertionTable;
