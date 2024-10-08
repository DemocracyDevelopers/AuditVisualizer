// tutorial/components/RiskContent.tsx

import React from "react";
import Link from "next/link";

const RiskContent: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100">
      {/* Main content */}
      <div className="bg-white p-12 shadow-lg w-full max-h-screen overflow-y-auto">
        {/* Main Heading */}
        <h2 className="text-4xl font-bold mb-8 text-center">
          Risk Limiting Audits
        </h2>

        {/* Section: Introduction */}
        <div className="mb-8">
          <p className="text-lg text-gray-700 mb-4">
            Risk Limiting Audits (RLAs) are a statistical method used to verify
            the accuracy of election results. The goal of an RLA is to gradually
            reduce the risk of confirming an incorrect election outcome by
            randomly sampling paper ballots. The RAIRE system supports the RLA
            process for Instant Runoff Voting (IRV) elections by generating
            assertions that help ensure the audit process is credible.
          </p>
        </div>

        {/* Section: What is an RLA? */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">What is an RLA?</h3>
          <p className="text-lg text-gray-700 mb-4">
            The primary objective of an RLA is to confirm the reported election
            outcome with a maximum risk limit. Auditors randomly sample paper
            ballots and compare them with Cast Vote Records (CVRs). If the
            sampled ballots show no significant discrepancies, the audit can
            stop, assuming the reported result is correct. If discrepancies are
            found, the sample size may be increased, or a full hand recount may
            be conducted.
          </p>
        </div>

        {/* Section: Main Steps in Conducting an RLA */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">
            Main Steps in Conducting an RLA
          </h3>
          <ol className="list-decimal ml-6 text-gray-700 text-lg space-y-4">
            <li>
              Commit to the Ballot Manifest and CVRs:
              <ul className="list-disc ml-6">
                <li>
                  First, election administrators must commit to a ballot
                  manifest and a Cast Vote Record (CVR) for each ballot. A CVR
                  is an electronic record of each voter’s choices, which allows
                  auditors to check for discrepancies between the electronic
                  records and the paper ballots.
                </li>
              </ul>
            </li>
            <li>
              Generate a Random Seed:
              <ul className="list-disc ml-6">
                <li>
                  The ballots to be sampled are selected randomly using a random
                  seed generated through a verifiable public process, such as
                  rolling dice. This ensures transparency in the selection
                  process.
                </li>
              </ul>
            </li>
            <li>
              Estimate the Required Sample Size:
              <ul className="list-disc ml-6">
                <li>
                  The sample size is determined by the margin between the winner
                  and loser, the risk limit, and the expected number of errors.
                  Closer margins require larger sample sizes to achieve the same
                  level of confidence.
                </li>
              </ul>
            </li>
            <li>
              Compare the Ballots to the CVRs:
              <ul className="list-disc ml-6">
                <li>
                  The sampled ballots are compared to their corresponding CVRs.
                  Discrepancies can either overstate (advantage the reported
                  winner) or understate (advantage the reported loser) the
                  winner&apos;s margin.
                </li>
                <li>
                  For example, if the CVR records a vote for the reported
                  winner, but the paper ballot shows a vote for the loser, it
                  would be an overstatement.
                </li>
              </ul>
            </li>
            <li>
              Calculate Risk and Decide Whether to Continue:
              <ul className="list-disc ml-6">
                <li>
                  The level of risk is calculated based on the discrepancies
                  found in the sample. If the risk is within acceptable limits,
                  the audit can stop. If not, auditors may either increase the
                  sample size or conduct a full hand count.
                </li>
              </ul>
            </li>
          </ol>
        </div>

        {/* Section: Understanding Margin and Difficulty in RLAs */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">
            Understanding Margin and Difficulty in RLAs
          </h3>
          <p className="text-lg text-gray-700 mb-4">
            Margin and difficulty are two critical factors that affect the scope
            of an RLA:
          </p>
          <ul className="list-disc ml-6 text-gray-700 text-lg space-y-2">
            <li>
              <strong>Margin</strong> refers to the difference between the
              apparent winner’s tally and the apparent loser’s tally. In a
              plurality election, this is simply the number of votes by which
              the winner leads the loser. The diluted margin is the apparent
              margin as a fraction of the total number of votes cast in the
              contest. The smaller the margin, the more ballots need to be
              audited, as closer results are more likely to require additional
              verification.
            </li>
            <li>
              <strong>Difficulty</strong> increases with smaller margins or
              larger discrepancies. When the margin is small, the audit becomes
              more challenging because a small number of errors could
              potentially alter the outcome. The smaller the margin, the larger
              the sample size needed to confirm the result with high confidence.
              Additionally, IRV elections may involve verifying multiple
              elimination steps, which adds to the audit’s complexity.
            </li>
          </ul>
        </div>

        {/* Section: Example */}
        <div className="mb-8">
          <h4 className="text-xl font-bold mb-4">Example</h4>
          <p className="text-lg text-gray-700 mb-4">
            Suppose Diego is the reported winner and Chuan is a reported loser
            in a plurality contest.
          </p>
          <ul className="list-disc ml-6 text-gray-700 text-lg space-y-2">
            <li>
              If the CVR records a vote for Diego but the ballot paper has a
              vote for Chuan, that is a discrepancy of 2, i.e. a 2-vote
              overstatement.
            </li>
            <li>
              If the CVR records an invalid vote, but the ballot paper has a
              vote for Chuan, that is a discrepancy of 1, i.e. a 1-vote
              overstatement.
            </li>
            <li>
              If the CVR and the ballot paper are identical, that is a
              discrepancy of 0.
            </li>
            <li>
              If the CVR records an invalid vote, but the ballot paper has a
              vote for Diego, that is a discrepancy of -1, a 1-vote
              understatement.
            </li>
            <li>
              If the CVR records a vote for Chuan but the ballot paper has a
              vote for Diego, that is a discrepancy of -2, i.e. a 2-vote
              understatement.
            </li>
          </ul>
          <p className="text-lg text-gray-700 mt-4">
            Obviously overstatements are far more important than
            understatements—if there are enough overstatements, the apparent
            winner may be wrong.
          </p>
          <p className="text-lg text-gray-700 mt-4">
            The discrepancies for all the sampled ballots are input into a risk
            measuring function. If the measured risk is less than the Risk Limit
            α, the audit can stop and accept the announced election result.
            Otherwise, officials can decide to either escalate—take more samples
            and continue the audit—or perform a full hand count to establish who
            really won.
          </p>
          {/*<p className="text-lg text-gray-700 mt-4">*/}
          {/*    For more careful explanations of how to run an RLA, see the Democracy Fund’s RLA Standard Operating*/}
          {/*    Procedures 2022 or their excellent “Knowing it’s right” series.*/}
          {/*</p>*/}
        </div>

        {/* Navigation Links */}
        <div className="flex justify-between items-center mt-12">
          {/* Back Button - Left aligned */}
          <div>
            <Link
              href="/tutorial/assertion"
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
                href="/tutorial/usingassertion"
                className="text-blue-500 hover:underline"
              >
                Using assertions to audit IRV outcomes
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

export default RiskContent;
