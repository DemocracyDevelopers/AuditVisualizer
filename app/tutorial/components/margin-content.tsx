import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import TermsAndPrivacy from "@/app/upload/components/terms-and-privacy";

// 定义 Props 类型
interface MarginDifficultyContentProps {
  sidebarWidth: number;
  collapsed: boolean;
}

const MarginDifficultyContent: React.FC<MarginDifficultyContentProps> = ({
  sidebarWidth,
  collapsed,
}) => {
  return (
      <div
          className="p-8"
          style={{
            marginLeft: collapsed ? 0 : sidebarWidth, // 根据 sidebarWidth 和 collapsed 调整内容的左边距
            transition: "margin-left 0.3s ease",
          }}
      >
        <h2 className="text-4xl font-bold mb-8 text-center">
          Margin and Difficulty
        </h2>

        {/* Assertion Margins Section */}
        <div className="mb-8" data-content="Assertion Margins">
          <h3 className="text-2xl font-bold mb-4">Assertion Margins</h3>
          <p className="text-lg text-gray-700 mb-4">
            This section describes how to implement the{" "}
            <strong>Assertion Margins</strong> component. In order to estimate
            sample sizes, we need to understand the concept of “margin” as it
            applies to an assertion, or rather to the two-candidate contest
            described by that assertion.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            The Assertion Margin for an assertion <em>A</em> is simply the sum of
            the scores of all ballots for <em>A</em>. This is the minimum number
            of ballots that would have to be added or removed to switch a true
            assertion to false.
          </p>
          <p className="text-lg text-gray-700 mb-4 font-semibold">
            The Assertion Margin{" "}
            <em>
              m<sub>A</sub>
            </em>{" "}
            for assertion <em>A</em> and a set of ballots <em>B</em> is:
          </p>
          <p className="text-lg text-gray-700 mb-4 text-center">
            <em>
              m<sub>A</sub>(B) = Σ<sub>b ∈ B</sub> SCORE<sub>A</sub>(b)
            </em>
          </p>
          <p className="text-lg text-gray-700 mb-4">
            This margin can be used directly to calculate the diluted margin{" "}
            <em>μ</em> for each assertion, in order to estimate the required
            sample size. The diluted margin for an IRV contest is the smallest
            diluted margin for any of its assertions.
          </p>
        </div>

        {/* Difficulty Section */}
        <div className="p-4 bg-gray-100 rounded-md mb-4">
          <h3 className="font-semibold mb-2 text-blue-600">
            Estimating the difficulty of auditing an assertion
          </h3>
          <p className="text-gray-700">
            Given a set of assertions that attacks an outcome, the ‘easiest to
            audit’ assertion is the one we expect would require the smallest
            sample of ballots to audit. Given two assertions, we assume that the
            assertion with the larger diluted margin will be the easier one to
            audit. For the purposes of our running example, we will define the
            diluted margin of an assertion with winner <em>w</em> and loser{" "}
            <em>l</em> as the difference in tallies of the winner and loser
            divided by the total number of ballots cast.
          </p>
          <p className="text-gray-700 mt-4">
            Recall that when we talk about the winner and loser of an assertion,
            we are not referring to the ultimate winners and losers of the
            election—we are just referring to the candidates being compared by the
            assertion itself.
          </p>
          <p className="text-gray-700 mt-4">
            In our example, the total number of cast ballots is 13,500. Let’s also
            assume that we are undertaking a ballot level comparison audit, and
            use <em>1 divided by the diluted margin</em> to estimate the auditing
            difficulty of a given assertion.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex justify-between items-center mt-12">
          {/* Back Button - Left aligned */}
          <div>
            <Link
                href="/tutorial/usingassertion"
                className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <ChevronLeft className="mr-2 text-gray-600 group-hover:text-gray-900"/>{" "}
              Back
            </Link>
          </div>
          {/* Next and Home Links - Right aligned */}
          <div className="text-right">
            <div className="mb-2">
              <span className="font-bold">or:</span>{" "}
              <Link href="/upload" className="text-blue-500 hover:underline">
                Back to Home Page
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-sm text-gray-600">
          <TermsAndPrivacy/>
        </div>
      </div>
  );
};

export default MarginDifficultyContent;
