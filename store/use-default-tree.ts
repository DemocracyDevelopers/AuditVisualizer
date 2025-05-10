// stores/useGlobalJsonStore.ts
import { Assertion } from "@/lib/explain/prettyprint_assertions_and_pictures";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type TreeNode = {
  id: number; // 节点唯一标识
  path: number[]; // 当前节点的淘汰顺序（从当前节点到根节点）
  remainingAssertions: Assertion[]; // 剩余可用的 Assertions
  children: TreeNode[]; // 子节点数组
  remaining: number[]; // 剩余未使用的候选人索引
  pruned: boolean; // 是否被剪枝
  prunedBy?: Assertion; // 剪枝时使用的断言（如果有）
};

type DefaultTree = {
  tree: TreeNode;
  rootId: number; // 树根节点ID，也就是winnerId
};

interface DefaultTreeData {
  defaultTrees: DefaultTree[];
  setDefaultTrees: (data: DefaultTree[]) => void; // 设置 JSON 数据
}

const useDefaultTree = create<DefaultTreeData>()(
  devtools(
    // 存入localStorage, 让刷新页面不会丢失数据
    persist(
      (set) => ({
        defaultTrees: [], // 初始状态为空
        setDefaultTrees: (data) => set({ defaultTrees: data }), // 设置 JSON 数据
      }),
      {
        name: "defaultTrees-store",
      },
    ),
    { name: "defaultTrees-store" },
  ),
);

export default useDefaultTree;
