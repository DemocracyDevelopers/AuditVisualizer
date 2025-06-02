"use strict";

// This file contains utility functions to show how a RAIRE assertion
// eliminates potential elimination sequence suffixes.

// Enumeration for the effects of an assertion on an elimination order suffix.
export enum EffectOfAssertionOnEliminationOrderSuffix {
  Contradiction = "Contradiction", // The suffix is ruled out by the assertion, regardless of the rest of the elimination order.
  Ok = "Ok", // The suffix is ok as far as the assertion is concerned, regardless of the rest of the elimination order.
  NeedsMoreDetail = "NeedsMoreDetail", // The suffix is ok as far as the assertion is concerned, but needs more detail.
}

/**
 * Interface representing an assertion.
 */
export interface Assertion {
  winner: number;
  loser: number;
  continuing?: number[];
  type: string;
  assertion_index: number;
}

export interface TreeNode {
  body: number | null;
  orderedChildren: TreeNode[];
  valid: boolean;
  assertion?: Assertion;
  height: number;
}
/**
 * This function determines whether the given elimination order suffix is compatible with the assertion.
 * Returns:
 * - Contradiction: The elimination order contradicts the assertion.
 * - Ok: The elimination order is consistent with the assertion.
 * - NeedsMoreDetail: The elimination order lacks sufficient information; it may need to be extended for further evaluation.
 * @param assertion - The assertion to check against.
 * @param elimination_order_suffix - A list of candidate indices, being a suffix of the elimination order, the last being the winner.
 * @returns An EffectOfAssertionOnEliminationOrderSuffix enum value.
 */
export function assertion_ok_elimination_order_suffix(
  assertion: Assertion,
  elimination_order_suffix: number[],
): EffectOfAssertionOnEliminationOrderSuffix {
  if (assertion.type === "NEN") {
    // Check that the suffix is compatible with the continuing candidates.
    for (
      let index = Math.max(
        0,
        elimination_order_suffix.length - (assertion.continuing?.length || 0),
      );
      index < elimination_order_suffix.length;
      index++
    ) {
      const candidate = elimination_order_suffix[index];
      if (!assertion.continuing?.includes(candidate)) {
        return EffectOfAssertionOnEliminationOrderSuffix.Ok; // The assertion does not say anything about this elimination order or any continuation of it.
      }
    }
    if (
      elimination_order_suffix.length >= (assertion.continuing?.length || 0)
    ) {
      // The whole elimination order is all present. The winner cannot be the first eliminated, as winner has more votes than loser at this point.
      if (
        elimination_order_suffix[
          elimination_order_suffix.length - (assertion.continuing?.length || 0)
        ] === assertion.winner
      ) {
        return EffectOfAssertionOnEliminationOrderSuffix.Contradiction;
      } else {
        return EffectOfAssertionOnEliminationOrderSuffix.Ok;
      }
    } else {
      if (elimination_order_suffix.includes(assertion.winner)) {
        // Winner wasn't the first eliminated.
        return EffectOfAssertionOnEliminationOrderSuffix.Ok;
      } else {
        return EffectOfAssertionOnEliminationOrderSuffix.NeedsMoreDetail;
      }
    }
  } else {
    // NEB
    for (let index = elimination_order_suffix.length - 1; index >= 0; index--) {
      // Look at candidates in reverse order of elimination order, that is, winner first.
      const candidate = elimination_order_suffix[index];
      if (candidate === assertion.winner) {
        return EffectOfAssertionOnEliminationOrderSuffix.Ok; // Winner goes better than loser, no problems.
      } else if (candidate === assertion.loser) {
        return EffectOfAssertionOnEliminationOrderSuffix.Contradiction; // Loser goes better than winner, contradiction.
      }
    }
    return EffectOfAssertionOnEliminationOrderSuffix.NeedsMoreDetail; // Haven't seen the winner or loser yet.
  }
}

