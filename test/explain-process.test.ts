/**
 * Unit tests for explain-process.tsx (Core Logic Only)
 *
 * This module tests only the core logic functions, not input validation
 * or frontend-specific functionality.
 */

import {
  getCandidateNumber,
  getAssertions,
} from "../app/explain-assertions/components/explain-process";

describe("Core Logic Functions", () => {
  describe("getCandidateNumber", () => {
    it("should extract candidate count from valid JSON", () => {
      const validJson = JSON.stringify({
        metadata: { candidates: ["Alice", "Bob", "Charlie"] },
      });

      const result = getCandidateNumber(validJson);
      expect(result).toBe(3);
    });

    it("should return -1 for invalid JSON", () => {
      const result = getCandidateNumber("{ invalid json }");
      expect(result).toBe(-1);
    });

    it("should return -1 for missing metadata", () => {
      const result = getCandidateNumber(JSON.stringify({ solution: {} }));
      expect(result).toBe(-1);
    });

    it("should return -1 for non-array candidates", () => {
      const result = getCandidateNumber(
        JSON.stringify({
          metadata: { candidates: "not array" },
        }),
      );
      expect(result).toBe(-1);
    });

    it("should handle empty candidates array", () => {
      const result = getCandidateNumber(
        JSON.stringify({
          metadata: { candidates: [] },
        }),
      );
      expect(result).toBe(0);
    });

    it("should handle missing candidates field", () => {
      const result = getCandidateNumber(
        JSON.stringify({
          metadata: {},
        }),
      );
      expect(result).toBe(-1);
    });
  });

  describe("getAssertions", () => {
    it("should extract assertions from valid JSON", () => {
      const validJson = JSON.stringify({
        solution: {
          Ok: {
            assertions: [
              { assertion: { type: "NEB", winner: 0, loser: 1 } },
              {
                assertion: {
                  type: "NEN",
                  winner: 0,
                  loser: 2,
                  continuing: [0, 2],
                },
              },
            ],
          },
        },
      });

      const result = getAssertions(validJson);

      expect(result).toHaveLength(2);
      expect(result[0].assertion.type).toBe("NEB");
      expect(result[1].assertion.type).toBe("NEN");
    });

    it("should return empty array for invalid JSON", () => {
      const result = getAssertions("{ invalid json }");
      expect(result).toEqual([]);
    });

    it("should return empty array for missing solution.Ok", () => {
      const result = getAssertions(
        JSON.stringify({
          metadata: { candidates: ["Alice", "Bob"] },
        }),
      );
      expect(result).toEqual([]);
    });

    it("should return empty array for missing solution", () => {
      const result = getAssertions(
        JSON.stringify({
          metadata: { candidates: ["Alice", "Bob"] },
        }),
      );
      expect(result).toEqual([]);
    });

    it("should return empty array for non-array assertions", () => {
      const result = getAssertions(
        JSON.stringify({
          solution: { Ok: { assertions: "not array" } },
        }),
      );
      expect(result).toEqual([]);
    });

    it("should handle empty assertions array", () => {
      const result = getAssertions(
        JSON.stringify({
          solution: { Ok: { assertions: [] } },
        }),
      );
      expect(result).toEqual([]);
    });

    it("should handle solution.Ok being null", () => {
      const result = getAssertions(
        JSON.stringify({
          solution: { Ok: null },
        }),
      );
      expect(result).toEqual([]);
    });

    it("should handle solution being null", () => {
      const result = getAssertions(
        JSON.stringify({
          solution: null,
        }),
      );
      expect(result).toEqual([]);
    });

    it("should handle missing assertions field in solution.Ok", () => {
      const result = getAssertions(
        JSON.stringify({
          solution: { Ok: { winner: 0, num_candidates: 2 } },
        }),
      );
      expect(result).toEqual([]);
    });
  });
});
