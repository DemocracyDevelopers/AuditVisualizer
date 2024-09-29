// tutorial/components/OutcomesContent.tsx

import React from "react";
import Link from "next/link";
import Image from "next/image";
const OutcomesContent: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100">
      {/* Main content */}
      <div className="bg-white p-12 shadow-lg w-full max-h-screen overflow-y-auto">
        {/* Main Heading */}
        <h2 className="text-4xl font-bold mb-8 text-center">
          IRV elections and Visualizing Outcomes
        </h2>

        {/* Section: How IRV Counts Work */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">How IRV Counts Work</h3>
          <p className="text-lg text-gray-700">
            In Instant Runoff Voting (IRV) elections, voters rank candidates in
            order of preference. Initially, each candidate receives the votes
            where they are ranked first. The candidate with the least votes is
            eliminated, and their votes are transferred to the next preferred
            candidate on each ballot. This elimination process continues until
            one candidate has a majority and is declared the winner.
          </p>
        </div>

        {/* Section: Example */}
        <div className="mb-8">
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
            has 2, Chuan has 4, and Diego has 4. This means that Bob is
            eliminated first and his votes are distributed to the next-preferred
            candidate on each ballot—Diego gets the (B, D, A) vote and Alice
            gets the (B, A, C) vote. The new tallies are Alice: 6, Bob:
            eliminated, Chuan: 4, Diego: 5. Now Chuan is eliminated. Diego gains
            two more votes—the (C, D) ballots—and wins with 7 votes compared to
            Alice’s 6.
          </p>
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">
            The full sequence of tallies is shown below.
          </h3>

          {/* Full Sequence Image */}
          <div className="flex justify-center mb-8">
            <Image
              src="/tutorial-images/outcomes-sequencetally.png"
              alt="Sequence of Tallies"
              width={1000}
              height={500}
              className="rounded-md"
            />
          </div>
        </div>

        {/* Section: Visualizing IRV Outcomes */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">
            Visualizing all possible IRV outcomes
          </h3>
          <p className="text-lg text-gray-700">
            Visualizing the possible outcomes of an Instant Runoff Voting (IRV)
            election is crucial to understanding how the process of elimination
            determines the winner. Since IRV involves multiple rounds of
            candidate eliminations, it’s helpful to use elimination trees to see
            all possible elimination sequences. Each elimination tree
            corresponds to a potential winner, showing the various paths by
            which a candidate could win the election.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            An elimination tree is a hierarchical structure that represents the
            order in which candidates are eliminated in the election. The root
            of the tree represents the potential winner, and each branch
            represents a sequence of eliminations. At each level, a candidate is
            eliminated, and the remaining votes are redistributed according to
            the next preferences.
          </p>

          {/* Example Explanation */}
          <h4 className="text-xl font-bold mb-2">Example</h4>
          <p className="text-lg text-gray-700">
            For an election between candidates Alice, Bob, Chuan, and Diego, the
            top level of each of these elimination trees is shown below:
          </p>
        </div>
        <div className="flex justify-center mb-8">
          <Image
            src="/tutorial-images/outcomes-ABCD.png"
            alt="Sequence of Tallies"
            width={500}
            height={200}
            className="rounded-md"
          />
        </div>
        {/* Explanation of Nodes */}
        <p className="text-lg text-gray-700 mb-4">
          Consider the first node. This node represents all outcomes that end
          with Alice as the winner. Similarly, the second depicted node
          represents all outcomes that end with Bob as the winner. Each node in
          an elimination tree represents either a complete or a partial outcome.
          Nodes 1 to 4 in figure above represent partial outcomes as they do not
          express a complete elimination order.
        </p>

        <p className="text-lg text-gray-700">
          Next we only consider the case where Alice is the winner. Figure below
          visualizes all elimination orders that end with Alice as the winner:
        </p>
        {/* Elimination Tree Visualization */}
        <div className="flex justify-center mb-8">
          <Image
            src="/tutorial-images/outcomes-eliminationtree.png" // Update to match your file name
            alt="Elimination Tree for Alice as the Winner"
            width={600}
            height={500}
            className="rounded-md"
          />
        </div>

        <p className="text-lg text-gray-700 mb-4">
          At the second level of the tree, we add a candidate as the runner-up.
          (The runner-up is the last candidate eliminated, though in IRV this is
          not necessarily the losing candidate who came closest to winning.)
          Node 4 represents all outcomes that end with Bob as the runner-up and
          Alice as the winner. In nodes 5 and 6, Chuan and Diego, respectively,
          are the runner-up candidates.
        </p>

        <p className="text-lg text-gray-700 mb-4">
          The third level of the tree identifies a candidate to be eliminated
          just prior to our runner-up. The leaves, on the fourth level,
          represent complete elimination orders. Node 13, for example,
          represents an elimination order in which Diego is eliminated first and
          Chuan second, leaving Bob as the runner-up, and Alice as the winner.
          Nodes 13–18 represent complete outcomes.
        </p>

        <p className="text-lg text-gray-700 mb-8">
          The tree captures all elimination orders that end with Alice as the
          ultimate winner. The complete set of alternate outcome trees that
          RAIRE considers is formed by a collection of such trees, one for each
          reported loser. To save space we often label each node with only the
          candidate eliminated at that step, rather than the whole elimination
          order. The whole order can be read by tracing up to the top. So each
          path up a tree represents an elimination order, with the
          first-eliminated candidate at the leaf and the winner at the top. We
          demonstrate this idea in the next example.
        </p>
        {/* Navigation Links */}
        <div className="flex justify-between items-center mt-12">
          {/* Back Button - Left aligned */}
          <div>
            <Link
              href="/tutorial/introduction"
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
                href="/tutorial/assertion" // Replace with the actual path for the next step
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
      </div>
    </div>
  );
};

export default OutcomesContent;
