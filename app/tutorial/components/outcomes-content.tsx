"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import TermsAndPrivacy from "@/app/upload/components/terms-and-privacy";

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
      {/* ---------- Title ---------- */}
      <h2 className="text-4xl font-bold mb-8 text-center">
        IRV elections and Visualizing Outcomes
      </h2>

      {/* ---------- Intro ---------- */}
      <p className="text-lg text-muted-foreground mb-8">
        Instant-Runoff Voting (IRV) is a preferential voting system where voters
        rank candidates in order of preference. …
      </p>

      {/* ---------- How IRV Counts Work ---------- */}
      <div className="mb-8" data-content="How IRV Counts Work">
        <h3 className="text-2xl font-semibold mb-4">How IRV Counts Work</h3>
        <p className="text-lg text-muted-foreground">
          In IRV elections, voters rank candidates in order of preference. …
        </p>
      </div>

      {/* ---------- Example ---------- */}
      <div className="mb-8" data-content="Example">
        <h3 className="text-xl font-bold mb-4">Example</h3>
        <p className="text-lg text-muted-foreground mb-4">
          Suppose there are 4 candidates: Alice, Bob, Chuan, and Diego. …
        </p>

        <div className="flex justify-center mb-8">
          <Image
            src="/tutorial-images/outcomes-preference.png"
            alt="Preferences and Counts Table"
            width={250}
            height={180}
            className="rounded-md"
          />
        </div>

        <p className="text-lg text-muted-foreground">
          We first count the first-preference tallies: Alice 5, Bob 2, Chuan 4,
          Diego 4. Bob is eliminated … Diego wins with 7 votes compared to
          Alice’s 6.
        </p>
      </div>

      {/* ---------- Navigation ---------- */}
      <div className="flex justify-between items-center mt-12">
        <Link
          href="/tutorial/introduction"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="mr-2" />
          Previous
        </Link>

        <div className="text-right">
          <div className="mb-2">
            <span className="font-bold">Next:</span>{" "}
            <Link
              href="/tutorial/assertion"
              className="text-primary hover:underline"
            >
              Assertion for IRV Winners
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

export default OutcomesContent;
