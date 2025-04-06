// This module provides lazy-load functionality to expand a specified node in the elimination tree.
// It exposes a function that takes the complete assertions, the current tree, and the target node's id,
// and returns the updated tree after expanding that node by one layer.

import {
  Assertion,
  EffectOfAssertionOnEliminationOrderSuffix,
  assertion_ok_elimination_order_suffix,
} from "../../../lib/explain/prettyprint_assertions_and_pictures";

/**
 * Interface representing a tree node in the elimination tree.
 */
export interface TreeNode {
  id: number; // Unique identifier for the node.
  path: number[]; // The elimination order from this node up to the root.
  remainingAssertions: Assertion[]; // The assertions still applicable on this branch.
  children: TreeNode[]; // Child nodes.
}

/**
 * Helper function to recursively find a node in the tree by its id.
 *
 * @param root - The root of the tree.
 * @param targetId - The id of the node to find.
 * @returns The found TreeNode or null if not found.
 */
function findNode(root: TreeNode, targetId: number): TreeNode | null {
  if (root.id === targetId) return root;
  for (const child of root.children) {
    const found = findNode(child, targetId);
    if (found) return found;
  }
  return null;
}

/**
 * Function to expand a specified node by one layer.
 * It calculates the next layer of children for the target node based on its current path
 * and the complete assertions list.
 *
 * @param assertions - The complete list of assertions.
 * @param currentTree - The current elimination tree.
 * @param targetNodeId - The id of the node to expand.
 * @param numCandidates - Total number of candidates.
 * @returns The updated tree with the target node expanded.
 */
export function expandTreeByNode(
  assertions: Assertion[],
  currentTree: TreeNode,
  targetNodeId: number,
  numCandidates: number
): TreeNode {
  // Locate the target node in the current tree.
  const targetNode = findNode(currentTree, targetNodeId);
  if (!targetNode) {
    throw new Error(`Node with id ${targetNodeId} not found in the tree.`);
  }

  // Determine which candidates have been used in the current node's path.
  const usedCandidates = new Set(targetNode.path);
  const remaining: number[] = [];
  for (let i = 0; i < numCandidates; i++) {
    if (!usedCandidates.has(i)) {
      remaining.push(i);
    }
  }

  // Expand the target node: for each candidate in the remaining list,
  // create a new child node by inserting the candidate at the front of the current node's path.
  targetNode.children = remaining.map((candidate) => {
    const newPath = [candidate, ...targetNode.path];
    // Optionally, you can filter or update remainingAssertions based on newPath.
    // Here we simply pass the full assertions list.
    // Check the new path against assertions to mark status if needed.
    let status: "Ok" | "Contradiction" | "NeedsMoreDetail" = "Ok";
    for (const assertion of assertions) {
      const effect = assertion_ok_elimination_order_suffix(assertion, newPath);
      if (effect === EffectOfAssertionOnEliminationOrderSuffix.Contradiction) {
        status = "Contradiction";
        break;
      } else if (effect === EffectOfAssertionOnEliminationOrderSuffix.NeedsMoreDetail) {
        status = "NeedsMoreDetail";
      }
    }
    // Create a new child node.
    return {
      id: candidate, // For simplicity, using candidate index as id; you may generate a unique id if needed.
      path: newPath,
      remainingAssertions: assertions, // You may update this field if required.
      children: [],
    } as TreeNode;
  });

  return currentTree;
}

/**
 * Example function to create an initial tree with a chosen root candidate.
 *
 * @param rootCandidate - The candidate index chosen as root.
 * @returns The initial tree.
 */
export function createInitialTree(rootCandidate: number): TreeNode {
  return {
    id: rootCandidate,
    path: [rootCandidate],
    remainingAssertions: [], // Can be set to the full assertions list if needed.
    children: [],
  };
}

export default expandTreeByNode;
