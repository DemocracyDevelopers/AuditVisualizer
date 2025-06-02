export interface AssertionInternal {
  high: string;
  low: string;
  context: string[];
}

/**
 * Verify whether the winner of the report is completely determined by the set of assertions and return a rigorous elimination path.
 * Use state compression + memoization DFS, with a state space of 2^n, which is acceptable when n <= 20.
 * Under each state mask, try to apply all applicable assertions to eliminate a candidate and recursively check the sub-states.
 * And output each step's decision and state to the console.
 *
 * @param assertions
 * @param candidates
 * @param reportedWinner
 * @returns
 */
export function verifyWinnerByDP(
  assertions: AssertionInternal[],
  candidates: string[],
  reportedWinner: string,
): { winner: string; path: string[] } | null {
  const n = candidates.length;
  const winnerIndex = candidates.indexOf(reportedWinner);
  if (winnerIndex < 0) {
    return null;
  }
  const contextMasks = assertions.map((a, idx) => {
    let mask = 0;
    for (const name of a.context) {
      const i = candidates.indexOf(name);
      if (i >= 0) mask |= 1 << i;
    }

    return mask;
  });

  const fullMask = (1 << n) - 1;
  const winnerMask = 1 << winnerIndex;

  const dp = new Array<number>(1 << n).fill(-1);

  /**
   * Verify whether the given winner can be derived through a series of assertions.
   * This function uses DFS + memoization search (with state compression) to traverse all possible candidate elimination paths.
   * The purpose is to determine whether the given winner can be uniquely derived under the premise that all assertions are true.
   */

  function dfs(mask: number): boolean {
    if (dp[mask] !== -1) {
      return dp[mask] > 0;
    }
    if ((mask & winnerMask) === 0) {
      dp[mask] = 0;
      return false;
    }
    if (mask === winnerMask) {
      dp[mask] = 1;
      return true;
    }

    for (let i = 0; i < n; i++) {
      const bit = 1 << i;
      if (i === winnerIndex || (mask & bit) === 0) continue;

      for (let j = 0; j < assertions.length; j++) {
        const a = assertions[j];
        if (a.low !== candidates[i]) continue;
        const highIdx = candidates.indexOf(a.high);
        if ((mask & (1 << highIdx)) === 0) continue;
        if (contextMasks[j] !== fullMask && mask !== contextMasks[j]) continue;

        const nextMask = mask ^ bit;
        if (dfs(nextMask)) {
          dp[mask] = i + 1;
          return true;
        }
      }
    }

    dp[mask] = 0;
    return false;
  }

  if (!dfs(fullMask)) {
    return null;
  }

  // Rebuild elimination path
  const path: string[] = [];
  let mask = fullMask;
  while (mask !== winnerMask) {
    const elim = dp[mask] - 1;

    path.push(candidates[elim]);
    mask ^= 1 << elim;
  }
  return { winner: reportedWinner, path };
}
