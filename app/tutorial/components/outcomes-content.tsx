import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import TermsAndPrivacy from "@/app/upload/components/terms-and-privacy";

// 定义 Props 类型
interface OutcomesContentProps {
  sidebarWidth: number;
  collapsed: boolean;
}

const OutcomesContent: React.FC<OutcomesContentProps> = ({
  sidebarWidth,
  collapsed,
}) => {
  return (
    <div className="p-8 transition-all duration-300">
      {/* Main Title */}
      <h2 className="text-4xl font-bold mb-8 text-center">
        IRV elections and Visualizing Outcomes
      </h2>

      {/* Introductory Description */}
      <p className="text-lg text-gray-700 mb-8">
        Instant Runoff Voting (IRV) is a preferential voting system where voters
        rank candidates in order of preference. If no candidate receives a
        majority of first-preference votes, the candidate with the fewest votes
        is eliminated, and their votes are redistributed to the remaining
        candidates based on the next preferences. This process repeats until a
        candidate receives a majority, ensuring that the winner reflects the
        preferences of a broader range of voters.
      </p>

      {/* Section: How IRV Counts Work */}
      <div className="mb-8" data-content="How IRV Counts Work">
        <h3 className="text-2xl font-semibold mb-4">How IRV Counts Work</h3>
        <p className="text-lg text-gray-700">
          In Instant Runoff Voting (IRV) elections, voters rank candidates in
          order of preference. Initially, each candidate receives the votes
          where they are ranked first. The candidate with the least votes is
          eliminated, and their votes are transferred to the next preferred
          candidate on each ballot. This elimination process continues until one
          candidate has a majority and is declared the winner.
        </p>
      </div>

      {/* Section: Example */}
      <div className="mb-8" data-content="Example">
        <h3 className="text-xl font-bold mb-4">Example</h3>
        <p className="text-lg text-gray-700 mb-4">
          Suppose there are 4 candidates: Alice, Bob, Chuan, and Diego. The
          votes are as follows:
        </p>

        {/* Replacing Table with Image */}
        <div className="flex justify-center mb-8">
          <Image
            src="/tutorial-images/outcomes-preference.png" // Path to your image in the public directory
            alt="Preferences and Counts Table"
            width={250} // Set appropriate width
            height={180} // Set appropriate height
            className="rounded-md"
          />
        </div>

        <p className="text-lg text-gray-700">
          We first count the first preference tallies: Alice has 5 votes, Bob
          has 2, Chuan has 4, and Diego has 4. This means that Bob is eliminated
          first and his votes are distributed to the next-preferred candidate on
          each ballot—Diego gets the (B, D, A) vote and Alice gets the (B, A, C)
          vote. The new tallies are Alice: 6, Bob: eliminated, Chuan: 4, Diego:
          5. Now Chuan is eliminated. Diego gains two more votes—the (C, D)
          ballots—and wins with 7 votes compared to Alice’s 6.
        </p>
      </div>

      {/* Additional content... */}
      {/* Add other sections and images similarly, following the same structure. */}

      {/* Navigation Links */}
      <div className="flex justify-between items-center mt-12">
        {/* Back Button - Left aligned */}
        <div>
          <Link
            href="/tutorial/introduction"
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <ChevronLeft className="mr-2 text-gray-600 group-hover:text-gray-900" />{" "}
            Previous
          </Link>
        </div>
        {/* Next and Home Links - Right aligned */}
        <div className="text-right">
          <div className="mb-2">
            <span className="font-bold">Next:</span>{" "}
            <Link
              href="/tutorial/assertion"
              className="text-blue-500 hover:underline"
            >
              Assertion for IRV Winners
            </Link>
          </div>
          <div>
            <span className="font-bold">or:</span>{" "}
            <Link href="/upload" className="text-blue-500 hover:underline">
              Back to Home Page
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t text-sm text-gray-600">
        <TermsAndPrivacy />
      </div>
    </div>
  );
};

export default OutcomesContent;
