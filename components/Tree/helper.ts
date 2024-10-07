// treeHelpers.ts

interface TreeNode {
  id: number;
  name: string;
  children?: TreeNode[];
  _children?: TreeNode[]; // Hidden children when collapsed
  collapsedCount?: number; // Count of collapsed children
}

// Function to toggle the children (collapse/expand)
const toggleChildren = (node: TreeNode) => {
  if (node.children) {
    node._children = node.children;
    node.children = undefined;
    node.collapsedCount = countNodes(node._children);
  } else if (node._children) {
    node.children = node._children;
    node._children = undefined;
    node.collapsedCount = undefined;
  }
};

// Function to count the number of nodes
const countNodes = (nodes?: TreeNode[]): number => {
  if (!nodes) return 0;
  let count = nodes.length;
  nodes.forEach((node) => {
    count += countNodes(node.children || node._children); // Include all children (visible and hidden)
  });
  return count;
};

export { toggleChildren };
export type { TreeNode };
