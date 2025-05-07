// 该模块实现 lazy load 功能，用于扩展整棵淘汰顺序树中指定节点的一层。
// 外部调用时传入整棵树、目标节点的 id 以及完整的 Assertions 列表，
// 函数内部直接使用目标节点的 remaining 和 remainingAssertions 进行扩展，返回更新后的整棵树。

import {
  Assertion,
  EffectOfAssertionOnEliminationOrderSuffix,
  assertion_ok_elimination_order_suffix,
} from "../../../lib/explain/prettyprint_assertions_and_pictures";

/**
 * 定义树节点接口
 * 每个节点包含：
 *  - id：节点的唯一标识（一般用候选人索引作为 id）
 *  - path：从该节点到根节点的淘汰顺序（例如 [2,1] 表示候选人2在候选人1前被淘汰）
 *  - remainingAssertions：该分支上剩余可用的 Assertions
 *  - children：子节点数组
 *  - remaining：该节点尚未使用的候选人索引列表
 *  - pruned：是否被剪枝
 *  - prunedBy：剪枝时使用的断言（如果有）
 */
export interface TreeNode {
  id: number; // 节点唯一标识
  path: number[]; // 当前节点的淘汰顺序（从当前节点到根节点）
  remainingAssertions: Assertion[]; // 剩余可用的 Assertions
  children: TreeNode[]; // 子节点数组
  remaining: number[]; // 剩余未使用的候选人索引
  pruned: boolean; // 是否被剪枝
  prunedBy?: Assertion; // 剪枝时使用的断言（如果有）
}

function pathsEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

/**
 * 递归按 path 查找节点（path 唯一）
 * @param root   树根
 * @param target 完整淘汰顺序 path，例如 [3,1,0]
 */
export function findNodeByPath(
  root: TreeNode,
  path: number[],
): TreeNode | null {
  if (!path || path.length === 0) return null;

  // 检查根节点路径是否匹配
  if (pathsEqual(root.path, path)) return root;

  // 使用队列进行广度优先搜索
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const node = queue.shift()!;

    // 检查每个子节点
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
 * 检查节点是否已展开（有子节点）
 * @param node 要检查的节点
 * @returns 如果节点有子节点，则返回 true；否则返回 false
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

  // 直接清空子节点数组
  targetNode.children = [];

  return currentTree;
}

/**
 * 扩展指定节点的一层
 * 根据目标节点当前的 path、remaining 列表以及该节点自身的 remainingAssertions，
 * 对每个 remaining 中的候选人生成新的子节点，新子节点的 path 为 [candidate, ...目标节点.path]，
 * 同时更新新的 remaining（去除已使用的候选人）以及更新 remainingAssertions：
 *  - 如果断言返回 Ok，则认为该断言已满足，不保留；
 *  - 如果返回 NeedsMoreDetail，则保留该断言；
 *  - 如果返回 Contradiction，则标记该子节点为剪枝（pruned），并记录 prunedBy。
 *
 *
 * 根据目标节点的 path 扩展其下一层
 * @param currentTree   当前整棵树
 * @param targetPath    目标节点的 path（唯一标识）
 * @returns 更新后的整棵树
 */
export function expandTreeByNode(
  currentTree: TreeNode,
  targetPath: number[],
): TreeNode {
  const targetNode = findNodeByPath(currentTree, targetPath);
  if (!targetNode) {
    throw new Error(`Node with path [${targetPath.join(",")}] not found.`);
  }

  // 使用目标节点的 remaining 列表
  const remaining = targetNode.remaining;

  // 扩展目标节点：对 remaining 中的每个候选人生成新子节点
  targetNode.children = remaining.map((candidate) => {
    // 新的淘汰顺序：将 candidate 插入当前节点 path 的前面
    const newPath = [candidate, ...targetNode.path];
    // 新的 remaining：去除当前 candidate
    const newRemaining = targetNode.remaining.filter((c) => c !== candidate);
    // 更新 remainingAssertions：遍历目标节点的 remainingAssertions，
    // 如果断言对新 path 返回 Ok，则不保留；返回 NeedsMoreDetail，则保留；
    // 如果返回 Contradiction，则标记剪枝。
    const newRemainingAssertions: Assertion[] = [];
    let pruned = false;
    let prunedBy: Assertion | undefined = undefined;
    for (const assertion of targetNode.remainingAssertions) {
      const effect = assertion_ok_elimination_order_suffix(assertion, newPath);
      if (effect === EffectOfAssertionOnEliminationOrderSuffix.Contradiction) {
        pruned = true;
        prunedBy = assertion;
        break; // 一旦出现矛盾，停止检查
      } else if (
        effect === EffectOfAssertionOnEliminationOrderSuffix.NeedsMoreDetail
      ) {
        newRemainingAssertions.push(assertion);
      }
      // 如果返回 Ok，则该断言已满足，不保留
    }

    return {
      id: candidate, // 使用 candidate 索引作为节点 id
      path: newPath, // 新的淘汰顺序
      remainingAssertions: newRemainingAssertions, // 更新后的 Assertions
      children: [], // 初始无子节点
      remaining: newRemaining, // 更新后的 remaining 列表
      pruned, // 剪枝标记
      prunedBy, // 导致剪枝的断言（如果有）
    } as TreeNode;
  });

  return currentTree;
}

/**
 * 创建初始树
 * 输入：根候选人的索引、总候选人数以及完整的 Assertions 列表，
 * 初始化根节点的 remaining 为除根之外的所有候选人，并将完整的 Assertions 赋给根节点的 remainingAssertions。
 *
 * @param rootCandidate - 选择作为根节点的候选人索引
 * @param numCandidates - 总候选人数
 * @param assertions - 完整的 Assertions 列表
 * @returns 初始树
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
    remainingAssertions: assertions, // 初始时全部 Assertions 均可用
    children: [],
    remaining: remaining,
    pruned: false,
  };
}

/**
 * 从完整 JSON 文件内容直接创建初始树
 * 文件应包含：
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
    (a: any) => a.assertion,
  );
  return createInitialTree(rootCandidate, numCandidates, assertions);
}
