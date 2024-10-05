// tutorial/components/IntroductionContent.tsx

import React from "react";
import Link from "next/link";

const IntroductionContent: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100">
      {/* Main content */}
      <div className="bg-white p-12 shadow-lg w-full max-h-screen overflow-y-auto">
        {/* Main Heading */}
        <h2 className="text-4xl font-bold mb-8 text-center">
          Introduction: IRV RAs with RAIRE
        </h2>

        {/* Introduction Paragraph */}
        <div className="mb-8">
          <p className="text-lg text-gray-700">
            Risk-Limiting Audits (RLAs) for Instant Runoff Voting (IRV)
            elections can be efficiently conducted using the RAIRE tool. RAIRE
            helps election administrators verify whether the announced winner in
            an IRV election is correct by generating a set of assertions. These
            assertions are conditions comparing different sets of ballots and
            determining if the winner had more support than any other
            candidates.
          </p>
        </div>

        <div className="mb-8">
          <p className="text-lg text-gray-700">
            RAIRE uses a cost-effective method to select the necessary sample
            size for verification, relying on Cast Vote Records (CVRs) from
            paper ballots. The tool focuses on validating the winner and
            deliberately ignores less critical details, like the elimination
            order of candidates. Auditing tools used for plurality elections can
            be adapted for IRV by integrating RAIRE.
          </p>
        </div>

        {/* Section: The Audit Process */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">
            The Audit Process from Beginning to End:
          </h3>
          <ol className="list-decimal ml-6 text-gray-700 text-lg space-y-2">
            <li>Commit to the ballot manifest and CVRs.</li>
            <li>Choose contest(s) for audit.</li>
            <li>
              <strong>Run RAIRE to generate assertions for audit.</strong>
            </li>
            <li>
              <strong>
                Use the RAIRE assertion validation and visualization module to
                check that the assertions imply the announced winner won.
              </strong>
            </li>
            <li>
              Generate a trustworthy random seed, e.g., by public dice rolling.
            </li>
            <li>
              Estimate the required sample size, based on the margin,{" "}
              <strong>for each assertion</strong>.
            </li>
            <li>Use the seed to generate the list of sampled ballots.</li>
            <li>
              Retrieve the required ballots, compare them to their CVRs, and
              calculate the discrepancies <strong>for each assertion</strong>.
            </li>
            <li>
              Update the risk <strong>for each assertion</strong> based on the
              observed discrepancies.
            </li>
            <li>
              For each contest under audit, if the measured risk is below the
              risk limit <strong>for each assertion</strong>, stop the audit and
              accept the result.
            </li>
            <li>
              If some results have not yet been confirmed, decide whether to
              escalate (sample more ballots) or conduct a full manual count.
            </li>
          </ol>
        </div>

        {/* Navigation Links */}
        <div className="flex justify-between items-center mt-12">
          {/* Back Button - Left aligned */}
          <div>
            <Link
              href="/tutorial"
              className="text-black hover:text-gray-500 flex items-center"
            >
              <span className="mr-2 text-black">←</span> Back
            </Link>
          </div>
          {/* Next and Home Links - Right aligned */}
          <div className="text-right">
            <div className="mb-2">
              <span className="font-bold">Next:</span>{" "}
              <Link
                href="/tutorial/outcomes"
                className="text-blue-500 hover:underline"
              >
                IRV Elections and Visualizing Outcomes
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
    </div>
  );
};

export default IntroductionContent;
