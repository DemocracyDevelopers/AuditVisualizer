"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import TermsAndPrivacy from "@/app/upload/components/terms-and-privacy";

interface MarginDifficultyContentProps {
  sidebarWidth: number;
  collapsed: boolean;
}

const MarginDifficultyContent: React.FC<MarginDifficultyContentProps> = ({
  sidebarWidth,
  collapsed,
}) => {
  return (
    <div className="p-8 transition-all duration-300">
      <h2 className="text-4xl font-bold mb-8 text-center">
        Margin and Difficulty
      </h2>

      {/* ---------- Assertion Margins ---------- */}
      <div className="mb-8" data-content="Assertion Margins">
        <h3 className="text-2xl font-bold mb-4">Assertion Margins</h3>
        <p className="text-lg text-gray-700 dark:text-white mb-4">
          This section describes how to implement the{" "}
          <strong>Assertion Margins</strong> component. …
        </p>
        <p className="text-lg text-gray-700 dark:text-white mb-4">
          The Assertion Margin for an assertion <em>A</em> is simply …
        </p>
        <p className="text-lg text-gray-700 dark:text-white mb-4 font-semibold">
          The Assertion Margin{" "}
          <em>
            m<sub>A</sub>
          </em>{" "}
          for assertion <em>A</em> and a set of ballots <em>B</em> is:
        </p>
        <p className="text-lg text-gray-700 dark:text-white mb-4 text-center">
          <em>
            m<sub>A</sub>(B) = Σ<sub>b ∈ B</sub> SCORE<sub>A</sub>(b)
          </em>
        </p>
        <p className="text-lg text-gray-700 dark:text-white mb-4">
          This margin can be used directly to calculate …
        </p>
      </div>

      {/* ---------- Difficulty ---------- */}
      <div className="p-4 rounded-md mb-4 bg-muted/40 ">
        <h3 className="font-semibold mb-2 text-primary">
          Estimating the difficulty of auditing an assertion
        </h3>
        <p className="text-gray-700 dark:text-white">
          Given a set of assertions that attacks an outcome, …
        </p>
        <p className="text-gray-700 dark:text-white">
          Recall that when we talk about the winner and loser …
        </p>
        <p className="text-gray-700 dark:text-white">
          In our example, the total number of cast ballots is 13 500. …
        </p>
      </div>

      {/* ---------- Navigation ---------- */}
      <div className="flex justify-between items-center mt-12">
        <Link
          href="/tutorial/usingassertion"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="mr-2" />
          Previous
        </Link>

        <div className="text-right">
          <span className="font-bold">or:</span>{" "}
          <Link href="/upload" className="text-primary hover:underline">
            Back to Home Page
          </Link>
        </div>
      </div>

      {/* ---------- Footer ---------- */}
      <div className="mt-12 pt-8 border-t border-border dark:border-border/60 text-sm text-muted-foreground">
        <TermsAndPrivacy />
      </div>
    </div>
  );
};

export default MarginDifficultyContent;