/**
 * Given an elimination order suffix:
 * - Let it through if it is allowed.
 * - Block if it is contradicted.
 * - Expand if it is not enough information.
 * @param assertion - The assertion to check against.
 * @param elimination_order_suffix - A list of candidate indices, being a suffix of the elimination order, the last being the winner.
 * @param num_candidates - The number of candidates. Candidate numbers are 0..num_candidates-1 inclusive.
 * @param just_get_enough_info - If true, don't eliminate any contradicted entries; just expand any ambiguous entries.
 * @returns A list of possible elimination order suffixes.
 */
export function assertion_allowed_suffixes(
  assertion: Assertion,
  elimination_order_suffix: number[],
  num_candidates: number,
  just_get_enough_info: boolean,
): number[][] {
  const effect = assertion_ok_elimination_order_suffix(
    assertion,
    elimination_order_suffix,
  );
  // If effect is Contradiction, the current elimination order contradicts the assertion.
  if (effect === EffectOfAssertionOnEliminationOrderSuffix.Contradiction) {
    if (just_get_enough_info) return [elimination_order_suffix];
    else return [];
  }
  // If the current elimination order is consistent with the assertion, return it as valid.
  else if (effect === EffectOfAssertionOnEliminationOrderSuffix.Ok) {
    return [elimination_order_suffix];
  } else {
    // Must need more information. Extend the suffixes.
    let res: number[][] = [];
    // Iterate over all candidates, adding those not already in the elimination order suffix.
    for (let candidate = 0; candidate < num_candidates; candidate++) {
      if (!elimination_order_suffix.includes(candidate)) {
        const v = [candidate, ...elimination_order_suffix];
        // Recursively check the new elimination order.
        const extras = assertion_allowed_suffixes(
          assertion,
          v,
          num_candidates,
          just_get_enough_info,
        );
        res.push(...extras);
      }
    }
    return res;
  }
}

/**
 * Like assertion_allowed_suffixes, but processes a list of elimination order suffixes.
 * @param assertion - The assertion to check against.
 * @param elimination_order_suffixes - A list of elimination order suffixes.
 * @param num_candidates - The number of candidates. Candidate numbers are 0..num_candidates-1 inclusive.
 * @param just_get_enough_info - If true, don't eliminate any contradicted entries; just expand any ambiguous entries.
 * @returns A list of possible elimination order suffixes.
 */
export function assertion_all_allowed_suffixes(
  assertion: Assertion,
  elimination_order_suffixes: number[][],
  num_candidates: number,
  just_get_enough_info: boolean,
): number[][] {
  let res: number[][] = [];
  for (const elimination_order_suffix of elimination_order_suffixes) {
    const allowed = assertion_allowed_suffixes(
      assertion,
      elimination_order_suffix,
      num_candidates,
      just_get_enough_info,
    );
    res.push(...allowed);
  }
  return res;
}

/**
 * Get all possible full-length elimination orders (num_candidates factorial).
 * @param num_candidates - The number of candidates.
 * @returns A list of all possible full-length elimination orders.
 */
export function all_elimination_orders(num_candidates: number): number[][] {
  if (num_candidates === 0) {
    return [[]];
  }
  let res: number[][] = [];
  const candidate = num_candidates - 1;
  const rest_orders = all_elimination_orders(num_candidates - 1);
  for (const rest of rest_orders) {
    // Put candidate in every possible place.
    for (let i = 0; i < num_candidates; i++) {
      const new_order = [...rest.slice(0, i), candidate, ...rest.slice(i)];
      res.push(new_order);
    }
  }
  return res;
}

/**
 * Get all possible single-candidate prefixes of an elimination order.
 * @param num_candidates - The number of candidates.
 * @returns A list of all possible single-candidate elimination order suffixes.
 */
export function all_elimination_order_suffixes(
  num_candidates: number,
): number[][] {
  let res: number[][] = [];
  for (let i = 0; i < num_candidates; i++) {
    res.push([i]);
  }
  return res;
}

