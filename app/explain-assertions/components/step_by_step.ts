// step_by_step.tsx
// 该模块实现 step-by-step lazy load 功能。
//
// 输入：
//   - tree：当前整棵淘汰树（初始时前端传入的数据为只有根节点的树，由 createInitialTree 生成）。
//   - stepData（可选）：包含当前 stepId、已使用的 NEN 断言（usedNEN）和当前剩余可用断言（availableNEN）。
//       如果 stepData 为空，则默认 stepId 为 1，usedNEN 为空，availableNEN 为树根的 remainingAssertions。
// 功能流程：
//   1. 针对当前树的 remainingAssertions（availableNEN），筛选出有效的 NEN 断言（只考虑 NEN 类型，条件：continuing 中必须包含获胜者，即根节点 id；同时 NEN 的 winner 不能为获胜者）。
//   2. 从有效的 NEN 中选择 continuing 数量最少的那个断言（若有多个则随机选择一个，示例中取排序后的第一个）。
//   3. 根据选中的 NEN 断言，计算受该断言影响的所有淘汰顺序（使用 computeAffectedSequences）。
//   4. 对于每个受影响的淘汰顺序，使用 expandTreeToSequence 将相应分支展开到目标节点，并将该节点标记为剪枝（pruned）。
//   5. 从 availableNEN 中移除已使用的断言，并加入 usedNEN。
//   6. 更新 stepId（+1）。
//   7. 返回更新后的树和 stepData。

import {
  Assertion,
  EffectOfAssertionOnEliminationOrderSuffix,
  assertion_ok_elimination_order_suffix,
} from "../../../lib/explain/prettyprint_assertions_and_pictures";
import { TreeNode, expandTreeByNode, createInitialTree } from "./lazy_explain";

/**
 * 定义 stepData 接口
 * stepData 用于记录当前 step 的编号、已使用的 NEN 断言以及当前可用的断言
 */
export interface StepData {
  stepId: number; // 当前 step 编号
  usedNEN: Assertion[]; // 已使用的 NEN 断言
  availableNEN: Assertion[]; // 当前剩余可用的断言（主要用于 NEN 类型）
}

/**
 * 主函数：按 step-by-step 模式执行 lazy load 剪枝操作
 * 输入：
 *   - tree：当前整棵淘汰树（初始时只有根节点，由 createInitialTree 生成，根节点包含全部 Assertions）
 *   - stepData（可选）：如果不存在，默认 stepId 为 1，usedNEN 为空，availableNEN 为根节点的 remainingAssertions
 *
 * 流程：
 *   1. 如果 stepId 为 1，则对 availableNEN（即根节点的 remainingAssertions）进行筛选：
 *        筛选条件为：断言类型为 NEN；continuing 中必须包含获胜者（即根节点 id）；同时 NEN 的 winner 不等于获胜者。
 *   2. 如果 stepId 大于 1，则直接使用输入的 availableNEN。
 *   3. 从筛选出的 NEN 中选择 continuing 数量最少的一个（若有多个则随机选一个，示例中取排序后的第一个）。
 *   4. 根据选中断言，计算所有受该断言影响的淘汰顺序（computeAffectedSequences）。
 *   5. 对每个受影响淘汰顺序，调用 expandTreeToSequence 展开到对应节点，并将该节点标记为剪枝。
 *   6. 从 availableNEN 中移除已使用的该断言，并加入 usedNEN。
 *   7. stepId 增加 1。
 *   8. 返回更新后的树以及 stepData。
 *
 * @param tree 当前整棵淘汰树（初始时只有根节点）
 * @param inputStepData 可选的 stepData，如果不存在则使用默认值
 * @returns { updatedTree, stepData }，其中 stepData 包括 stepId、usedNEN 和 availableNEN
 */
