"use strict";

export interface AssertionInternal {
  /** 高票候选人（胜者） */
  high: string;
  /** 低票候选人（败者） */
  low: string;
  /** 断言上下文：对于 NEN，仅在剩余候选人与此列表完全一致时适用 */
  context: string[];
}

/**
 * 验证报告的赢家是否由断言集完全决定，并返回一条严谨的淘汰路径。
 * 使用状态压缩 + 记忆化 DFS，状态空间为 2^n，n <= 20 时性能可接受。
 * 在每个状态 mask 下，尝试应用所有适用断言淘汰一个候选人，递归检查子状态。
 * 并在控制台输出每一步的决策和状态。
 *
 * @param assertions 断言列表
 * @param candidates 候选人名字数组（顺序决定掩码位）
 * @param reportedWinner 报告的冠军名字
 * @returns 若验证通过，返回 { winner, path }，其中 path 为按淘汰顺序的名字；否则返回 null。
 */
export function verifyWinnerByDP(
  assertions: AssertionInternal[],
  candidates: string[],
  reportedWinner: string,
): { winner: string; path: string[] } | null {
  const n = candidates.length;
  console.log("候选人列表:", candidates);
  const winnerIndex = candidates.indexOf(reportedWinner);
  if (winnerIndex < 0) {
    console.error(`找不到报告的赢家：${reportedWinner}`);
    return null;
  }
  console.log(`报告赢家 ${reportedWinner} 的索引: ${winnerIndex}`);

  // 预处理：将每条断言的 context 转为掩码
  const contextMasks = assertions.map((a, idx) => {
    let mask = 0;
    for (const name of a.context) {
      const i = candidates.indexOf(name);
      if (i >= 0) mask |= 1 << i;
    }
    console.log(
      `断言 ${idx}: [${a.high} > ${a.low}] 上下文掩码: ${mask.toString(2).padStart(n, "0")}`,
    );
    return mask;
  });

  const fullMask = (1 << n) - 1;
  const winnerMask = 1 << winnerIndex;
  console.log(
    `初始状态掩码: ${fullMask.toString(2).padStart(n, "0")} (所有候选人在场)`,
  );

  // dp[mask] = -1 未访问, 0 = false, >0 表示淘汰的候选人索引+1
  const dp = new Array<number>(1 << n).fill(-1);

  /**
   * 判断当前 mask 是否能通过断言淘汰到只剩赢家
   */
  function dfs(mask: number): boolean {
    console.log(`进入状态 mask=${mask.toString(2).padStart(n, "0")}`);
    if (dp[mask] !== -1) {
      console.log(`  dp[${mask}] 已记录 = ${dp[mask]}`);
      return dp[mask] > 0;
    }
    // 如果当前状态不包含赢家
    if ((mask & winnerMask) === 0) {
      console.warn(`  状态不包含赢家，失败`);
      dp[mask] = 0;
      return false;
    }
    // 如果只剩赢家
    if (mask === winnerMask) {
      console.info(`  只剩赢家: ${reportedWinner}`);
      dp[mask] = 1; // 标记成功
      return true;
    }

    // 尝试淘汰每个非赢家候选人
    for (let i = 0; i < n; i++) {
      const bit = 1 << i;
      if (i === winnerIndex || (mask & bit) === 0) continue;
      console.log(
        `  尝试淘汰候选人 ${candidates[i]} (bit ${bit.toString(2).padStart(n, "0")})`,
      );

      // 在所有断言中寻找针对 i 的断言
      for (let j = 0; j < assertions.length; j++) {
        const a = assertions[j];
        if (a.low !== candidates[i]) continue;
        const highIdx = candidates.indexOf(a.high);
        // 断言适用条件：mask 包含 high、包含 low，且符合 context 掩码要求
        if ((mask & (1 << highIdx)) === 0) continue;
        if (contextMasks[j] !== fullMask && mask !== contextMasks[j]) continue;

        console.log(`    应用断言 ${j}: ${a.high} > ${a.low}`);
        const nextMask = mask ^ bit;
        console.log(
          `    生成子状态 mask=${nextMask.toString(2).padStart(n, "0")}`,
        );

        if (dfs(nextMask)) {
          console.log(`  状态 ${mask.toString(2)} 可淘汰 ${a.low}`);
          dp[mask] = i + 1; // 记录淘汰的 i
          return true;
        }
      }
    }

    console.warn(`  状态 ${mask.toString(2)} 无法淘汰至赢家`);
    dp[mask] = 0;
    return false;
  }

  if (!dfs(fullMask)) {
    console.error("验证失败：无法根据断言保证赢家");
    return null;
  }

  // 重建淘汰路径
  const path: string[] = [];
  let mask = fullMask;
  while (mask !== winnerMask) {
    const elim = dp[mask] - 1; // 存储时 +1
    console.log(
      `重建路径：在 mask ${mask.toString(2).padStart(n, "0")} 淘汰 ${candidates[elim]}`,
    );
    path.push(candidates[elim]);
    mask ^= 1 << elim;
  }
  console.info(`最终赢家验证通过: ${reportedWinner}`);
  return { winner: reportedWinner, path };
}
