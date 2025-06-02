/**
 * Unit tests for explain_assertions.ts
 *
 * This module tests the input format interpretation and conversion functions
 * that handle different RAIRE audit result formats including:
 * - raire-rs format
 * - Michelle Blom RAIRE format
 * - ShangriLa log format
 *
 * The tests verify proper parsing, validation, and conversion of assertion data
 * from various input sources into a standardized internal format.
 */

import {
  interpret_input_formats,
  convert_from_Michelle_format,
  convert_from_ShangriLa_log_format,
  parseMichelleAssertions,
} from "../lib/explain/explain_assertions";

describe("Input Format Interpretation", () => {
  describe("interpret_input_formats", () => {
    it("should identify and return raire-rs format correctly", () => {
      // Test data representing a valid raire-rs format input
      const raireRsInput = {
        metadata: {
          contest: "Test Contest",
          candidates: ["Alice", "Bob", "Charlie"],
        },
        solution: {
          Ok: {
            assertions: [
              {
                assertion: {
                  type: "NEB",
                  winner: 0,
                  loser: 1,
                },
              },
            ],
            winner: 0,
            num_candidates: 3,
          },
        },
      };

      const result = interpret_input_formats(raireRsInput);

      expect(result).not.toBeNull();
      expect(result?.format).toBe("raire-rs");
      expect(result?.contests).toHaveLength(1);
      expect(result?.contests[0]).toEqual(raireRsInput);
    });

    it("should return null for invalid input formats", () => {
      // Test with completely invalid input structure
      const invalidInput = {
        random: "data",
        structure: true,
      };

      const result = interpret_input_formats(invalidInput);
      expect(result).toBeNull();
    });

    it("should handle empty or malformed objects gracefully", () => {
      const emptyInput = {};
      const result = interpret_input_formats(emptyInput);
      expect(result).toBeNull();
    });
  });

  describe("Michelle Format Conversion", () => {
    it("should convert valid Michelle format to standard format", () => {
      // Mock Michelle Blom RAIRE format input
      const michelleInput = {
        parameters: {
          /* some parameters */
        },
        audits: [
          {
            contest: "Municipal Election 2024",
            winner: "Alice",
            eliminated: ["Bob", "Charlie"],
            assertions: [
              {
                assertion_type: "IRV_ELIMINATION",
                winner: "Alice",
                loser: "Bob",
                already_eliminated: ["Charlie"],
              },
              {
                assertion_type: "WINNER_ONLY",
                winner: "Alice",
                loser: "Charlie",
              },
            ],
          },
        ],
      };

      const result = convert_from_Michelle_format(michelleInput);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(1);

      const contest = result![0];
      expect(contest.metadata.contest).toBe("Municipal Election 2024");
      expect(contest.metadata.candidates).toEqual(["Alice", "Bob", "Charlie"]);
      expect(contest.solution.Ok.winner).toBe(0); // Alice is at index 0
      expect(contest.solution.Ok.num_candidates).toBe(3);
      expect(contest.solution.Ok.assertions).toHaveLength(2);
    });

    it("should return null for invalid Michelle format", () => {
      // Missing required parameters field
      const invalidMichelleInput = {
        audits: [],
      };

      const result = convert_from_Michelle_format(invalidMichelleInput);
      expect(result).toBeNull();
    });

    it("should return null when audits is not an array", () => {
      const invalidMichelleInput = {
        parameters: {},
        audits: "not an array",
      };

      const result = convert_from_Michelle_format(invalidMichelleInput);
      expect(result).toBeNull();
    });
  });

  describe("ShangriLa Format Conversion", () => {
    it("should convert valid ShangriLa log format", () => {
      const shangriLaInput = {
        seed: 12345,
        contests: {
          contest_1: {
            n_winners: 1,
            reported_winners: ["Alice"],
            choice_function: "IRV",
            candidates: ["Alice", "Bob", "Charlie"],
            assertion_json: [
              {
                assertion_type: "WINNER_ONLY",
                winner: "Alice",
                loser: "Bob",
              },
            ],
          },
        },
      };

      const result = convert_from_ShangriLa_log_format(shangriLaInput);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(1);

      const contest = result![0];
      expect(contest.metadata.contest).toBe("contest_1");
      expect(contest.metadata.candidates).toEqual(["Alice", "Bob", "Charlie"]);
      expect(contest.solution.Ok.winner).toBe(0); // Alice at index 0
    });

    it("should return null for invalid ShangriLa format missing seed", () => {
      const invalidInput = {
        contests: {},
      };

      const result = convert_from_ShangriLa_log_format(invalidInput);
      expect(result).toBeNull();
    });

    it("should skip contests with multiple winners", () => {
      const shangriLaInput = {
        seed: 12345,
        contests: {
          multi_winner_contest: {
            n_winners: 2, // Multiple winners - should be skipped
            reported_winners: ["Alice", "Bob"],
            choice_function: "IRV",
            candidates: ["Alice", "Bob", "Charlie"],
            assertion_json: [],
          },
        },
      };

      const result = convert_from_ShangriLa_log_format(shangriLaInput);
      expect(result).toEqual([]);
    });

    it("should skip contests with non-IRV choice function", () => {
      const shangriLaInput = {
        seed: 12345,
        contests: {
          plurality_contest: {
            n_winners: 1,
            reported_winners: ["Alice"],
            choice_function: "PLURALITY", // Non-IRV - should be skipped
            candidates: ["Alice", "Bob"],
            assertion_json: [],
          },
        },
      };

      const result = convert_from_ShangriLa_log_format(shangriLaInput);
      expect(result).toEqual([]);
    });
  });

  describe("Michelle Assertions Parsing", () => {
    it("should parse IRV_ELIMINATION assertions correctly", () => {
      const candidates = ["Alice", "Bob", "Charlie", "Diego"];
      const auditAssertions = [
        {
          assertion_type: "IRV_ELIMINATION",
          winner: "Alice",
          loser: "Bob",
          already_eliminated: ["Charlie"],
        },
      ];

      const result = parseMichelleAssertions(auditAssertions, candidates);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(1);

      const assertion = result![0].assertion;
      expect(assertion.type).toBe("NEN");
      expect(assertion.winner).toBe(0); // Alice
      expect(assertion.loser).toBe(1); // Bob
      expect(assertion.continuing).toEqual([0, 1, 3]); // Alice, Bob, Diego (Charlie eliminated)
    });

    it("should parse WINNER_ONLY assertions correctly", () => {
      const candidates = ["Alice", "Bob", "Charlie"];
      const auditAssertions = [
        {
          assertion_type: "WINNER_ONLY",
          winner: "Alice",
          loser: "Bob",
        },
      ];

      const result = parseMichelleAssertions(auditAssertions, candidates);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(1);

      const assertion = result![0].assertion;
      expect(assertion.type).toBe("NEB");
      expect(assertion.winner).toBe(0); // Alice
      expect(assertion.loser).toBe(1); // Bob
      expect(assertion.continuing).toBeUndefined(); // NEB assertions don't have continuing
    });

    it("should return null for unknown assertion types", () => {
      const candidates = ["Alice", "Bob"];
      const auditAssertions = [
        {
          assertion_type: "UNKNOWN_TYPE",
          winner: "Alice",
          loser: "Bob",
        },
      ];

      const result = parseMichelleAssertions(auditAssertions, candidates);
      expect(result).toBeNull();
    });

    it("should handle multiple assertions of different types", () => {
      const candidates = ["Alice", "Bob", "Charlie", "Diego"];
      const auditAssertions = [
        {
          assertion_type: "WINNER_ONLY",
          winner: "Alice",
          loser: "Charlie",
        },
        {
          assertion_type: "IRV_ELIMINATION",
          winner: "Alice",
          loser: "Bob",
          already_eliminated: ["Diego"],
        },
      ];

      const result = parseMichelleAssertions(auditAssertions, candidates);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(2);

      // First assertion should be NEB
      expect(result![0].assertion.type).toBe("NEB");
      expect(result![0].assertion.winner).toBe(0); // Alice
      expect(result![0].assertion.loser).toBe(2); // Charlie

      // Second assertion should be NEN
      expect(result![1].assertion.type).toBe("NEN");
      expect(result![1].assertion.winner).toBe(0); // Alice
      expect(result![1].assertion.loser).toBe(1); // Bob
      expect(result![1].assertion.continuing).toEqual([0, 1, 2]); // Alice, Bob, Charlie
    });

    it("should handle candidate name to index mapping correctly", () => {
      const candidates = ["Bob", "Alice", "Charlie"]; // Non-alphabetical order
      const auditAssertions = [
        {
          assertion_type: "WINNER_ONLY",
          winner: "Alice",
          loser: "Charlie",
        },
      ];

      const result = parseMichelleAssertions(auditAssertions, candidates);

      expect(result).not.toBeNull();
      const assertion = result![0].assertion;
      expect(assertion.winner).toBe(1); // Alice is at index 1
      expect(assertion.loser).toBe(2); // Charlie is at index 2
    });
  });
});
