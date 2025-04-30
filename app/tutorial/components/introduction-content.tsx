"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import TermsAndPrivacy from "@/app/upload/components/terms-and-privacy";

interface IntroductionContentProps {
  sidebarWidth: number;
  collapsed: boolean;
}

const IntroductionContent: React.FC<IntroductionContentProps> = ({
  sidebarWidth,
  collapsed,
}) => {
  return (
    <div className="p-8 transition-all duration-300">
      <h2
        className="text-4xl font-bold mb-8 text-center"
        data-content="Introduction: IRV RAs with RAIRE"
      >
        Introduction: IRV RAs with RAIRE
      </h2>

      {/* ---------- Intro Paragraph ---------- */}
      <div className="mb-8" data-content="Introduction">
        <p className="text-lg text-muted-foreground">
          Risk-Limiting Audits&nbsp;(RLAs) for Instant-Runoff Voting (IRV)
          elections can be efficiently conducted using the RAIRE tool. RAIRE
          helps election administrators verify whether the announced winner in
          an IRV election is correct by generating a set of assertions. These
          assertions compare different sets of ballots to determine whether the
          winner had more support than any other candidate.
        </p>
      </div>

      {/* ---------- RAIRE Overview ---------- */}
      <div className="mb-8" data-content="RAIRE Overview">
        <p className="text-lg text-muted-foreground">
          RAIRE uses a cost-effective method to select the necessary sample size
          for verification, relying on cast-vote records&nbsp;(CVRs) from paper
          ballots. The tool focuses on validating the winner and deliberately
          ignores less-critical details such as the elimination order of
          candidates. Auditing tools built for plurality elections can be
          adapted for IRV by integrating RAIRE.
        </p>
      </div>

      {/* ---------- Audit Process ---------- */}
      <div
        className="mb-8"
        data-content="The Audit Process from Beginning to End"
      >
        <h3 className="text-2xl font-bold mb-4">
          The Audit Process from Beginning to End
        </h3>
        <ol className="list-decimal ml-6 text-lg text-muted-foreground space-y-2">
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
            Generate a trustworthy random seed, e.g.&nbsp;by public dice
            rolling.
          </li>
          <li>
            Estimate the required sample size&nbsp;
            <strong>for each assertion</strong>.
          </li>
          <li>Use the seed to generate the list of sampled ballots.</li>
          <li>
            Retrieve the required ballots, compare them to their CVRs, and
            calculate discrepancies&nbsp;
            <strong>for each assertion</strong>.
          </li>
          <li>
            Update the risk&nbsp;<strong>for each assertion</strong>&nbsp;based
            on the observed discrepancies.
          </li>
          <li>
            If the measured risk is below the risk limit&nbsp;
            <strong>for each assertion</strong>, stop the audit and accept the
            result.
          </li>
          <li>
            If some results remain unconfirmed, decide whether to escalate
            (sample more ballots) or conduct a full manual count.
          </li>
        </ol>
      </div>

      {/* ---------- Navigation Links ---------- */}
      <div className="flex justify-between items-center mt-12">
        <Link
          href="/tutorial"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="mr-2" />
          Previous
        </Link>

        <div className="text-right">
          <div className="mb-2">
            <span className="font-bold">Next:</span>{" "}
            <Link
              href="/tutorial/outcomes"
              className="text-primary hover:underline"
            >
              IRV Elections and Visualizing Outcomes
            </Link>
          </div>
          <div>
            <span className="font-bold">or:</span>{" "}
            <Link href="/upload" className="text-primary hover:underline">
              Back to Home Page
            </Link>
          </div>
        </div>
      </div>

      {/* ---------- Footer ---------- */}
      <div className="mt-12 pt-8 border-t border-border dark:border-border/60 text-sm text-muted-foreground">
        <TermsAndPrivacy />
      </div>
    </div>
  );
};

export default IntroductionContent;
