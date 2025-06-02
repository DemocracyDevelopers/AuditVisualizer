import {
  TreeNode,
  expandTreeByNode,
} from "@/app/explain-assertions/components/lazy_explain";
import { useFileDataStore } from "@/store/fileData";
import useDefaultTree from "@/store/use-default-tree";
import useTreeSelectionStore from "@/store/use-tree-selection-store";

export const expandTreeLayerByLayer = async () => {
  const fileData = useFileDataStore.getState().fileData;
  const selectedTreeId = useTreeSelectionStore.getState().selectedTreeId;
  const { defaultTrees, setDefaultTrees } = useDefaultTree.getState();

  if (!fileData) return;

  const treeIndex = defaultTrees.findIndex((t) => t.rootId === selectedTreeId);
  if (treeIndex === -1) return;

  let workingTree = JSON.parse(JSON.stringify(defaultTrees[treeIndex].tree));
  const MAX_LAYERS = 15;
  const EXPANSION_DELAY = 300;
  let currentLayer = 0;

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

  const expandNextLayer = async () => {
    const nodesToExpand = findExpandableNodesAtLayer(
      workingTree,
      0,
      currentLayer,
    );

    if (nodesToExpand.length === 0) {
      currentLayer++;
      if (currentLayer >= MAX_LAYERS) return;
      setTimeout(expandNextLayer, EXPANSION_DELAY);
      return;
    }

    for (let i = 0; i < nodesToExpand.length; i++) {
      const node = nodesToExpand[i];
      try {
        workingTree = expandTreeByNode(workingTree, node.path);
        const updatedTrees = [...defaultTrees];
        updatedTrees[treeIndex] = {
          ...updatedTrees[treeIndex],
          tree: workingTree,
        };
        setDefaultTrees(updatedTrees);
        if (i < nodesToExpand.length - 1)
          await new Promise((res) => setTimeout(res, 50));
      } catch (e) {
        console.error("Expansion error:", e);
      }
    }

    currentLayer++;
    if (currentLayer < MAX_LAYERS) setTimeout(expandNextLayer, EXPANSION_DELAY);
  };

  expandNextLayer();
};
