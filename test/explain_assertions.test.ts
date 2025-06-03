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
      // Test: Standard raire-rs format with metadata and solution structure
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

      // Should correctly identify as raire-rs format and wrap in contests array
      expect(result).not.toBeNull();
      expect(result?.format).toBe("raire-rs");
      expect(result?.contests).toHaveLength(1);
      expect(result?.contests[0]).toEqual(raireRsInput);
    });

    it("should return null for invalid input formats", () => {
      // Test: Unrecognized input structure should be rejected
      const invalidInput = {
        random: "data",
        structure: true,
      };

      const result = interpret_input_formats(invalidInput);
      expect(result).toBeNull();
    });

    it("should handle empty or malformed objects gracefully", () => {
      // Test: Empty input should not crash, should return null
      const emptyInput = {};
      const result = interpret_input_formats(emptyInput);
      expect(result).toBeNull();
    });
  });

  describe("Michelle Format Conversion", () => {
    it("should convert valid Michelle format to standard format", () => {
      // Test: Michelle Blom RAIRE format → standard format conversion
      // Michelle format uses candidate names, we convert to indices
      const michelleInput = {
        parameters: {
          /* some parameters */
        },
        audits: [
          {
            contest: "Municipal Election 2024",
            winner: "Alice",
            eliminated: ["Bob", "Charlie"], // Order: Alice, Bob, Charlie
            assertions: [
              {
                assertion_type: "IRV_ELIMINATION", // → NEN assertion
                winner: "Alice",
                loser: "Bob",
                already_eliminated: ["Charlie"],
              },
              {
                assertion_type: "WINNER_ONLY", // → NEB assertion
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
      // Candidates list should be [winner, ...eliminated]
      expect(contest.metadata.contest).toBe("Municipal Election 2024");
      expect(contest.metadata.candidates).toEqual(["Alice", "Bob", "Charlie"]);
      expect(contest.solution.Ok.winner).toBe(0); // Alice is at index 0
      expect(contest.solution.Ok.num_candidates).toBe(3);
      expect(contest.solution.Ok.assertions).toHaveLength(2);
    });

    it("should return null for invalid Michelle format", () => {
      // Test: Missing required 'parameters' field should cause rejection
      const invalidMichelleInput = {
        audits: [],
      };

      const result = convert_from_Michelle_format(invalidMichelleInput);
      expect(result).toBeNull();
    });

    it("should return null when audits is not an array", () => {
      // Test: 'audits' must be an array, not a string
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
      // Test: ShangriLa audit log format → standard format conversion
      const shangriLaInput = {
        seed: 12345,
        contests: {
          contest_1: {
            n_winners: 1, // Must be single-winner contest
            reported_winners: ["Alice"],
            choice_function: "IRV", // Must be IRV election
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
      // Test: 'seed' field is required in ShangriLa format
      const invalidInput = {
        contests: {},
      };

      const result = convert_from_ShangriLa_log_format(invalidInput);
      expect(result).toBeNull();
    });

    it("should skip contests with multiple winners", () => {
      // Test: Only single-winner IRV contests are supported
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
      expect(result).toEqual([]); // No contests should be converted
    });

    it("should skip contests with non-IRV choice function", () => {
      // Test: Only IRV elections are supported, skip plurality/other methods
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
      expect(result).toEqual([]); // No contests should be converted
    });
  });

  describe("Michelle Assertions Parsing", () => {
    it("should parse IRV_ELIMINATION assertions correctly", () => {
      // Test: IRV_ELIMINATION → NEN assertion conversion
      // NEN means "winner beats loser when only continuing candidates remain"
      const candidates = ["Alice", "Bob", "Charlie", "Diego"];
      const auditAssertions = [
        {
          assertion_type: "IRV_ELIMINATION",
          winner: "Alice",
          loser: "Bob",
          already_eliminated: ["Charlie"], // Charlie already out
        },
      ];

      const result = parseMichelleAssertions(auditAssertions, candidates);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(1);

      const assertion = result![0].assertion;
      expect(assertion.type).toBe("NEN");
      expect(assertion.winner).toBe(0); // Alice
      expect(assertion.loser).toBe(1); // Bob
      // Continuing = all candidates except already_eliminated
      expect(assertion.continuing).toEqual([0, 1, 3]); // Alice, Bob, Diego (Charlie eliminated)
    });

    it("should parse WINNER_ONLY assertions correctly", () => {
      // Test: WINNER_ONLY → NEB assertion conversion
      // NEB means "winner is never eliminated before loser"
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
      // Test: Unrecognized assertion types should cause parsing failure
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
      // Test: Mixed assertion types in single audit
      const candidates = ["Alice", "Bob", "Charlie", "Diego"];
      const auditAssertions = [
        {
          assertion_type: "WINNER_ONLY", // → NEB
          winner: "Alice",
          loser: "Charlie",
        },
        {
          assertion_type: "IRV_ELIMINATION", // → NEN
          winner: "Alice",
          loser: "Bob",
          already_eliminated: ["Diego"],
        },
      ];

      const result = parseMichelleAssertions(auditAssertions, candidates);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(2);

      // First assertion should be NEB (Alice never eliminated before Charlie)
      expect(result![0].assertion.type).toBe("NEB");
      expect(result![0].assertion.winner).toBe(0); // Alice
      expect(result![0].assertion.loser).toBe(2); // Charlie

      // Second assertion should be NEN (Alice beats Bob when Diego already eliminated)
      expect(result![1].assertion.type).toBe("NEN");
      expect(result![1].assertion.winner).toBe(0); // Alice
      expect(result![1].assertion.loser).toBe(1); // Bob
      expect(result![1].assertion.continuing).toEqual([0, 1, 2]); // Alice, Bob, Charlie
    });

    it("should handle candidate name to index mapping correctly", () => {
      // Test: Candidate order in array determines indices (not alphabetical)
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
