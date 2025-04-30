"use client";

import React, { useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import TooltipWithIcon from "@/app/dashboard/components/Information-icon-text";
import { getSmartDisplayName } from "@/components/ui/avatar";

interface Assertion {
  index: number;
  winner: number;
  content: string;
  type: string;
  difficulty: number;
  margin: number;
}
interface Candidate {
  id: number;
  name: string;
}

interface AssertionsDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assertions: Assertion[];
  maxDifficulty: number;
  minMargin: number;
  candidates: Candidate[];
}

const AssertionsDetailsModal: React.FC<AssertionsDetailsModalProps> = ({
  isOpen,
  onClose,
  assertions,
  maxDifficulty,
  minMargin,
  candidates,
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
                    bg-black/30 dark:bg-black/60 transition-colors"
    >
      <div
        className="bg-background text-foreground border border-border dark:border-border/60
                   rounded-lg max-w-3xl w-full mx-4 p-6 relative transition-colors"
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
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

        <h2 className="text-2xl font-bold mb-4 flex items-center">
          Assertions Details
          <TooltipWithIcon
            title="Need Help?"
            description="For detailed guidance on understanding the assertion attributes, please refer to our"
            linkText="Tutorial"
            linkHref="/tutorial"
          />
        </h2>

        {/* Candidates list */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Candidates</h3>
          <ul className="list-disc list-inside">
            {candidates.map((c) => {
              const { shortName } = getSmartDisplayName(c.id, candidates);
              return (
                <li key={c.id}>
                  <strong>{shortName}</strong> – {c.name}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Max / Min summary */}
        <div className="mb-4">
          <p className="font-bold">
            <span className="font-semibold">Maximum Difficulty:</span>{" "}
            {maxDifficulty}{" "}
            <span className="font-semibold">Minimum Margin:</span> {minMargin}
          </p>
        </div>

        {/* Assertions table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr>
                {["Index", "Content", "Type", "Difficulty", "Margin"].map(
                  (h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-4 py-2 border-b border-border dark:border-border/60 text-left"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {assertions.map((a) => (
                <tr key={a.index}>
                  <td className="px-4 py-2 border-b border-border dark:border-border/60">
                    {a.index}
                  </td>
                  <td className="px-4 py-2 border-b border-border dark:border-border/60">
                    <div className="flex items-center">
                      <Avatar candidateId={a.winner} className="mr-2" />
                      <span>{a.content}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 border-b border-border dark:border-border/60">
                    {a.type}
                  </td>
                  <td className="px-4 py-2 border-b border-border dark:border-border/60">
                    {a.difficulty}
                  </td>
                  <td className="px-4 py-2 border-b border-border dark:border-border/60">
                    {a.margin}
                  </td>
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
