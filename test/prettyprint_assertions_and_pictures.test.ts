/**
 * Unit tests for prettyprint_assertions_and_pictures.ts
 *
 * This module tests the core assertion evaluation and elimination tree generation logic.
 * It covers:
 * - Assertion compatibility checking with elimination order suffixes
 * - Filtering elimination orders based on assertion constraints
 * - Building and manipulating elimination trees
 * - Generating human-readable explanations of assertion effects
 * - NEB (Not Eliminated Before) and NEN (Not Eliminated Next) assertion handling
 *
 * These functions are crucial for visualizing how assertions eliminate
 * possible election outcomes and prove a particular winner.
 */

import {
  assertion_ok_elimination_order_suffix,
  assertion_allowed_suffixes,
  assertion_all_allowed_suffixes,
  all_elimination_orders,
  all_elimination_order_suffixes,
  assertion_description,
  explain,
  EffectOfAssertionOnEliminationOrderSuffix,
  Assertion,
} from "../lib/explain/prettyprint_assertions_and_pictures";

describe("Assertion Evaluation Logic", () => {
  describe("assertion_ok_elimination_order_suffix", () => {
    it("should validate NEB assertion correctly - OK case", () => {
      // NEB: Alice beats Bob always
      const assertion: Assertion = {
        type: "NEB",
        winner: 0, // Alice
        loser: 1, // Bob
        assertion_index: 1,
      };

      // Elimination order where Alice (0) comes after Bob (1) - Alice wins
      const eliminationOrder = [1, 0]; // Bob eliminated first, then Alice wins

      const result = assertion_ok_elimination_order_suffix(
        assertion,
        eliminationOrder,
      );
      expect(result).toBe(EffectOfAssertionOnEliminationOrderSuffix.Ok);
    });

    it("should detect NEB assertion contradiction", () => {
      // NEB: Alice beats Bob always
      const assertion: Assertion = {
        type: "NEB",
        winner: 0, // Alice
        loser: 1, // Bob
        assertion_index: 1,
      };

      // Elimination order where Bob (1) comes after Alice (0) - contradicts NEB
      const eliminationOrder = [0, 1]; // Alice eliminated first - CONTRADICTION

      const result = assertion_ok_elimination_order_suffix(
        assertion,
        eliminationOrder,
      );
      expect(result).toBe(
        EffectOfAssertionOnEliminationOrderSuffix.Contradiction,
      );
    });

    it("should require more detail for incomplete NEB assertion", () => {
      const assertion: Assertion = {
        type: "NEB",
        winner: 0, // Alice
        loser: 1, // Bob
        assertion_index: 1,
      };

      // Incomplete elimination order - neither Alice nor Bob seen yet
      const eliminationOrder = [2]; // Only Charlie (2) eliminated

      const result = assertion_ok_elimination_order_suffix(
        assertion,
        eliminationOrder,
      );
      expect(result).toBe(
        EffectOfAssertionOnEliminationOrderSuffix.NeedsMoreDetail,
      );
    });

    it("should validate NEN assertion correctly - OK case", () => {
      // NEN: Alice beats Bob when only {Alice, Bob, Charlie} remain
      const assertion: Assertion = {
        type: "NEN",
        winner: 0, // Alice
        loser: 1, // Bob
        continuing: [0, 1, 2], // Alice, Bob, Charlie
        assertion_index: 1,
      };

      // Elimination order: Diego eliminated first, then Bob, then Alice wins
      const eliminationOrder = [3, 1, 0]; // [Diego, Bob, Alice]

      const result = assertion_ok_elimination_order_suffix(
        assertion,
        eliminationOrder,
      );
      expect(result).toBe(EffectOfAssertionOnEliminationOrderSuffix.Ok);
    });

    it("should detect NEN assertion contradiction when winner eliminated first", () => {
      const assertion: Assertion = {
        type: "NEN",
        winner: 0, // Alice
        loser: 1, // Bob
        continuing: [0, 1, 2], // Alice, Bob, Charlie
        assertion_index: 1,
      };

      // Alice eliminated first in the continuing context - CONTRADICTION
      const eliminationOrder = [3, 0, 1, 2]; // [Diego, Alice, Bob, Charlie]

      const result = assertion_ok_elimination_order_suffix(
        assertion,
        eliminationOrder,
      );
      expect(result).toBe(
        EffectOfAssertionOnEliminationOrderSuffix.Contradiction,
      );
    });

    it("should handle NEN assertion when elimination order is outside context", () => {
      const assertion: Assertion = {
        type: "NEN",
        winner: 0, // Alice
        loser: 1, // Bob
        continuing: [0, 1], // Only Alice and Bob
        assertion_index: 1,
      };

      // Elimination order involves Charlie who is not in continuing set
      const eliminationOrder = [2, 0]; // [Charlie, Alice] - Charlie not in context

      const result = assertion_ok_elimination_order_suffix(
        assertion,
        eliminationOrder,
      );
      expect(result).toBe(EffectOfAssertionOnEliminationOrderSuffix.Ok);
    });

    it("should require more detail for incomplete NEN assertion", () => {
      const assertion: Assertion = {
        type: "NEN",
        winner: 0, // Alice
        loser: 1, // Bob
        continuing: [0, 1, 2], // Alice, Bob, Charlie
        assertion_index: 1,
      };

      // Incomplete - haven't seen enough of the elimination order
      const eliminationOrder = [2]; // Only Charlie eliminated

      const result = assertion_ok_elimination_order_suffix(
        assertion,
        eliminationOrder,
      );
      expect(result).toBe(
        EffectOfAssertionOnEliminationOrderSuffix.NeedsMoreDetail,
      );
    });
  });

  describe("assertion_allowed_suffixes", () => {
    it("should return original suffix when assertion is satisfied", () => {
      const assertion: Assertion = {
        type: "NEB",
        winner: 0, // Alice
        loser: 1, // Bob
        assertion_index: 1,
      };

      const suffix = [1, 0]; // Bob eliminated, Alice wins
      const result = assertion_allowed_suffixes(assertion, suffix, 2, false);

      expect(result).toEqual([suffix]);
    });

    it("should return empty array when assertion contradicted and not just_get_enough_info", () => {
      const assertion: Assertion = {
        type: "NEB",
        winner: 0, // Alice
        loser: 1, // Bob
        assertion_index: 1,
      };

      const suffix = [0, 1]; // Alice eliminated first - contradiction
      const result = assertion_allowed_suffixes(assertion, suffix, 2, false);

      expect(result).toEqual([]);
    });

    it("should return original suffix when contradicted but just_get_enough_info is true", () => {
      const assertion: Assertion = {
        type: "NEB",
        winner: 0, // Alice
        loser: 1, // Bob
        assertion_index: 1,
      };

      const suffix = [0, 1]; // Alice eliminated first - contradiction
      const result = assertion_allowed_suffixes(assertion, suffix, 2, true);

      expect(result).toEqual([suffix]); // Return as-is when just getting info
    });

    it("should expand suffix when more detail needed", () => {
      const assertion: Assertion = {
        type: "NEB",
        winner: 0, // Alice
        loser: 1, // Bob
        assertion_index: 1,
      };

      const suffix = [2]; // Only Charlie eliminated - need more detail
      const result = assertion_allowed_suffixes(assertion, suffix, 3, false);

      // Should expand to include Alice and Bob in various orders
      expect(result.length).toBeGreaterThanOrEqual(1);

      // Check that results include the expected candidates
      const allCandidatesInResults = new Set();
      result.forEach((order) => {
        order.forEach((candidate) => allCandidatesInResults.add(candidate));
      });

      expect(allCandidatesInResults.has(0)).toBe(true); // Should include Alice
      expect(allCandidatesInResults.has(2)).toBe(true); // Should include Charlie (original)
    });

    it("should handle three-candidate expansion correctly", () => {
      const assertion: Assertion = {
        type: "NEB",
        winner: 0, // Alice
        loser: 1, // Bob
        assertion_index: 1,
      };

      const suffix = [0]; // Alice wins - need to determine elimination order
      const result = assertion_allowed_suffixes(assertion, suffix, 3, false);

      // All valid suffixes should have Alice as winner and satisfy Alice NEB Bob
      result.forEach((order) => {
        expect(order[order.length - 1]).toBe(0); // Alice wins
        const aliceIndex = order.indexOf(0);
        const bobIndex = order.indexOf(1);
        if (bobIndex !== -1) {
          expect(aliceIndex).toBeGreaterThan(bobIndex); // Alice eliminated after Bob
        }
      });
    });
  });

  describe("assertion_all_allowed_suffixes", () => {
    it("should process multiple elimination order suffixes", () => {
      const assertion: Assertion = {
        type: "NEB",
        winner: 0, // Alice
        loser: 1, // Bob
        assertion_index: 1,
      };

      const suffixes = [
        [1, 0], // Valid: Bob then Alice
        [0, 1], // Invalid: Alice then Bob
        [2, 0], // Valid: Charlie then Alice
      ];

      const result = assertion_all_allowed_suffixes(
        assertion,
        suffixes,
        3,
        false,
      );

      // Should filter out the invalid suffix [0, 1]
      expect(result).toContainEqual([1, 0]);
      expect(result).toContainEqual([2, 0]);
      expect(result).not.toContainEqual([0, 1]);
    });

    it("should handle empty input array", () => {
      const assertion: Assertion = {
        type: "NEB",
        winner: 0,
        loser: 1,
        assertion_index: 1,
      };

      const result = assertion_all_allowed_suffixes(assertion, [], 2, false);
      expect(result).toEqual([]);
    });
  });

  describe("all_elimination_orders", () => {
    it("should generate all permutations for 2 candidates", () => {
      const result = all_elimination_orders(2);

      expect(result).toHaveLength(2); // 2! = 2
      expect(result).toContainEqual([0, 1]);
      expect(result).toContainEqual([1, 0]);
    });

    it("should generate all permutations for 3 candidates", () => {
      const result = all_elimination_orders(3);

      expect(result).toHaveLength(6); // 3! = 6
      // Check that all permutations are present
      expect(result).toContainEqual([0, 1, 2]);
      expect(result).toContainEqual([0, 2, 1]);
      expect(result).toContainEqual([1, 0, 2]);
      expect(result).toContainEqual([1, 2, 0]);
      expect(result).toContainEqual([2, 0, 1]);
      expect(result).toContainEqual([2, 1, 0]);
    });

    it("should handle zero candidates", () => {
      const result = all_elimination_orders(0);
      expect(result).toEqual([[]]);
    });

    it("should handle single candidate", () => {
      const result = all_elimination_orders(1);
      expect(result).toEqual([[0]]);
    });
  });

  describe("all_elimination_order_suffixes", () => {
    it("should generate single-candidate suffixes", () => {
      const result = all_elimination_order_suffixes(3);

      expect(result).toHaveLength(3);
      expect(result).toContainEqual([0]);
      expect(result).toContainEqual([1]);
      expect(result).toContainEqual([2]);
    });

    it("should handle zero candidates", () => {
      const result = all_elimination_order_suffixes(0);
      expect(result).toEqual([]);
    });
  });

  describe("assertion_description", () => {
    it("should describe NEB assertion correctly", () => {
      const assertion: Assertion = {
        type: "NEB",
        winner: 0,
        loser: 1,
        assertion_index: 1,
      };
      const candidateNames = ["Alice", "Bob", "Charlie"];

      const description = assertion_description(assertion, candidateNames);
      expect(description).toBe("Alice beats Bob always");
    });

    it("should describe NEN assertion correctly", () => {
      const assertion: Assertion = {
        type: "NEN",
        winner: 0,
        loser: 1,
        continuing: [0, 1, 2],
        assertion_index: 1,
      };
      const candidateNames = ["Alice", "Bob", "Charlie"];

      const description = assertion_description(assertion, candidateNames);
      expect(description).toBe(
        "Alice beats Bob if only {Alice,Bob,Charlie} remain",
      );
    });

    it("should handle different candidate name orderings", () => {
      const assertion: Assertion = {
        type: "NEB",
        winner: 2,
        loser: 0,
        assertion_index: 1,
      };
      const candidateNames = ["Charlie", "Bob", "Alice"];

      const description = assertion_description(assertion, candidateNames);
      expect(description).toBe("Alice beats Charlie always");
    });
  });

  describe("explain", () => {
    it("should generate explanation for simple two-candidate scenario", () => {
      const assertions: Assertion[] = [
        {
          type: "NEB",
          winner: 0, // Alice
          loser: 1, // Bob
          assertion_index: 0,
        },
      ];
      const candidateNames = ["Alice", "Bob"];

      const result = explain(assertions, candidateNames, false, false, 0);

      expect(result).toHaveLength(2); // One entry for each potential winner

      // Check that Alice's entry shows successful verification
      const aliceEntry = result.find(
        (entry) => entry.winnerInfo.name === "Alice",
      );
      expect(aliceEntry).toBeDefined();
      expect(aliceEntry.data.type).toBe("step-by-step");

      // Check that Bob's entry shows elimination
      const bobEntry = result.find((entry) => entry.winnerInfo.name === "Bob");
      expect(bobEntry).toBeDefined();
    });

    it("should handle hideWinner option correctly", () => {
      const assertions: Assertion[] = [
        {
          type: "NEB",
          winner: 0,
          loser: 1,
          assertion_index: 0,
        },
      ];
      const candidateNames = ["Alice", "Bob"];

      const result = explain(assertions, candidateNames, false, true, 0);

      // Should only show Bob's tree (Alice is hidden as winner)
      expect(result).toHaveLength(1);
      expect(result[0].winnerInfo.name).toBe("Bob");
    });

    it("should generate step-by-step process correctly", () => {
      const assertions: Assertion[] = [
        {
          type: "NEB",
          winner: 0, // Alice
          loser: 1, // Bob
          assertion_index: 0,
        },
        {
          type: "NEB",
          winner: 0, // Alice
          loser: 2, // Charlie
          assertion_index: 1,
        },
      ];
      const candidateNames = ["Alice", "Bob", "Charlie"];

      const result = explain(assertions, candidateNames, false, false, 0);

      // Find Bob's elimination tree
      const bobEntry = result.find((entry) => entry.winnerInfo.name === "Bob");
      expect(bobEntry).toBeDefined();

      type ProcessStep = {
        step: number;
        assertion?: {
          content: string;
          [key: string]: any;
        };
        [key: string]: any;
      };

      const process = bobEntry.data.process as ProcessStep[];

      expect(process.length).toBeGreaterThanOrEqual(2); // At least step 0 + 1 assertion

      // Check step 0 (initial state)
      expect(process[0].step).toBe(0);
      expect(process[0].trees).toBeDefined();

      // Check that we have assertion steps
      const assertionSteps = process.filter((step) => step.step > 0);
      expect(assertionSteps.length).toBeGreaterThanOrEqual(1);

      if (assertionSteps.length >= 1) {
        expect(assertionSteps[0].assertion).toBeDefined();

        const assertion0 = assertionSteps[0].assertion!;
        expect(assertion0.content).toContain("Alice beats Bob always");
      }

      if (assertionSteps.length >= 2) {
        expect(assertionSteps[1].assertion).toBeDefined();

        const assertion1 = assertionSteps[1].assertion!;
        expect(assertion1.content).toContain("Alice beats Charlie always");
      }
    });

    it("should handle complex three-candidate elimination scenario", () => {
      const assertions: Assertion[] = [
        {
          type: "NEN",
          winner: 0, // Alice
          loser: 1, // Bob
          continuing: [0, 1],
          assertion_index: 0,
        },
        {
          type: "NEB",
          winner: 0, // Alice
          loser: 2, // Charlie
          assertion_index: 1,
        },
      ];
      const candidateNames = ["Alice", "Bob", "Charlie"];

      const result = explain(assertions, candidateNames, true, false, 0);

      expect(result).toHaveLength(3); // One for each potential winner

      // Verify that each entry has proper structure
      result.forEach((entry) => {
        expect(entry.winnerInfo).toBeDefined();
        expect(entry.winnerInfo.id).toBeGreaterThanOrEqual(0);
        expect(entry.winnerInfo.id).toBeLessThan(3);
        expect(entry.winnerInfo.name).toBe(candidateNames[entry.winnerInfo.id]);
        expect(entry.data.type).toBe("step-by-step");
        expect(Array.isArray(entry.data.process)).toBe(true);
      });
    });

    it("should handle empty assertions gracefully", () => {
      const assertions: Assertion[] = [];
      const candidateNames = ["Alice", "Bob"];

      const result = explain(assertions, candidateNames, false, false, 0);

      expect(result).toHaveLength(2);
      // Each entry should have only the initial step (step 0)
      result.forEach((entry) => {
        expect(entry.data.process).toHaveLength(1);
        expect(entry.data.process[0].step).toBe(0);
      });
    });

    it("should detect when tree remains unchanged after assertion", () => {
      // Create a scenario where an assertion doesn't change the tree
      const assertions: Assertion[] = [
        {
          type: "NEB",
          winner: 0, // Alice
          loser: 1, // Bob - already can't win, so tree won't change
          assertion_index: 0,
        },
      ];
      const candidateNames = ["Alice", "Bob"];

      const result = explain(assertions, candidateNames, false, false, 0);

      // Find Alice's entry (winner)
      const aliceEntry = result.find(
        (entry) => entry.winnerInfo.name === "Alice",
      );
      expect(aliceEntry).toBeDefined();

      const process = aliceEntry.data.process;
      if (process.length > 1) {
        // Check if treeUnchanged is properly detected
        expect(process[1]).toHaveProperty("treeUnchanged");
        expect(typeof process[1].treeUnchanged).toBe("boolean");
      }
    });

    it("should handle expandFullyAtStart option", () => {
      const assertions: Assertion[] = [
        {
          type: "NEB",
          winner: 0,
          loser: 1,
          assertion_index: 0,
        },
      ];
      const candidateNames = ["Alice", "Bob", "Charlie"];

      // Test with expandFullyAtStart = true
      const resultExpanded = explain(
        assertions,
        candidateNames,
        true,
        false,
        0,
      );

      // Test with expandFullyAtStart = false
      const resultMinimal = explain(
        assertions,
        candidateNames,
        false,
        false,
        0,
      );

      // Both should produce valid results
      expect(resultExpanded).toHaveLength(3);
      expect(resultMinimal).toHaveLength(3);

      // Structure should be similar but potentially different tree details
      expect(resultExpanded[0].data.type).toBe("step-by-step");
      expect(resultMinimal[0].data.type).toBe("step-by-step");
    });
  });
});
