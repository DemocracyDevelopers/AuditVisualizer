// treeHelpers.ts

interface TreeNode {
  id: number;
  eliminated?: boolean; // eliminated children
  cut?: boolean; // Cut children
  children?: TreeNode[];
  _children?: TreeNode[]; // Hidden children when collapsed
  collapsedCount?: number; // Count of collapsed children
  hiddenCutCount?: number; // Count of hidden cut nodes
  hide?: boolean; // 隐藏节点及其子节点
}

// Function to toggle the children (collapse/expand)
const toggleChildren = (node: TreeNode) => {
  if (node.children) {
    node._children = node.children;
    node.children = undefined;
    node.collapsedCount = countNodes(node._children);
    node.hiddenCutCount = countCutNodes(node._children);
  } else if (node._children) {
    node.children = node._children;
    node._children = undefined;
    node.collapsedCount = undefined;
    node.hiddenCutCount = undefined;
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

// Function to count the number of cut nodes
const countCutNodes = (nodes?: TreeNode[]): number => {
  if (!nodes) return 0;
  let count = 0;

  nodes.forEach((node) => {
    // Count this node if it's cut
    if (node.cut) {
      count++;
    }
    // Recursively count cut nodes in children (visible or hidden)
    count += countCutNodes(node.children || node._children);
  });

  return count;
};

export { toggleChildren, countNodes, countCutNodes };
export type { TreeNode };
