// test/lazy_explain.test.ts

import {
    createInitialTree,
expandTreeByNode,
TreeNode,
} from "../app/explain-assertions/components/lazy_explain";
import {
Assertion,
EffectOfAssertionOnEliminationOrderSuffix,
} from "../lib/explain/prettyprint_assertions_and_pictures";

// Mock the module and specifically the assertion_ok_elimination_order_suffix function
jest.mock("../lib/explain/prettyprint_assertions_and_pictures", () => {
  const originalModule = jest.requireActual("../lib/explain/prettyprint_assertions_and_pictures");
  return {
    __esModule: true,
    ...originalModule,
    assertion_ok_elimination_order_suffix: jest.fn((assertion: Assertion, eliminationOrder: number[]) => {
      return originalModule.EffectOfAssertionOnEliminationOrderSuffix.Ok;
    }),
  };
});

describe("expandTreeByNode - simple tests", () => {
  test("should expand the root node and add children correctly", () => {
    const numCandidates = 4;
    let tree: TreeNode = createInitialTree(0);
    const dummyAssertion: Assertion = { type: "NEB", winner: 0, loser: 1 } as Assertion;
    const assertions: Assertion[] = [dummyAssertion];

    tree = expandTreeByNode(assertions, tree, 0, numCandidates);
    expect(tree.children.length).toBe(3);
    const childIds = tree.children.map(child => child.id).sort();
    expect(childIds).toEqual([1, 2, 3]);
    tree.children.forEach(child => {
      expect(child.path).toEqual([child.id, 0]);
    });
  });

  test("should throw an error if the target node is not found", () => {
    const numCandidates = 4;
    const tree: TreeNode = createInitialTree(0);
    const dummyAssertion: Assertion = { type: "NEB", winner: 0, loser: 1 } as Assertion;
    const assertions: Assertion[] = [dummyAssertion];
    expect(() => {
      expandTreeByNode(assertions, tree, 99, numCandidates);
    }).toThrow();
  });
});

describe("expandTreeByNode - extended tests", () => {
  test("should mark a branch as NeedsMoreDetail when assertion returns NeedsMoreDetail", () => {
    const { assertion_ok_elimination_order_suffix } = require("../lib/explain/prettyprint_assertions_and_pictures");
    // Set up the mock to return NeedsMoreDetail when candidate 2 is expanded
    (assertion_ok_elimination_order_suffix as jest.Mock).mockImplementationOnce(
      (assertion: Assertion, eliminationOrder: number[]) => {
        if (eliminationOrder[0] === 2) {
          return EffectOfAssertionOnEliminationOrderSuffix.NeedsMoreDetail;
        }
        return EffectOfAssertionOnEliminationOrderSuffix.Ok;
      }
    );

    const numCandidates = 4;
    let tree: TreeNode = createInitialTree(0);
    const dummyAssertion: Assertion = { type: "NEB", winner: 0, loser: 1 } as Assertion;
    const assertions: Assertion[] = [dummyAssertion];
    tree = expandTreeByNode(assertions, tree, 0, numCandidates);
    const candidate2Node = tree.children.find(child => child.id === 2);
    expect(candidate2Node).toBeDefined();
    expect(candidate2Node?.path).toEqual([2, 0]);
  });

  test("should mark a branch as Contradiction when assertion returns Contradiction", () => {
    const { assertion_ok_elimination_order_suffix } = require("../lib/explain/prettyprint_assertions_and_pictures");
    // Set up the mock to return Contradiction when candidate 3 is expanded
    (assertion_ok_elimination_order_suffix as jest.Mock).mockImplementationOnce(
      (assertion: Assertion, eliminationOrder: number[]) => {
        if (eliminationOrder[0] === 3) {
          return EffectOfAssertionOnEliminationOrderSuffix.Contradiction;
        }
        return EffectOfAssertionOnEliminationOrderSuffix.Ok;
      }
    );

    const numCandidates = 4;
    let tree: TreeNode = createInitialTree(0);
    const dummyAssertion: Assertion = { type: "NEB", winner: 0, loser: 1 } as Assertion;
    const assertions: Assertion[] = [dummyAssertion];
    tree = expandTreeByNode(assertions, tree, 0, numCandidates);
    const candidate3Node = tree.children.find(child => child.id === 3);
    expect(candidate3Node).toBeDefined();
    expect(candidate3Node?.path).toEqual([3, 0]);
  });

  test("should expand a non-root node correctly", () => {
    const numCandidates = 4;
    let tree: TreeNode = createInitialTree(0);
    const assertions: Assertion[] = [{ type: "NEB", winner: 0, loser: 1 } as Assertion];
    tree = expandTreeByNode(assertions, tree, 0, numCandidates);
    tree = expandTreeByNode(assertions, tree, 1, numCandidates);
    const node1 = tree.children.find(child => child.id === 1);
    expect(node1).toBeDefined();
    if (node1) {
      expect(node1.path).toEqual([1, 0]);
      expect(node1.children.length).toBe(2);
      const childIds = node1.children.map(child => child.id).sort();
      expect(childIds).toEqual([2, 3]);
      node1.children.forEach(child => {
        expect(child.path).toEqual([child.id, 1, 0]);
      });
    }
  });
});
