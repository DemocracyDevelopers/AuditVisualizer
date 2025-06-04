/**
 * Unit tests for lazy_explain.tsx (Core Algorithm Logic Only)
 *
 * This module tests the pure algorithmic functions for lazy tree operations.
 * Tests cover:
 * - Tree node navigation and lookup algorithms
 * - Tree expansion and collapse algorithms
 * - Tree initialization and creation algorithms
 * - Assertion evaluation during tree operations
 *
 * Note: These are pure algorithm functions, not UI logic.
 */

import {
  TreeNode,
  findNodeByPath,
  isNodeExpanded,
  collapseTreeByNode,
  expandTreeByNode,
  createInitialTree,
  createTreeFromFile,
} from "../app/explain-assertions/components/lazy_explain";

// Mock the assertion evaluation functions
jest.mock("../lib/explain/prettyprint_assertions_and_pictures", () => ({
  assertion_ok_elimination_order_suffix: jest.fn(),
  EffectOfAssertionOnEliminationOrderSuffix: {
    Contradiction: "Contradiction",
    Ok: "Ok",
    NeedsMoreDetail: "NeedsMoreDetail",
  },
}));

describe("Tree Algorithm Operations", () => {
  describe("findNodeByPath", () => {
    it("should find node by exact path match", () => {
      // Test: Tree traversal algorithm - find node by elimination path
      const root: TreeNode = {
        id: 0,
        path: [0],
        remainingAssertions: [],
        children: [
          {
            id: 1,
            path: [1, 0], // Path represents: candidate 1 eliminated, then candidate 0
            remainingAssertions: [],
            children: [],
            remaining: [2],
            pruned: false,
          },
        ],
        remaining: [1, 2],
        pruned: false,
      };

      const result = findNodeByPath(root, [1, 0]);

      expect(result).not.toBeNull();
      expect(result!.id).toBe(1);
      expect(result!.path).toEqual([1, 0]);
    });

    it("should return null for non-existent path", () => {
      // Test: Robustness - search for path that doesn't exist in tree
      const root: TreeNode = {
        id: 0,
        path: [0],
        remainingAssertions: [],
        children: [],
        remaining: [1, 2],
        pruned: false,
      };

      const result = findNodeByPath(root, [3, 2, 1]);
      expect(result).toBeNull();
    });

    it("should handle empty path", () => {
      // Test: Edge case - empty path should return null
      const root: TreeNode = {
        id: 0,
        path: [0],
        remainingAssertions: [],
        children: [],
        remaining: [],
        pruned: false,
      };

      const result = findNodeByPath(root, []);
      expect(result).toBeNull();
    });

    it("should handle root node search", () => {
      // Test: Finding the root node itself
      const root: TreeNode = {
        id: 0,
        path: [0],
        remainingAssertions: [],
        children: [],
        remaining: [],
        pruned: false,
      };

      const result = findNodeByPath(root, [0]);
      expect(result).not.toBeNull();
      expect(result!.id).toBe(0);
    });
  });

  describe("isNodeExpanded", () => {
    it("should return true for node with children", () => {
      // Test: Node expansion state detection - node with children is expanded
      const expandedNode: TreeNode = {
        id: 0,
        path: [0],
        remainingAssertions: [],
        children: [
          {
            id: 1,
            path: [1, 0],
            remainingAssertions: [],
            children: [],
            remaining: [],
            pruned: false,
          },
        ],
        remaining: [1],
        pruned: false,
      };

      expect(isNodeExpanded(expandedNode)).toBe(true);
    });

    it("should return false for node without children", () => {
      // Test: Node with empty children array is not expanded
      const collapsedNode: TreeNode = {
        id: 0,
        path: [0],
        remainingAssertions: [],
        children: [],
        remaining: [1, 2],
        pruned: false,
      };

      expect(isNodeExpanded(collapsedNode)).toBe(false);
    });
  });

  describe("collapseTreeByNode", () => {
    it("should collapse target node by clearing its children", () => {
      // Test: Tree collapse algorithm - remove children from specified node
      const tree: TreeNode = {
        id: 0,
        path: [0],
        remainingAssertions: [],
        children: [
          {
            id: 1,
            path: [1, 0],
            remainingAssertions: [],
            children: [],
            remaining: [],
            pruned: false,
          },
        ],
        remaining: [1],
        pruned: false,
      };

      const result = collapseTreeByNode(tree, [1, 0]);
      const targetNode = findNodeByPath(result, [1, 0]);

      expect(targetNode).not.toBeNull();
      expect(targetNode!.children).toEqual([]);
    });

    it("should throw error for non-existent target path", () => {
      // Test: Error handling - attempting to collapse non-existent node
      const tree: TreeNode = {
        id: 0,
        path: [0],
        remainingAssertions: [],
        children: [],
        remaining: [1, 2],
        pruned: false,
      };

      expect(() => {
        collapseTreeByNode(tree, [5, 4, 3]);
      }).toThrow("Node with path [5,4,3] not found.");
    });
  });

  describe("expandTreeByNode", () => {
    const mockAssertionOk =
      require("../lib/explain/prettyprint_assertions_and_pictures").assertion_ok_elimination_order_suffix;
    const EffectEnum =
      require("../lib/explain/prettyprint_assertions_and_pictures").EffectOfAssertionOnEliminationOrderSuffix;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should expand node with remaining candidates when assertions are OK", () => {
      // Test: Tree expansion with assertion validation - create valid child nodes
      mockAssertionOk.mockReturnValue(EffectEnum.Ok);

      const tree: TreeNode = {
        id: 0,
        path: [0],
        remainingAssertions: [
          {
            type: "NEB",
            winner: 0,
            loser: 1,
            assertion_index: 1,
          },
        ],
        children: [],
        remaining: [1, 2], // Two candidates can be eliminated next
        pruned: false,
      };

      const result = expandTreeByNode(tree, [0]);
      const targetNode = findNodeByPath(result, [0]);

      expect(targetNode).not.toBeNull();
      expect(targetNode!.children).toHaveLength(2); // Should create child for each remaining candidate
      expect(targetNode!.children[0].id).toBe(1);
      expect(targetNode!.children[1].id).toBe(2);
    });

    it("should prune nodes when assertion returns contradiction", () => {
      // Test: Assertion-based pruning - contradicted paths marked as pruned
      mockAssertionOk.mockReturnValue(EffectEnum.Contradiction);

      const tree: TreeNode = {
        id: 0,
        path: [0],
        remainingAssertions: [
          {
            type: "NEB",
            winner: 0,
            loser: 1,
            assertion_index: 1,
          },
        ],
        children: [],
        remaining: [1],
        pruned: false,
      };

      const result = expandTreeByNode(tree, [0]);
      const targetNode = findNodeByPath(result, [0]);

      expect(targetNode!.children).toHaveLength(1);
      expect(targetNode!.children[0].pruned).toBe(true);
      expect(targetNode!.children[0].prunedBy).toBeDefined();
    });

    it("should handle empty remaining list", () => {
      // Test: Edge case - no candidates left to eliminate
      const tree: TreeNode = {
        id: 0,
        path: [0],
        remainingAssertions: [],
        children: [],
        remaining: [], // No remaining candidates
        pruned: false,
      };

      const result = expandTreeByNode(tree, [0]);
      const targetNode = findNodeByPath(result, [0]);

      expect(targetNode!.children).toHaveLength(0);
    });

    it("should handle NeedsMoreDetail assertion result", () => {
      // Test: Assertion requires more information - keep assertion for further evaluation
      mockAssertionOk.mockReturnValue(EffectEnum.NeedsMoreDetail);

      const tree: TreeNode = {
        id: 0,
        path: [0],
        remainingAssertions: [
          {
            type: "NEB",
            winner: 0,
            loser: 1,
            assertion_index: 1,
          },
        ],
        children: [],
        remaining: [1],
        pruned: false,
      };

      const result = expandTreeByNode(tree, [0]);
      const targetNode = findNodeByPath(result, [0]);

      expect(targetNode!.children).toHaveLength(1);
      expect(targetNode!.children[0].pruned).toBe(false);
      expect(targetNode!.children[0].remainingAssertions).toHaveLength(1); // Assertion preserved
    });
  });

  describe("createInitialTree", () => {
    it("should create initial tree with correct structure", () => {
      // Test: Tree initialization algorithm with assertions and candidates
      const assertions = [
        { type: "NEB", winner: 0, loser: 1, assertion_index: 1 },
        {
          type: "NEN",
          winner: 0,
          loser: 2,
          continuing: [0, 2],
          assertion_index: 2,
        },
      ];

      const tree = createInitialTree(0, 3, assertions);

      expect(tree.id).toBe(0);
      expect(tree.path).toEqual([0]); // Root path is just the winner
      expect(tree.remainingAssertions).toEqual(assertions);
      expect(tree.remaining).toEqual([1, 2]); // All candidates except winner
      expect(tree.children).toEqual([]); // Initially no children
      expect(tree.pruned).toBe(false);
    });

    it("should exclude root candidate from remaining list", () => {
      // Test: Root candidate not included in remaining candidates list
      const tree = createInitialTree(1, 4, []);

      expect(tree.id).toBe(1);
      expect(tree.remaining).toEqual([0, 2, 3]); // Excludes candidate 1 (root)
    });

    it("should handle single candidate scenario", () => {
      // Test: Edge case - only one candidate (automatic winner)
      const tree = createInitialTree(0, 1, []);

      expect(tree.id).toBe(0);
      expect(tree.remaining).toEqual([]); // No other candidates to eliminate
    });

    it("should handle empty assertions", () => {
      // Test: Tree creation with no assertions
      const tree = createInitialTree(0, 2, []);

      expect(tree.remainingAssertions).toEqual([]);
      expect(tree.remaining).toEqual([1]);
    });
  });

  describe("createTreeFromFile", () => {
    it("should create tree from valid JSON file content", () => {
      // Test: JSON parsing and tree creation from file format
      const fileContent = JSON.stringify({
        metadata: {
          candidates: ["Alice", "Bob", "Charlie"],
        },
        solution: {
          Ok: {
            winner: 0,
            assertions: [
              {
                assertion: {
                  type: "NEB",
                  winner: 0,
                  loser: 1,
                },
              },
            ],
          },
        },
      });

      const tree = createTreeFromFile(fileContent, 0);

      expect(tree.id).toBe(0);
      expect(tree.path).toEqual([0]);
      expect(tree.remaining).toEqual([1, 2]);
      expect(tree.remainingAssertions).toHaveLength(1);
      expect(tree.remainingAssertions[0].assertion_index).toBe(1); // Assertion index added
    });

    it("should throw error for invalid JSON", () => {
      // Test: Error handling for malformed JSON input
      const invalidJson = "{ invalid json structure }";

      expect(() => {
        createTreeFromFile(invalidJson, 0);
      }).toThrow("Invalid JSON file content");
    });

    it("should throw error for missing solution.Ok", () => {
      // Test: Error handling for missing solution data
      const fileContent = JSON.stringify({
        metadata: {
          candidates: ["Alice", "Bob"],
        },
        solution: {
          Err: "Some error",
        },
      });

      expect(() => {
        createTreeFromFile(fileContent, 0);
      }).toThrow("Missing solution.Ok in file");
    });

    it("should throw error for invalid candidates", () => {
      // Test: Error handling for malformed candidates data
      const fileContent = JSON.stringify({
        metadata: {
          candidates: "not an array",
        },
        solution: {
          Ok: {
            winner: 0,
            assertions: [],
          },
        },
      });

      expect(() => {
        createTreeFromFile(fileContent, 0);
      }).toThrow("Invalid metadata.candidates in file");
    });
  });
});