export function applyStepByStepLazyLoad(
  tree: TreeNode,
  inputStepData?: StepData,
): { updatedTree: TreeNode; stepData: StepData } {
  // 如果没有输入 stepData，则初始化默认值，stepId=1，usedNEN为空，availableNEN为根节点的 remainingAssertions
  let stepData: StepData;
  if (!inputStepData) {
    stepData = {
      stepId: 1,
      usedNEN: [],
      availableNEN: tree.remainingAssertions.slice(), // 深拷贝
    };
  } else {
    stepData = { ...inputStepData };
  }

  const treeWinner = tree.id; // 根节点 id 作为获胜者
  // 1. 筛选出有效的 NEN 断言（只考虑 NEN 类型）
  let effectiveNEN = stepData.availableNEN.filter((assertion) => {
    if (assertion.type !== "NEN") return false;
    if (!assertion.continuing || !assertion.continuing.includes(treeWinner))
      return false;
    if (assertion.winner === treeWinner) return false;
    return true;
  });

  // 如果没有有效断言，返回当前树与 stepData（usedNEN 保持不变）
  if (effectiveNEN.length === 0) {
    return { updatedTree: tree, stepData };
  }

  // 2. 选择 continuing 数量最少的一个有效 NEN（如有多个，则取排序后的第一个）
  effectiveNEN.sort((a, b) => a.continuing!.length - b.continuing!.length);
  const selectedNEN = effectiveNEN[0];

  // 3. 根据选中断言计算所有受其影响的淘汰顺序
  const affectedSequences = computeAffectedSequences(selectedNEN);
  // affectedSequences 例如可能返回 [[3,1,2,0], [3,2,1,0]]

  // 4. 针对每个受影响的淘汰顺序，通过 lazy load 展开对应分支，并标记该分支为剪枝
  affectedSequences.forEach((seq) => {
    const targetNode = expandTreeToSequence(tree, seq);
    if (targetNode) {
      targetNode.pruned = true;
      targetNode.prunedBy = selectedNEN;
    }
  });

  // 5. 更新 availableNEN：移除已使用的 selectedNEN；同时将 selectedNEN 加入 usedNEN 中
  const newAvailable = stepData.availableNEN.filter((a) => a !== selectedNEN);
  const newUsed = [...stepData.usedNEN, selectedNEN];

  // 6. 更新 stepData 的 stepId
  const newStepData: StepData = {
    stepId: stepData.stepId + 1,
    usedNEN: newUsed,
    availableNEN: newAvailable,
  };

  // 7. 返回更新后的树和 stepData
  return { updatedTree: tree, stepData: newStepData };
}

/**
 * 计算受指定 NEN 断言影响的淘汰顺序
 * 假设断言的 continuing 数组中最后一个元素为获胜者，且第一元素为该断言要求的 winner，
 * 中间部分为 continuing 中除获胜者和断言 winner 外候选人的所有排列。
 * @param assertion 指定的 NEN 断言
 * @returns 一个二维数组，每个数组表示一个淘汰顺序
 */
function computeAffectedSequences(assertion: Assertion): number[][] {
  if (!assertion.continuing || assertion.continuing.length < 2) return [];
  const continuing = [...assertion.continuing];
  const treeWinner = continuing[continuing.length - 1];
  const NEN_winner = assertion.winner;
  if (!continuing.includes(treeWinner) || !continuing.includes(NEN_winner))
    return [];
  if (NEN_winner === treeWinner) return [];
  const middle = continuing.filter((c) => c !== treeWinner && c !== NEN_winner);
  const perms = getPermutations(middle);
  return perms.map((perm) => [NEN_winner, ...perm, treeWinner]);
}

/**
 * 递归生成数组所有排列的辅助函数
 * @param array 待排列数组
 * @returns 所有排列结果
 */
function getPermutations(array: number[]): number[][] {
  if (array.length === 0) return [[]];
  const result: number[][] = [];
  for (let i = 0; i < array.length; i++) {
    const rest = array.slice(0, i).concat(array.slice(i + 1));
    const restPermutations = getPermutations(rest);
    for (const perm of restPermutations) {
      result.push([array[i], ...perm]);
    }
  }
  return result;
}

/**
 * 沿着给定淘汰顺序展开树的分支
 * 从根节点开始，逐层展开直到达到目标淘汰顺序对应的节点。
 * @param root 当前淘汰树的根节点
 * @param sequence 目标淘汰顺序，例如 [3,1,2,0]
 * @returns 展开后的目标节点，若无法展开则返回 null
 */
function expandTreeToSequence(
  root: TreeNode,
  sequence: number[],
): TreeNode | null {
  let currentNode: TreeNode = root;
  // 遍历 sequence 中除最后一个元素外的部分，逐层展开
  for (let i = 0; i < sequence.length - 1; i++) {
    const candidate = sequence[i];
    let child = currentNode.children.find((c) => c.id === candidate);
    if (!child) {
      // 如果未找到则扩展当前节点
      currentNode = expandTreeByNode(currentNode, currentNode.id);
      child = currentNode.children.find((c) => c.id === candidate);
      if (!child) {
        return null;
      }
    }
    currentNode = child;
  }
  return currentNode;
}

export default applyStepByStepLazyLoad;
