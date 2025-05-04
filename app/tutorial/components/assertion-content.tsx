import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import TermsAndPrivacy from "@/app/upload/components/terms-and-privacy";

// 定义 Props 类型
interface AssertionContentProps {
  sidebarWidth: number;
  collapsed: boolean;
}

const AssertionContent: React.FC<AssertionContentProps> = ({
  sidebarWidth,
  collapsed,
}) => {
  return (
    <div className="p-8 transition-all duration-300">
      <h2 className="text-4xl font-bold mb-8 text-center">
        Assertions for IRV winners
      </h2>

      {/* Section: Introduction */}
      <div className="mb-8" data-content="Introduction">
        <p className="text-lg text-gray-700 dark:text-white dark:text-white">
          In IRV elections, assertions are critical conditions used to verify
          that the announced winner truly won the election. Assertions allow us
          to narrow down the key elimination steps that need to be checked,
          rather than verifying every elimination order. There are two main
          types of assertions used in RAIRE: Not Eliminated Before (NEB)
          Assertions and Not Eliminated Next (NEN) Assertions.
        </p>
      </div>

      {/* Section: Not Eliminated Before (NEB) Assertions */}
      <div
        className="mb-8"
        data-content="Not Eliminated Before (NEB) Assertions"
      >
        <h3 className="text-2xl font-bold mb-4">
          Not Eliminated Before (NEB) Assertions
        </h3>
        <p className="text-lg text-gray-700 dark:text-white dark:text-white">
          A Not Eliminated Before (NEB) assertion is a condition that states one
          candidate cannot be eliminated before another. This assertion allows
          us to focus on specific elimination orders and disregard paths that
          don’t affect the outcome.{" "}
          <strong>
            <em>Alice NEB Bob </em>
          </strong>{" "}
          is an assertion saying that Alice cannot be eliminated before Bob,
          irrespective of which other candidates are continuing. In other words,
          no outcome is possible in which Alice is eliminated before Bob.
        </p>

        <p className="text-lg text-gray-700 dark:text-white dark:text-white">
          When expressed as a comparison of tallies, this assertion says that
          the smallest number of votes Alice can have, at any point in counting,
          is greater than the largest number of votes Bob can ever have while
          Alice is continuing. Alice’s smallest tally is equal to her first
          preference count – the number of ballots on which she is ranked first.
          The largest number of votes Bob can have while Alice is continuing is
          the number of ballots on which he is ranked higher than Alice, or he
          is ranked and Alice is not.
        </p>
      </div>

      {/* Section: Example */}
      <div className="mb-8" data-content="Example">
        <h4 className="text-xl font-bold mb-4">Example</h4>
        <p className="text-lg text-gray-700 dark:text-white dark:text-white">
          In the following example,{" "}
          <strong>
            <em>Alice NEB Bob</em>
          </strong>{" "}
          is true because Bob is ranked a total of 80 times without being
          preceded by Alice, which is less than Alice’s first-preference tally
          of 100. However,{" "}
          <strong>
            <em>Alice NEB Diego</em>
          </strong>{" "}
          is not true, because Diego is ranked 125 times without being preceded
          by Alice, which is more than Alice’s first preference tally.
        </p>

        <div className="flex justify-center mb-8">
          <Image
            src="/tutorial-images/assertion-preference.png"
            alt="Preferences and Counts Table"
            width={250}
            height={180}
            className="rounded-md"
          />
        </div>
      </div>

      {/* Section: Not Eliminated Next (NEN) Assertions */}
      <div className="mb-8" data-content="Not Eliminated Next (NEN) Assertions">
        <h3 className="text-2xl font-bold mb-4">
          Not Eliminated Next (NEN) Assertions
        </h3>
        <p className="text-lg text-gray-700 dark:text-white dark:text-white">
          NEN assertions compare the tallies of two candidates under the
          assumption that a specific set of candidates have been eliminated. An
          instance of this kind of assertion could look like this:{" "}
          <strong>
            <em>
              NEN: Alice &gt; Bob if only {`{`}Alice, Bob, Diego{`}`}
            </em>
          </strong>{" "}
          remain. This means that in the context where Chuan has been
          eliminated, Alice cannot be eliminated next, because Bob has a lower
          tally. When expressed as a comparison of tallies, this assertion says
          that the number of ballots in Alice’s tally pile, in the context where
          only Alice, Bob, and Diego are continuing, is greater than the number
          of ballots in Bob’s tally pile in this context.
        </p>
        <p className="text-lg text-gray-700 dark:text-white mt-4">
          This example assumes one eliminated candidate – Chuan – however, NEN
          assertions can be constructed with contexts involving no eliminated
          candidates, or more than one eliminated candidate. The assertion{" "}
          <strong>
            <em>
              NEN: Alice &gt; Chuan if only {`{`}Alice, Bob, Chuan, Diego{`}`}
            </em>
          </strong>{" "}
          remain says that Alice cannot be the first eliminated candidate, as
          she has more votes than Chuan when no candidates have yet been
          eliminated. The assertion{" "}
          <strong>
            <em>
              NEN: Diego &gt; Bob if only {`{`}Bob, Diego{`}`}
            </em>
          </strong>{" "}
          remain says that Diego has more votes than Bob in the context where
          those two are the only continuing candidates.
        </p>
      </div>

      {/* Section: Simple Assertions */}
      <div className="mb-8" data-content="Simple assertions sometimes work">
        <h3 className="text-2xl font-semibold mb-4">
          Simple assertions sometimes work
        </h3>
        <p className="text-lg text-gray-700 dark:text-white">
          RAIRE works by generating a set of assertions which, together, imply a
          particular winner. In this section, we introduce some common patterns
          that those sets of assertions might use. We aim to make it obvious why
          certain sets of assertions are enough to imply a particular winner,
          and to match a person’s intuition about why a certain candidate won an
          IRV election.
        </p>
      </div>

      {/* Section: One Candidate Dominates */}
      <div className="mb-8" data-content="One candidate dominates">
        <h4 className="text-xl font-bold mb-4">One candidate dominates</h4>
        <p className="text-lg text-gray-700 dark:text-white">
          Sometimes one candidate happens to be so strongly ahead of all the
          others that NEB assertions hold with all other candidates.
        </p>
        <h5 className="text-lg font-semibold mt-4 mb-2">Example</h5>
        <p className="text-lg text-gray-700 dark:text-white">
          Suppose that for the four candidates Alice, Bob, Chuan, and Diego, we
          have:
        </p>
        <p className="text-lg font-bold mt-4">
          <strong>
            <em>Alice NEB Bob</em>
          </strong>
          , <br />
          <strong>
            <em>Alice NEB Chuan</em>
          </strong>{" "}
          <span className="font-normal italic">and</span> <br />
          <strong>
            <em>Alice NEB Diego.</em>
          </strong>
        </p>
      </div>

      {/* Section: Two Leading Candidates */}
      <div className="mb-8" data-content="Two leading candidates">
        <h4 className="text-xl font-bold mb-4">Two leading candidates</h4>
        <p className="text-lg text-gray-700 dark:text-white mb-4">
          Now suppose there are two candidates who accumulate most of the votes:
          Alice and Bob.
        </p>
        <h5 className="text-lg font-semibold mb-4">Example</h5>
        <p className="text-lg text-gray-700 dark:text-white mb-4">
          Suppose{" "}
          <strong>
            <em>Alice NEB Bob</em>
          </strong>{" "}
          is not true, but the following weaker fact is true:
        </p>
        <p className="text-lg font-bold italic mb-4">
          <strong>
            <em>
              NEN: Alice &gt; Bob if only {`{`}Alice, Bob{`}`}
            </em>
          </strong>{" "}
          remain.
        </p>
        <p className="text-lg text-gray-700 dark:text-white mb-4">
          This says that, after Chuan and Diego are eliminated, Alice’s tally is
          higher than Bob’s.
        </p>
        <p className="text-lg text-gray-700 dark:text-white mb-4">
          Assume we still have two NEB assertions:
        </p>
        <p className="text-lg font-bold">
          <strong>
            <em>Alice NEB Chuan</em>
          </strong>{" "}
          <br />
          <span className="font-normal italic">and</span> <br />
          <strong>
            <em>Alice NEB Diego.</em>
          </strong>
        </p>

        <p className="text-lg text-gray-700 dark:text-white mt-4">
          This, again, is enough to prove that Alice won. To see why, consider
          the last elimination step. Alice must reach this step, because she
          cannot have been eliminated before Chuan or Diego. If Chuan or Diego
          is the other remaining candidate, Alice beats them (by the NEB
          assertion). The only other possibility is Bob—for this case, the NEN
          assertion shows that, in the last round, Alice beats Bob.
        </p>
      </div>

      {/* Section: Visualizing Assertions */}
      <div className="mb-8" data-content="Visualizing assertions">
        <h4 className="text-2xl font-bold mb-4">Visualizing assertions</h4>
        <p className="text-lg text-gray-700 dark:text-white mb-4">
          This reasoning can be visualized using elimination trees. For an
          audit, we need to disprove all elimination orders that result in a
          winner other than the announced winner.
        </p>
        <p className="text-lg text-gray-700 dark:text-white mb-4">
          The assertion{" "}
          <strong>
            <em>Alice NEB Chuan</em>
          </strong>{" "}
          is enough to disprove every elimination order in which Alice is
          eliminated before Chuan, and hence to disprove the entire tree in
          which Chuan wins. It also allows us to disprove the orders in Bob’s
          tree and Diego’s tree in which Alice is eliminated before Chuan.
        </p>
        <p className="text-lg text-gray-700 dark:text-white">
          The consequences of{" "}
          <strong>
            <em>Alice NEB Chuan</em>
          </strong>{" "}
          in Bob’s tree and Chuan’s tree are shown below. It still allows the
          possibility that Bob might win via elimination orders Diego, Chuan,
          Alice, Bob, or Chuan, Diego, Alice, Bob, or Chuan, Alice, Diego, Bob.
        </p>
      </div>
      <div className="flex justify-center mb-8">
        <Image
          src="/tutorial-images/assertion-eliminationtree1.png"
          alt="Elimination Tree 1"
          width={600}
          height={500}
          className="rounded-md"
        />
      </div>
      <div className="flex justify-center mb-8">
        <Image
          src="/tutorial-images/assertion-eliminationtree2.png" // Update to match your file name
          alt="Elimination Tree 2"
          width={600}
          height={500}
          className="rounded-md"
        />
      </div>

      {/* Navigation Links */}
      <div className="flex justify-between items-center mt-12">
        {/* Back Button - Left aligned */}
        <div>
          <Link
            href="/tutorial/outcomes"
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <ChevronLeft className="mr-2 text-gray-600 group-hover:text-gray-900" />{" "}
            Back
          </Link>
        </div>
        {/* Next and Home Links - Right aligned */}
        <div className="text-right">
          <div className="mb-2">
            <span className="font-bold">Next:</span>{" "}
            <Link
              href="/tutorial/risk"
              className="text-blue-500 hover:underline"
            >
              Risk Limiting Audits
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

export default AssertionContent;
