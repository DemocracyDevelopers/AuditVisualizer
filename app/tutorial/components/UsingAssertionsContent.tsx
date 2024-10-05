// tutorial/components/UsingAssertionsContent.tsx

import React from "react";
import Link from "next/link";
import Image from "next/image";

const UsingAssertionsContent: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100">
      {/* Main content */}
      <div className="bg-white p-12 shadow-lg w-full max-h-screen overflow-y-auto">
        {/* Main Heading */}
        <h2 className="text-4xl font-bold mb-8 text-center">
          Using assertions to audit IRV outcomes
        </h2>

        {/* Introduction Section */}
        <div className="mb-8">
          <p className="text-lg text-gray-700 mb-4">
            We have a set of assertions which imply that the announced winner
            won. We could (but we won’t) verify each assertion by manually
            examining all the ballot papers. For example,{" "}
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
            for Alice, and then checking that Bob’s total was higher than
            Chuan’s. If we did this for every assertion in the set, it would be
            a logically sound way to verify the election result, but it would be
            very inefficient.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Instead, we test each of the assertions using an RLA at some risk
            limit α. If the audit accepts them all, we conclude the audit and
            accept the IRV election result.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            If the announced winner is wrong, then at least one of the
            assertions must be false. Since we test each assertion with an RLA
            at risk limit α, the RLA for the wrong assertion will mistakenly
            accept it with probability at most α. Hence the overall process is a
            valid Risk Limiting Audit—it will mistakenly accept the wrong
            outcome with probability at most α. Both types of assertions—NEB and
            NEN—can be tested with standard RLA systems, but they need to be
            carefully transformed into the right form.
          </p>
        </div>

        {/* NEB Assertions Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">NEB Assertions</h3>

          {/* Scoring NEB assertions */}
          <h4 className="text-xl font-bold mb-4">Scoring NEB assertions</h4>
          <p className="text-lg text-gray-700 mb-4">
            An NEB assertion, for example{" "}
            <em className="font-bold">Alice NEB Bob</em>, says that Alice’s
            first preferences exceed the total number of mentions of Bob that
            are not preceded by a higher preference for Alice. We start with a
            set of CVRs and count them as follows:
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
          <p className="text-lg text-gray-700 mb-4">
            This fits naturally into any existing Risk-limiting audit process,
            except that our two candidates are “first preferences for Alice” and
            “mentions of Bob not preceded by Alice.”
          </p>

          {/* Auditing NEB assertions */}
          <h4 className="text-xl font-bold mb-4">Auditing NEB assertions</h4>
          <p className="text-lg text-gray-700 mb-4">
            Consider again the assertion{" "}
            <em className="font-bold">Alice NEB Bob</em>. To conduct a
            ballot-level comparison audit of this assertion, the process for
            randomly selecting ballots for audit is the same as any other RLA.
            When a ballot is selected, overstatements are errors that advantage
            the “first preferences for Alice” candidate, while understatements
            are errors that advantage the “mentions of Bob (not preceded by a
            higher preference for Alice)” candidate. An overstatement is an
            error that either mistakenly records a first preference for Alice,
            or mistakenly omits a mention of Bob not preceded by Alice.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            For example, if a CVR says that a vote is a first-preference for
            Alice, but the ballot paper shows only a second preference for her
            (and a first preference for some other candidate, say Diego), then
            this is a one-vote overstatement. If the ballot paper actually shows
            a mention of Bob, not preceded by a higher preference for Alice,
            then the error is a two-vote overstatement.
          </p>
        </div>

        {/* NEN Assertions Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">NEN Assertions</h3>

          {/* Scoring NEN assertions */}
          <h4 className="text-xl font-bold mb-4">Scoring NEN assertions</h4>
          <p className="text-lg text-gray-700 mb-4">
            An NEN assertion, for example{" "}
            <em className="font-bold">
              NEN: Alice &gt; Bob if only {`{`}Alice, Bob, Chuan{`}`} remain
            </em>
            , says that Alice beats Bob when only Alice, Bob, and Chuan are the
            only continuing candidates.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            This is also easy to fit into any existing Risk-limiting audit
            process, except that our two candidates are “Alice’s tally when only
            Alice, Bob, Chuan remain” and “Bob’s tally when only Alice, Bob,
            Chuan remain.”
          </p>
          <p className="text-lg text-gray-700 mb-4">
            We start with a set of CVRs and count them as follows:
          </p>
          {/* Image 2 */}
          <div className="flex justify-center mb-8">
            <Image
              src="/tutorial-images/usingassertion-cvrsets2.png"
              alt="CVR Sets for NEN Assertions"
              width={500}
              height={200}
              className="rounded-md"
            />
          </div>
          <p className="text-lg text-gray-700 mb-4">
            We simply allocate the vote as if Diego has been eliminated. The
            same works when sets of more than one candidate have been
            eliminated, or when there are more than 4 candidates: simply score
            the vote for the first-ranked candidate among those continuing.
          </p>

          {/* Auditing NEN assertions */}
          <h4 className="text-xl font-bold mb-4">Auditing NEN assertions</h4>
          <p className="text-lg text-gray-700 mb-4">
            For an NEN assertion{" "}
            <em className="font-bold">
              NEN: Alice &gt; Bob if only {`{`}S{`}`} remain
            </em>
            , an overstatement is an error that advantages Alice by mistakenly
            listing her as the highest preference in set S, or disadvantages Bob
            by mistakenly not listing him first among S. An understatement is
            the opposite.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            For example, for the assertion{" "}
            <em className="font-bold">
              NEN: Alice &gt; Bob if only {`{`}Alice, Bob, Chuan{`}`} remain
            </em>
            , if the CVR was (Diego, Alice, Bob, Chuan), but the ballot paper
            actually contained (Diego, Bob, Alice, Chuan), that would be a
            two-vote overstatement. (The first preference for Diego is ignored
            because we consider only {`{`}Alice, Bob, Chuan{`}`} as continuing.)
          </p>
        </div>

        {/* Assertion Scoring Summary */}
        <div className="mb-8">
          <h4 className="text-2xl font-bold mb-4">Assertion scoring summary</h4>
          {/* Image 3 */}
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
            assertion. Note that the score is a function of the assertion and
            the vote only - it does not depend on the apparent outcome.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            The overstatement counts (discrepancies) are derived by simply
            subtracting the ballot paper score from the CVR score (and vice
            versa for understatements—understatements are derived from
            subtracting the CVR score from the ballot paper score). For example,
            if a CVR says that a vote contained a first preference for w, but
            the actual ballot contains a mention of l that precedes w, then it
            overstates the <em className="font-bold">w NEB l</em> assertion by 1
            - -1 = 2. By convention, overstatements are written as a positive
            discrepancy, while understatements are negative.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex justify-between items-center mt-12">
          {/* Back Button - Left aligned */}
          <div>
            <Link
              href="/tutorial/risk"
              className="text-black hover:text-gray-500 flex items-center"
            >
              <span className="mr-2 text-black">←</span> Back
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
      </div>
    </div>
  );
};

export default UsingAssertionsContent;