/**
 * A text description of an assertion.
 * @param assertion - The assertion to describe.
 * @param candidate_names - A list of the candidate names.
 * @returns A text description of the assertion.
 */
export function assertion_description(
  assertion: Assertion,
  candidate_names: string[],
): string {
  const basic = `${candidate_names[assertion.winner]} beats ${candidate_names[assertion.loser]}`;
  if (assertion.type === "NEB") {
    return `${basic} always`;
  } else {
    return `${basic} if only {${assertion.continuing?.map((i) => candidate_names[i]).join(",")}} remain`;
  }
}

/**
 * Represents a node in an elimination tree.
 */
export class EliminationTreeNode implements TreeNode {
  body: number | null;
  children: { [key: number]: EliminationTreeNode };
  valid: boolean;
  assertion?: Assertion;

  /**
   * Make a new tree node representing a candidate.
   * @param body - The candidate index or null for root.
   */
  constructor(body: number | null) {
    this.body = body;
    this.children = {};
    this.valid = false;
  }

  /**
   * Add a partial elimination order, last being the highest eliminated after this body to the tree.
   * @param partial_elimination_order - The partial elimination order to add.
   */
  addPath(partial_elimination_order: number[]): void {
    if (partial_elimination_order.length === 0) return;
    const last =
      partial_elimination_order[partial_elimination_order.length - 1];
    const remaining = partial_elimination_order.slice(
      0,
      partial_elimination_order.length - 1,
    );
    if (!this.children.hasOwnProperty(last))
      this.children[last] = new EliminationTreeNode(last);
    this.children[last].addPath(remaining);
  }

  /**
   * Annotate an existing path to be "valid".
   * @param partial_elimination_order - The partial elimination order to mark as valid.
   */
  validPath(partial_elimination_order: number[]): void {
    this.valid = true;
    if (partial_elimination_order.length === 0) return;
    const last =
      partial_elimination_order[partial_elimination_order.length - 1];
    const remaining = partial_elimination_order.slice(
      0,
      partial_elimination_order.length - 1,
    );
    if (!this.children.hasOwnProperty(last))
      this.children[last] = new EliminationTreeNode(last);
    this.children[last].validPath(remaining);
  }

  /**
   * Get the children of this node, ordered by candidate index.
   * @returns An array of child nodes.
   */
  get orderedChildren(): EliminationTreeNode[] {
    let res = Object.values(this.children);
    res.sort((a, b) => a.body! - b.body!);
    return res;
  }

  /**
   * The maximum height of the tree, in number of nodes.
   * @returns The height of the tree.
   */
  get height(): number {
    let max_child_height = 0;
    for (const c of Object.values(this.children)) {
      max_child_height = Math.max(max_child_height, c.height);
    }
    return 1 + max_child_height;
  }
}

// Global variable to collect images for saving.
export let allImages: { svg: SVGSVGElement; name: string }[] = [];

/**
 * Get a list of all the trees (one for each possible winning candidate).
 * @param elimination_orders - A list of still valid elimination orders.
 * @param after_applying_assertion_elimination_orders - A list of still valid elimination orders after the next assertion.
 * @returns An array of EliminationTreeNode instances.
 */
export function make_trees(
  elimination_orders: number[][],
  after_applying_assertion_elimination_orders?: number[][],
): EliminationTreeNode[] {
  const root = new EliminationTreeNode(null);
  for (const elimination_order of elimination_orders) {
    root.addPath(elimination_order);
  }
  const valid_orders = Array.isArray(
    after_applying_assertion_elimination_orders,
  )
    ? after_applying_assertion_elimination_orders
    : elimination_orders;
  for (const elimination_order of valid_orders) {
    root.validPath(elimination_order);
  }
  return root.orderedChildren!;
}

/**
 * Make a human-readable explanation of what the assertions imply.
 * @param div - The DOM element where things should be inserted.
 * @param assertions - The list of assertions. We will add an "assertion_index" field to each if it is not already there.
 * @param candidate_names - A list of the candidate names.
 * @param expand_fully_at_start - If true, expand all num_candidates factorial paths. If false, use minimal elimination order suffixes where possible.
 * @param hide_winner - If true, don't draw trees that imply the winner won.
 * @param winner_id - 0-based index indicating who the winner is. Only used if hide_winner is true.
 */
