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
      const root: TreeNode = {
        id: 0,
        path: [0],
        remainingAssertions: [],
        children: [
          {
            id: 1,
            path: [1, 0],
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
        remaining: [1, 2],
        pruned: false,
      };

      const result = expandTreeByNode(tree, [0]);
      const targetNode = findNodeByPath(result, [0]);

      expect(targetNode).not.toBeNull();
      expect(targetNode!.children).toHaveLength(2);
      expect(targetNode!.children[0].id).toBe(1);
      expect(targetNode!.children[1].id).toBe(2);
    });

    it("should prune nodes when assertion returns contradiction", () => {
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
      const tree: TreeNode = {
        id: 0,
        path: [0],
        remainingAssertions: [],
        children: [],
        remaining: [],
        pruned: false,
      };

      const result = expandTreeByNode(tree, [0]);
      const targetNode = findNodeByPath(result, [0]);

      expect(targetNode!.children).toHaveLength(0);
    });

    it("should handle NeedsMoreDetail assertion result", () => {
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
      expect(targetNode!.children[0].remainingAssertions).toHaveLength(1);
    });
  });

  describe("createInitialTree", () => {
    it("should create initial tree with correct structure", () => {
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
      expect(tree.path).toEqual([0]);
      expect(tree.remainingAssertions).toEqual(assertions);
      expect(tree.remaining).toEqual([1, 2]);
      expect(tree.children).toEqual([]);
      expect(tree.pruned).toBe(false);
    });

    it("should exclude root candidate from remaining list", () => {
      const tree = createInitialTree(1, 4, []);

      expect(tree.id).toBe(1);
      expect(tree.remaining).toEqual([0, 2, 3]);
    });

    it("should handle single candidate scenario", () => {
      const tree = createInitialTree(0, 1, []);

      expect(tree.id).toBe(0);
      expect(tree.remaining).toEqual([]);
    });

    it("should handle empty assertions", () => {
      const tree = createInitialTree(0, 2, []);

      expect(tree.remainingAssertions).toEqual([]);
      expect(tree.remaining).toEqual([1]);
    });
  });

  describe("createTreeFromFile", () => {
    it("should create tree from valid JSON file content", () => {
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
      expect(tree.remainingAssertions[0].assertion_index).toBe(1);
    });

    it("should throw error for invalid JSON", () => {
      const invalidJson = "{ invalid json structure }";

      expect(() => {
        createTreeFromFile(invalidJson, 0);
      }).toThrow("Invalid JSON file content");
    });

    it("should throw error for missing solution.Ok", () => {
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
