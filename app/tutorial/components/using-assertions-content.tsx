// tutorial/components/using-assertions-content.tsx

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

// 定义 Props 类型
interface UsingAssertionsContentProps {
  sidebarWidth: number;
  collapsed: boolean;
}

const UsingAssertionsContent: React.FC<UsingAssertionsContentProps> = ({
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
        Using assertions to audit IRV outcomes
      </h2>

      {/* Introduction Section */}
      <div className="mb-8" data-content="Introduction">
        <p className="text-lg text-gray-700 mb-4">
          We have a set of assertions which imply that the announced winner won.
          We could (but we won’t) verify each assertion by manually examining
          all the ballot papers. For example,{" "}
          <em className="font-bold">Diego NEB Chuan</em>
          could be verified by manually counting all the first preferences for
          Diego and checking that that tally was greater than the (manually
          counted) total number of times Chuan was preferenced without being
          preceded by Diego. Similarly, NEN assertions could be verified by
          counting the tallies ignoring candidates not specified in the
          assertion. For example, we could verify{" "}
          <em className="font-bold">
            NEN: Bob &gt; Chuan if only {`{`}Bob, Chuan, Diego{`}`} remain
          </em>
          by sorting every ballot into a tally pile according to which of Bob,
          Chuan, and Diego was the highest preference, ignoring any preference
          for Alice, and then checking that Bob’s total was higher than Chuan’s.
          If we did this for every assertion in the set, it would be a logically
          sound way to verify the election result, but it would be very
          inefficient.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Instead, we test each of the assertions using an RLA at some risk
          limit α. If the audit accepts them all, we conclude the audit and
          accept the IRV election result.
        </p>
      </div>

      {/* NEB Assertions Section */}
      <div className="mb-8" data-content="NEB Assertions">
        <h3 className="text-2xl font-bold mb-4">NEB Assertions</h3>
        <h4 className="text-xl font-bold mb-4">Scoring NEB assertions</h4>
        <p className="text-lg text-gray-700 mb-4">
          An NEB assertion, for example{" "}
          <em className="font-bold">Alice NEB Bob</em>, says that Alice’s first
          preferences exceed the total number of mentions of Bob that are not
          preceded by a higher preference for Alice.
        </p>
        {/* Image 1 */}
        <div className="flex justify-center mb-8">
          <Image
            src="/tutorial-images/usingassertion-cvrsets.png"
            alt="CVR Sets for NEB Assertions"
            width={600}
            height={300}
            className="rounded-md"
          />
        </div>
      </div>

      {/* NEN Assertions Section */}
      <div className="mb-8" data-content="NEN Assertions">
        <h3 className="text-2xl font-bold mb-4">NEN Assertions</h3>
        <h4 className="text-xl font-bold mb-4">Scoring NEN assertions</h4>
        <p className="text-lg text-gray-700 mb-4">
          An NEN assertion, for example{" "}
          <em className="font-bold">
            NEN: Alice &gt; Bob if only {`{`}Alice, Bob, Chuan{`}`} remain
          </em>
          , says that Alice beats Bob when only Alice, Bob, and Chuan are the
          only continuing candidates.
        </p>
        <div className="flex justify-center mb-8">
          <Image
            src="/tutorial-images/usingassertion-cvrsets2.png"
            alt="CVR Sets for NEN Assertions"
            width={500}
            height={200}
            className="rounded-md"
          />
        </div>
      </div>

      {/* Assertion Scoring Summary */}
      <div className="mb-8" data-content="Assertion scoring summary">
        <h4 className="text-2xl font-bold mb-4">Assertion scoring summary</h4>
        <div className="flex justify-center mb-8">
          <Image
            src="/tutorial-images/usingassertion-summary.png"
            alt="Assertion Scoring Summary"
            width={700}
            height={400}
            className="rounded-md"
          />
        </div>
        <p className="text-lg text-gray-700 mb-4">
          Table above shows how to score each ballot for each possible kind of
          assertion. Note that the score is a function of the assertion and the
          vote only - it does not depend on the apparent outcome.
        </p>
      </div>

      {/* Navigation Links */}
      <div className="flex justify-between items-center mt-12">
        <div>
          <Link
            href="/tutorial/risk"
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <ChevronLeft className="mr-2 text-gray-600 group-hover:text-gray-900" />{" "}
            Back
          </Link>
        </div>
        <div className="text-right">
          <div className="mb-2">
            <span className="font-bold">Next:</span>{" "}
            <Link
              href="/tutorial/margin"
              className="text-blue-500 hover:underline"
            >
              Margin and Difficulty
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
    </div>
  );
};

export default UsingAssertionsContent;
