// This module implements a lazy loading mechanism to expand one layer of a given node in the elimination tree.
// The caller provides the full tree, the target node's ID (path), and a list of assertions.
// The function uses the node's `remaining` and `remainingAssertions` to generate its immediate children.

import {
  Assertion,
  EffectOfAssertionOnEliminationOrderSuffix,
  assertion_ok_elimination_order_suffix,
} from "../../../lib/explain/prettyprint_assertions_and_pictures";

/**
 * Interface for a tree node.
 * Each node contains:
 *  - id: unique identifier for the node (typically the candidate index)
 *  - path: elimination order from this node to the root (e.g., [2,1] means candidate 2 eliminated before 1)
 *  - remainingAssertions: list of remaining assertions applicable to this branch
 *  - children: array of child nodes
 *  - remaining: list of unused candidate indexes at this node
 *  - pruned: whether this node is pruned
 *  - prunedBy: the assertion that caused pruning (if any)
 */
export interface TreeNode {
  id: number; // Unique node identifier
  path: number[]; // Elimination path from current node to root
  remainingAssertions: Assertion[]; // Remaining assertions for this branch
  children: TreeNode[]; // Array of child nodes
  remaining: number[]; // Remaining candidate indexes not yet used
  pruned: boolean; // Whether the node is pruned
  prunedBy?: Assertion; // Assertion that caused pruning (if applicable)
}

function pathsEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

/**
 * Recursively search for a node by its path (path is unique).
 * @param root   Root of the tree
 * @param target Full elimination order path, e.g., [3,1,0]
 */
export function findNodeByPath(
  root: TreeNode,
  path: number[],
): TreeNode | null {
  if (!path || path.length === 0) return null;

  // Check if root path matches
  if (pathsEqual(root.path, path)) return root;

  // Perform breadth-first search using a queue
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const node = queue.shift()!;

    // Check each child node
    // If the child node's path matches the target path, return it
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        if (pathsEqual(child.path, path)) {
          return child;
        }
        queue.push(child);
      }
    }
  }

  return null;
}

/**
 * Check whether a node has been expanded (i.e., has children)
 * @param node Node to check
 * @returns True if node has children, otherwise false
 */
export function isNodeExpanded(node: TreeNode): boolean {
  return node.children && node.children.length > 0;
}

export function collapseTreeByNode(
  currentTree: TreeNode,
  targetPath: number[],
): TreeNode {
  const targetNode = findNodeByPath(currentTree, targetPath);
  if (!targetNode) {
    throw new Error(`Node with path [${targetPath.join(",")}] not found.`);
  }

  // Directly clear the child node array
  targetNode.children = [];

  return currentTree;
}

/**
 * Expand one layer of a specific node.
 * Based on the current node's path, remaining list, and its remainingAssertions,
 * for each candidate in remaining, generate a new child node.
 * Each new child node will have path = [candidate, ...parent.path],
 * updated remaining (removing used candidate), and updated remainingAssertions:
 *  - If assertion returns Ok → discard it;
 *  - If returns NeedsMoreDetail → keep it;
 *  - If returns Contradiction → mark the node as pruned and store prunedBy.
 *
 * @param currentTree   The full tree
 * @param targetPath    The path identifying the target node
 * @returns The updated full tree
 */
export function expandTreeByNode(
  currentTree: TreeNode,
  targetPath: number[],
): TreeNode {
  const targetNode = findNodeByPath(currentTree, targetPath);
  if (!targetNode) {
    throw new Error(`Node with path [${targetPath.join(",")}] not found.`);
  }

  // Use the remaining list of the target node
  const remaining = targetNode.remaining;

  // Expand the target node: for each candidate in remaining, generate a new child node
  targetNode.children = remaining.map((candidate) => {
    // New elimination path: insert candidate in front of current node's path
    const newPath = [candidate, ...targetNode.path];
    // New remaining list: remove current candidate
    const newRemaining = targetNode.remaining.filter((c) => c !== candidate);
    // Update remainingAssertions:
    // - If the assertion returns Ok → discard;
    // - If NeedsMoreDetail → keep;
    // - If Contradiction → mark as pruned.
    const newRemainingAssertions: Assertion[] = [];
    let pruned = false;
    let prunedBy: Assertion | undefined = undefined;
    for (const assertion of targetNode.remainingAssertions) {
      const effect = assertion_ok_elimination_order_suffix(assertion, newPath);
      if (effect === EffectOfAssertionOnEliminationOrderSuffix.Contradiction) {
        pruned = true;
        prunedBy = assertion;
        break; // Stop checking as soon as contradiction is found
      } else if (
        effect === EffectOfAssertionOnEliminationOrderSuffix.NeedsMoreDetail
      ) {
        newRemainingAssertions.push(assertion);
      }
      // If Ok, the assertion is fulfilled and not kept
    }

    return {
      id: candidate, // Use candidate index as node id
      path: newPath, // Updated elimination path
      remainingAssertions: newRemainingAssertions, // Updated assertions
      children: [], // Initially no children
      remaining: newRemaining, // Updated remaining list
      pruned, // Prune flag
      prunedBy, // Assertion that caused pruning (if any)
    } as TreeNode;
  });

  return currentTree;
}

/**
 * Create the initial tree.
 * Inputs: root candidate index, total number of candidates, and full list of assertions.
 * Initialize root node with all assertions and remaining candidates (excluding the root).
 *
 * @param rootCandidate - Index of the candidate to use as root
 * @param numCandidates - Total number of candidates
 * @param assertions - Full list of assertions
 * @returns Initial tree
 */
export function createInitialTree(
  rootCandidate: number,
  numCandidates: number,
  assertions: Assertion[],
): TreeNode {
  const remaining: number[] = [];
  for (let i = 0; i < numCandidates; i++) {
    if (i !== rootCandidate) {
      remaining.push(i);
    }
  }
  return {
    id: rootCandidate,
    path: [rootCandidate],
    remainingAssertions: assertions, // Initially, all assertions are usable
    children: [],
    remaining: remaining,
    pruned: false,
  };
}

/**
 * Create an initial tree directly from full JSON file content.
 * The JSON file should have the format:
 * {
 *   metadata: { candidates: string[] },
 *   solution: { Ok: { winner: number; assertions: { assertion: Assertion }[] } }
 * }
 */
export function createTreeFromFile(
  fileContent: string,
  rootId: number,
): TreeNode {
  let data: any;
  try {
    data = JSON.parse(fileContent);
  } catch {
    throw new Error("Invalid JSON file content");
  }

  const solution = data.solution?.Ok;
  if (!solution) {
    throw new Error("Missing solution.Ok in file");
  }

  const candidates = data.metadata?.candidates;
  if (!Array.isArray(candidates)) {
    throw new Error("Invalid metadata.candidates in file");
  }
  const numCandidates = candidates.length;

  const rootCandidate = rootId;
  if (typeof rootCandidate !== "number") {
    throw new Error("Invalid or missing winner index in solution");
  }
  const assertions: Assertion[] = solution.assertions.map(
    (a: any, idx: number) => ({
      assertion_index: idx + 1,
      ...a.assertion,
    }),
  );
  return createInitialTree(rootCandidate, numCandidates, assertions);
}
