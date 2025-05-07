import { useState, useEffect } from "react";
import {
  findNodeByPath,
  TreeNode,
} from "@/app/explain-assertions/components/lazy_explain";
import { useWorker } from "@/hooks/useWorker";
import { expandTreeByNode } from "@/app/explain-assertions/components/lazy_explain";

/**
 * 递归展开树结构
 * @param tree 树结构
 * @returns 展开后的树和展开的节点数
 */

// 应该有一个直接展开树的函数，不利用 findNodeByPath, 在自动展开的动画环节
// 这个是直接从根节点开始展开的，直接展开到底部的动画

// 然后有个自动展开的在web worker 中进行, 这个和第一个一致的

// lazyload的版本应该是一层层展开往下，就是点击就展开

export function expandTreeLevelOrder(tree: TreeNode): {
  expandedTree: TreeNode;
  expandedCount: number;
} {
  // 直接使用原树引用，expandTreeByNode 会直接修改树结构
  const expandedTree = tree;
  let expandedCount = 0;

  // 使用队列进行层序遍历
  const queue: TreeNode[] = [];

  // 从根节点开始
  queue.push(expandedTree);

  // 记录已处理的路径，避免重复处理
  const processedPaths = new Set<string>();

  while (queue.length > 0) {
    // 取出队首节点
    const currentNode = queue.shift()!;

    // 将当前路径转为字符串以便检查是否处理过
    const pathKey = currentNode.path.join(",");

    // 如果已经处理过该路径，跳过
    if (processedPaths.has(pathKey)) {
      continue;
    }
    processedPaths.add(pathKey);

    // 如果节点有未使用的候选人且未被剪枝，展开它
    if (
      currentNode.remaining &&
      currentNode.remaining.length > 0 &&
      !currentNode.pruned
    ) {
      // 展开节点 - 注意 expandTreeByNode 会直接修改原树结构
      expandTreeByNode(expandedTree, currentNode.path);
      expandedCount++;

      // 尝试找到当前节点的最新引用（已展开）
      const updatedNode = findNodeByPath(expandedTree, currentNode.path);

      // 添加所有子节点到队列中继续处理
      if (
        updatedNode &&
        updatedNode.children &&
        updatedNode.children.length > 0
      ) {
        queue.push(...updatedNode.children);
      }
    } else {
      // 即使当前节点不需要展开，也应该将其子节点添加到队列中
      if (currentNode.children && currentNode.children.length > 0) {
        queue.push(...currentNode.children);
      }
    }
  }

  console.log(expandedTree, expandedCount, "expandedTree");

  return { expandedTree, expandedCount };
}
/**
 * 树分析钩子 - 封装了使用 WebWorker 展开树结构的逻辑
 */
export function useTreeAnalysis() {
  // 使用 WebWorker
  const { execute, status } = useWorker();

  // 状态
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // 监听 worker 消息更新
  useEffect(() => {
    // 处理 Worker 的消息
    const handleWorkerMessage = (event: MessageEvent) => {
      if (event.data.type === "nodeExpanded") {
        const { expandedCount } = event.data.data;
        setProgress(expandedCount);
        console.log(`已展开 ${expandedCount} 个节点`);
      }
    };

    // 添加全局事件监听
    window.addEventListener("message", handleWorkerMessage);

    // 清理函数
    return () => {
      window.removeEventListener("message", handleWorkerMessage);
    };
  }, []);

  // 开始分析树结构
  const startAnalysis = async (tree: TreeNode) => {
    if (isAnalyzing) return; // 防止重复分析

    setIsAnalyzing(true);
    setProgress(0);

    try {
      // 在 WebWorker 中使用层序展开树
      const result = await execute(expandTreeLevelOrder, tree);

      console.log(`树结构分析完成，共展开了 ${result.expandedCount} 个节点`);

      return result;
    } catch (error) {
      console.error("在分析树结构时出错:", error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    startAnalysis,
    isAnalyzing,
    progress,
    status,
  };
}
