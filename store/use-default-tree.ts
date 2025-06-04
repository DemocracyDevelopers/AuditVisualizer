import { Assertion } from "@/lib/explain/prettyprint_assertions_and_pictures";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type TreeNode = {
  id: number; // Unique identifier for the node
  path: number[]; // Elimination path from the current node to the root
  remainingAssertions: Assertion[]; // Assertions remaining to be applied
  children: TreeNode[]; // Array of child nodes
  remaining: number[]; // Indexes of remaining candidates at this node
  pruned: boolean; // Whether the node was pruned
  prunedBy?: Assertion; // The assertion used to prune this node (if any)
};

type DefaultTree = {
  tree: TreeNode;
  rootId: number; // Root node ID, corresponds to the winnerId
};

interface DefaultTreeData {
  defaultTrees: DefaultTree[];
  setDefaultTrees: (data: DefaultTree[]) => void;
}

// Zustand store to persist and manage the default elimination trees
const useDefaultTree = create<DefaultTreeData>()(
  devtools(
    persist(
      (set) => ({
        defaultTrees: [],
        setDefaultTrees: (data) => set({ defaultTrees: data }),
      }),
      {
        name: "defaultTrees-store",
      },
    ),
    { name: "defaultTrees-store" },
  ),
);

export default useDefaultTree;
