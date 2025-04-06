import React, { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { FaInfoCircle } from "react-icons/fa";
import Link from "next/link";
import TooltipWithIcon from "@/app/dashboard/components/Information-icon-text";

// 更新 Assertion 接口，添加 candidateId 字段
interface Assertion {
  index: number;
  winner: number;
  content: string;
  type: string;
  difficulty: number;
  margin: number;
}

interface AssertionsDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assertions: Assertion[];
  maxDifficulty: number;
  minMargin: number;
}

const AssertionsDetailsModal: React.FC<AssertionsDetailsModalProps> = ({
  isOpen,
  onClose,
  assertions,
  maxDifficulty,
  minMargin,
}) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg max-w-3xl w-full mx-4 p-6 relative">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          aria-label="Close"
        >
          {/* SVG 图标 */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-4 flex items-center relative">
          Assertions Details
          <TooltipWithIcon
            title="Need Help?"
            description="For detailed guidance on understanding the assertion attributes, please refer to our"
            linkText="Tutorial"
            linkHref="/tutorial"
          />
        </h2>
        <div className="mb-4">
          <p className="text-gray-700 font-bold">
            <span className="font-semibold">Maximum Difficulty:</span>{" "}
            {maxDifficulty}{" "}
            <span className="font-semibold">Minimum Margin:</span> {minMargin}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th scope="col" className="px-4 py-2 border-b text-left">
                  Index
                </th>
                <th scope="col" className="px-4 py-2 border-b text-left">
                  Content
                </th>
                <th scope="col" className="px-4 py-2 border-b text-left">
                  Type
                </th>
                <th scope="col" className="px-4 py-2 border-b text-left">
                  Difficulty
                </th>
                <th scope="col" className="px-4 py-2 border-b text-left">
                  Margin
                </th>
              </tr>
            </thead>
            <tbody>
              {assertions.map((assertion) => (
                <tr key={assertion.index}>
                  <td className="px-4 py-2 border-b">{assertion.index}</td>
                  <td className="px-4 py-2 text-left border-b">
                    <div className="flex items-center justify-start">
                      {/* 使用 Avatar 组件，传入 candidateId */}
                      <Avatar candidateId={assertion.winner} className="mr-2" />
                      <span>{assertion.content}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 border-b">{assertion.type}</td>
                  <td className="px-4 py-2 border-b">{assertion.difficulty}</td>
                  <td className="px-4 py-2 border-b">{assertion.margin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssertionsDetailsModal;