export function explain(
  assertions: Assertion[],
  candidateNames: string[],
  expandFullyAtStart: boolean,
  hideWinner: boolean,
  winnerId: number,
): any[] {
  const numCandidates = candidateNames.length;
  const multiWinner: any[] = [];

  // For each possible winner
  for (let candidate = 0; candidate < numCandidates; candidate++) {
    if (hideWinner && candidate === winnerId) continue;

    let eliminationOrders = expandFullyAtStart
      ? all_elimination_orders(numCandidates)
      : all_elimination_order_suffixes(numCandidates);

    // Filter elimination orders where the winner is not the current candidate
    eliminationOrders = eliminationOrders.filter(
      (order) => order[order.length - 1] === candidate,
    );

    if (eliminationOrders.length === 0) continue; // Skip if no elimination orders

    const stepByStep = {
      type: "step-by-step",
      process: [] as any[],
    };

    // Initial state (step 0)
    const initialTree = buildEliminationTree(eliminationOrders, candidateNames);

    stepByStep.process.push({
      step: 0,
      trees: initialTree,
    });

    // Apply assertions step by step
    let currentEliminationOrders = eliminationOrders;

    for (let stepIndex = 0; stepIndex < assertions.length; stepIndex++) {
      const assertion = assertions[stepIndex];
      const assertionText = assertion_description(assertion, candidateNames);

      // Collect before applying assertion
      const beforeTree = buildEliminationTree(
        currentEliminationOrders,
        candidateNames,
      );

      // Apply the assertion
      const eliminationOrdersAfter = assertion_all_allowed_suffixes(
        assertion,
        currentEliminationOrders,
        numCandidates,
        false,
      );

      // Collect after applying assertion
      const afterTree = buildEliminationTree(
        eliminationOrdersAfter,
        candidateNames,
      );

      // Compare before and after trees
      const treeUnchanged = areTreesEqual(beforeTree, afterTree);

      // Add to process
      stepByStep.process.push({
        step: stepIndex + 1,
        assertion: {
          index: stepIndex,
          content: assertionText,
        },
        before: beforeTree,
        after: afterTree,
        treeUnchanged, // true if the tree is unchanged after applying the assertion
      });

      // Update current elimination orders
      currentEliminationOrders = eliminationOrdersAfter;

      if (currentEliminationOrders.length === 0) break; // No more orders left
    }

    // Add to multiWinner
    multiWinner.push({
      winnerInfo: {
        id: candidate,
        name: candidateNames[candidate],
      },
      data: stepByStep,
    });
  }

  return multiWinner;
}

function buildEliminationTree(
  eliminationOrders: number[][],
  candidateNames: string[],
): any {
  // Map to store nodes by their candidate ID for reuse
  const nodeMap = new Map<number, any>();

  // Create root nodes for each winner
  const trees: any = {};

  for (const order of eliminationOrders) {
    const winnerId = order[order.length - 1];
    if (!trees[winnerId]) {
      trees[winnerId] = {
        id: winnerId,
        name: candidateNames[winnerId],
        children: [],
      };
      nodeMap.set(winnerId, trees[winnerId]);
    }

    let currentNode = trees[winnerId];

    // Build the path from winner to first eliminated candidate
    for (let i = order.length - 2; i >= 0; i--) {
      const candidateId = order[i];

      // Check if this child already exists
      let childNode = currentNode.children.find(
        (child: any) => child.id === candidateId,
      );

      if (!childNode) {
        // Create a new node
        childNode = {
          id: candidateId,
          name: candidateNames[candidateId],
          children: [],
        };
        currentNode.children.push(childNode);
        nodeMap.set(candidateId, childNode);
      }

      currentNode = childNode;
    }
  }

  // Return the tree for the winner
  return Object.values(trees)[0];
}

