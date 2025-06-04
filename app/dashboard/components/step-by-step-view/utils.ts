import { TreeNode } from "@/components/tree/helper";

// Helper function to deep clone tree data
function deepCloneTree(tree: TreeNode | undefined | null): TreeNode | null {
  if (!tree) return null;
  return JSON.parse(JSON.stringify(tree));
}

export { deepCloneTree };
