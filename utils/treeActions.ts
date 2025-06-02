import {
  TreeNode,
  expandTreeByNode,
} from "@/app/explain-assertions/components/lazy_explain";
import { useFileDataStore } from "@/store/fileData";
import useDefaultTree from "@/store/use-default-tree";
import useTreeSelectionStore from "@/store/use-tree-selection-store";

/**
 * Expand the currently selected tree layer by layer.
 *
 * - Finds the tree matching the selectedTreeId from defaultTrees.
 * - Expands only one layer of nodes at a time (breadth-first).
 * - Expansion proceeds automatically up to MAX_LAYERS with delays.
 */
export const expandTreeLayerByLayer = async () => {
  const fileData = useFileDataStore.getState().fileData;
  const selectedTreeId = useTreeSelectionStore.getState().selectedTreeId;
  const { defaultTrees, setDefaultTrees } = useDefaultTree.getState();

  // Exit early if no input file is loaded
  if (!fileData) return;

  // Find the index of the tree currently selected
  const treeIndex = defaultTrees.findIndex((t) => t.rootId === selectedTreeId);
  if (treeIndex === -1) return;

  // Clone the tree to work with it safely
  let workingTree = JSON.parse(JSON.stringify(defaultTrees[treeIndex].tree));
  const MAX_LAYERS = 15; // Max number of layers to expand
  const EXPANSION_DELAY = 300; // Delay (ms) between layer expansions
  let currentLayer = 0;

  /**
   * Recursively find all expandable nodes at the specified tree depth (layer).
   * A node is expandable if it has remaining candidates and is not pruned.
   */
  const findExpandableNodesAtLayer = (
    node: TreeNode,
    depth = 0,
    layer = 0,
  ): TreeNode[] => {
    if (depth === layer) {
      if (node.remaining?.length && !node.pruned) return [node];
      return [];
    }
    if (!node.children) return [];
    return node.children.flatMap((child) =>
      findExpandableNodesAtLayer(child, depth + 1, layer),
    );
  };

  /**
   * Expand all expandable nodes at the current layer,
   * then proceed to the next layer after a short delay.
   */
  const expandNextLayer = async () => {
    const nodesToExpand = findExpandableNodesAtLayer(
      workingTree,
      0,
      currentLayer,
    );

    // If no nodes to expand at this layer, move to the next
    if (nodesToExpand.length === 0) {
      currentLayer++;
      if (currentLayer >= MAX_LAYERS) return;
      setTimeout(expandNextLayer, EXPANSION_DELAY);
      return;
    }

    for (let i = 0; i < nodesToExpand.length; i++) {
      const node = nodesToExpand[i];
      try {
        // Expand this node by adding one layer of children
        workingTree = expandTreeByNode(workingTree, node.path);
        // Update global state with new tree
        const updatedTrees = [...defaultTrees];
        updatedTrees[treeIndex] = {
          ...updatedTrees[treeIndex],
          tree: workingTree,
        };
        setDefaultTrees(updatedTrees);

        // Small delay between node expansions for smoother UX
        if (i < nodesToExpand.length - 1)
          await new Promise((res) => setTimeout(res, 50));
      } catch (e) {
        console.error("Expansion error:", e);
      }
    }

    currentLayer++;
    if (currentLayer < MAX_LAYERS) setTimeout(expandNextLayer, EXPANSION_DELAY);
  };

  expandNextLayer(); // Begin the expansion process
};