/**
 * Describe the RAIRE result and generate explanations.
 * @param output_div - The DOM element where output messages should be inserted.
 * @param explanation_div - The DOM element where explanations should be inserted.
 * @param data - The data containing the RAIRE result.
 */
export function describe_raire_result(
  output_div: HTMLElement,
  explanation_div: HTMLElement,
  data: any,
): void {
  // Helper functions to get candidate names.
  function candidate_name(id: number): string {
    if (data.metadata && Array.isArray(data.metadata.candidates)) {
      const name = data.metadata.candidates[id];
      if (name) {
        return name;
      }
    }
    return `Candidate ${id}`;
  }

  function candidate_name_list(ids: number[]): string {
    return ids.map(candidate_name).join(",");
  }
  // Check if the input format is recognized.
  if (data.solution && data.solution.Ok) {
    // Output assertions with their details.
    let heading_name = "Assertions";
    if (data.metadata.hasOwnProperty("contest"))
      heading_name += ` for ${data.metadata.contest}`;
    if (data.solution.Ok.hasOwnProperty("difficulty"))
      heading_name += ` - difficulty = ${data.solution.Ok.difficulty}`;
    if (data.solution.Ok.hasOwnProperty("margin"))
      heading_name += ` margin = ${data.solution.Ok.margin}`;
    const assertionRisks = data.metadata && data.metadata.assertionRisks;
    const riskLimit = data.metadata && data.metadata.riskLimit;
    let assertionIndex = 0;
    for (const av of data.solution.Ok.assertions) {
      const risk =
        av.hasOwnProperty("status") && av.status.hasOwnProperty("risk")
          ? av.status.risk
          : Array.isArray(assertionRisks) &&
              assertionRisks.length > assertionIndex
            ? assertionRisks[assertionIndex]
            : null;
      if (typeof risk === "number") {
        const isGood =
          typeof riskLimit === "number"
            ? risk <= riskLimit
              ? "risk_ok"
              : "risk_bad"
            : "risk";
      }
      assertionIndex++;
    }
    // Prepare candidate names and options for the explanation.
    let candidate_names = data.metadata && data.metadata.candidates;
    if (!Array.isArray(candidate_names)) candidate_names = [];
    for (
      let i = candidate_names.length;
      i < data.solution.Ok.num_candidates;
      i++
    ) {
      candidate_names.push(`Candidate ${i}`);
    }
    const hide_winner_checkbox = document.getElementById(
      "HideWinner",
    ) as HTMLInputElement;
    const hide_winner = hide_winner_checkbox.checked;
    const winner_id = data.solution.Ok.winner;
    const assertions = data.solution.Ok.assertions.map((a: any) => a.assertion);

    // Call the explain function.
    explain(
      assertions,
      candidate_names,
      (document.getElementById("ExpandAtStart") as HTMLInputElement).checked,
      (document.getElementById("DrawAsText") as HTMLInputElement).checked,
      winner_id,
    );
  } else if (data.solution && data.solution.Err) {
    const err = data.solution.Err;
  }
}

/**
 * Outputs the elimination orders into the given `<div>` as numbered lists.
 * @param div - The DOM element where things should be inserted.
 * @param elimination_orders - A list of elimination orders.
 * @param candidate_names - A list of the candidate names.
 * @param title - A title to display above the elimination orders.
 */
export function output_elimination_orders(
  div: HTMLElement,
  elimination_orders: number[][],
  candidate_names: string[],
  title: string,
): void {}

function areTreesEqual(tree1: any, tree2: any): boolean {
  if (!tree1 || !tree2) return false;
  if (tree1.id !== tree2.id) return false;

  const children1 = tree1.children || [];
  const children2 = tree2.children || [];

  if (children1.length !== children2.length) return false;

  // Compare all children recursively
  for (let i = 0; i < children1.length; i++) {
    if (!areTreesEqual(children1[i], children2[i])) return false;
  }

  return true;
}
