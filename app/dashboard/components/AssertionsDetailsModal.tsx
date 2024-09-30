import React, { useEffect } from "react";
import { FaCircle } from "react-icons/fa";

interface Assertion {
  index: number;
  name: string;
  avatarSrc: string;
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
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const getIconColor = (name: string) => {
    switch (name) {
      case "Chuan":
        return "text-red-500";
      case "Alice":
        return "text-purple-500";
      default:
        return "text-grey-500";
    }
  };
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

        <h2 className="text-2xl font-bold mb-4">Assertions Details</h2>
        <div className="mb-4">
          <p className="text-gray-700">
            <span className="font-semibold">Maximum Difficulty:</span>{" "}
            {maxDifficulty}
          </p>
          <p className="text-gray-700">
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
                  <td className="px-4 py-2 border-b flex items-center">
                    <FaCircle
                      className={`mr-2 ${getIconColor(assertion.name)}`}
                    />
                    <span>{assertion.content}</span>
                  </td>
                  <td className="px-4 py-2 border-b">{assertion.type}</td>
                  <td className="px-4 py-2 border-b">{assertion.difficulty}</td>
                  <td className="px-4 py-2 border-b">{assertion.margin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssertionsDetailsModal;
