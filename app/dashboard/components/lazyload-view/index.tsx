import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ExpandIcon, Maximize, Minimize } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFileDataStore } from "@/store/fileData";
import {
  collapseTreeByNode,
  createTreeFromFile,
  expandTreeByNode,
  isNodeExpanded,
  TreeNode,
} from "@/app/explain-assertions/components/lazy_explain";
import useMultiWinnerDataStore from "@/store/multi-winner-data";
import { getSmartDisplayName } from "@/components/ui/avatar";
import DefaultCandidateListBar from "../elimination-tree/default-candidate-list-bar";
import useDefaultTree from "@/store/use-default-tree";
import { getContentFromAssertion } from "@/utils/candidateTools";

// Node sizing constants
const NODE_RADIUS = 18;
const NODE_MARGIN = 15; // Minimum margin between nodes
const dimensions = { width: 800, height: 500 }; // Increased dimensions for better spacing

function LazyLoadView() {
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomBehaviorRef = useRef(null);

  const [selectedTreeId, setSelectedTreeId] = useState(0);
  const [currentZoom, setCurrentZoom] = useState(1);
  const [currentTransform, setCurrentTransform] =
    useState<d3.ZoomTransform | null>(null);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isFullScreen, setIsFullScreen] = useState(false);

  const fileData = useFileDataStore((state) => state.fileData);
  const { candidateList, winnerInfo } = useMultiWinnerDataStore();
  const { defaultTrees, setDefaultTrees } = useDefaultTree();

  // Initialize the tree data when fileData changes
  const initializeTree = () => {
    if (fileData) {
      const trees = candidateList.map((candidate) => ({
        rootId: candidate.id,
        tree: createTreeFromFile(fileData, candidate.id),
      }));
      setSelectedTreeId(winnerInfo?.id || 0);
      setDefaultTrees(trees);
      console.log("Initial tree data:", trees, winnerInfo);
    }
  };

  // Initialize tree when fileData, candidateList, or winnerInfo changes
  useEffect(() => {
    initializeTree();
  }, [fileData, candidateList, winnerInfo]);

  // Handle node click to expand children
  const handleNodeClick = (node: TreeNode, rootId: number) => {
    // If node is pruned, don't expand
    if (node.pruned) {
      console.log("Node is pruned, cannot expand");
      return;
    }

    try {
      const treeIndex = defaultTrees.findIndex(
        (tree) => tree.rootId === rootId,
      );

      if (treeIndex === -1) {
        console.log("No matching tree found:", rootId);
        return;
      }

      // Clone the trees array and the specific tree to update
      const newDefaultTrees = [...defaultTrees];
      const treeToUpdate = { ...newDefaultTrees[treeIndex] };
      const wantUpdateTree = { ...treeToUpdate.tree };

      // Check if the node is already expanded
      if (isNodeExpanded(node)) {
        // Node is expanded, so collapse it
        console.log("Collapsing node:", node.path);
        const newTree = collapseTreeByNode(wantUpdateTree, node.path);

        // Update the specific tree in the array
        newDefaultTrees[treeIndex] = {
          ...treeToUpdate,
          tree: newTree,
        };

        // Update state
        setDefaultTrees(newDefaultTrees);
      } else {
        // If node has remaining candidates, expand it
        if (node.remaining && node.remaining.length > 0) {
          console.log("Expanding node:", node.path);
          const newTree = expandTreeByNode(wantUpdateTree, node.path);

          // Update the specific tree in the array
          newDefaultTrees[treeIndex] = {
            ...treeToUpdate,
            tree: newTree,
          };

          // Update state
          setDefaultTrees(newDefaultTrees);
        } else {
          console.log("Node has no expandable candidates");
        }
      }
    } catch (error) {
      console.error("Error toggling node:", error);
    }
  };

  // Expand all nodes layer by layer
  const expandAllNodes = async () => {
    if (!fileData) return;

    // Get the current tree
    const treeIndex = defaultTrees.findIndex(
      (tree) => tree.rootId === selectedTreeId,
    );

    if (treeIndex === -1) {
      console.error("Selected tree not found");
      return;
    }

    // Start with the current tree structure
    const currentTree = defaultTrees[treeIndex].tree;

    // Function to find all expandable nodes at a specific layer
    const findExpandableNodesAtLayer = (tree: TreeNode, layerDepth: number) => {
      const nodesToExpand: TreeNode[] = [];

      // Helper function to traverse the tree and collect nodes at the target depth
      const traverse = (node: TreeNode, depth: number) => {
        if (depth === layerDepth) {
          // Check if the node is expandable (has remaining candidates and not pruned)
          if (node.remaining && node.remaining.length > 0 && !node.pruned) {
            nodesToExpand.push(node);
          }
          return;
        }

        // Continue traversing children if not at the target depth yet
        if (node.children && node.children.length > 0 && depth < layerDepth) {
          for (const child of node.children) {
            traverse(child, depth + 1);
          }
        }
      };

      // Start traversal from the root
      traverse(tree, 0);
      return nodesToExpand;
    };

    // Maximum number of layers to expand
    const MAX_LAYERS = 15;
    // Delay between layer expansions (ms)
    const EXPANSION_DELAY = 300;

    // Set this to true if you want to stop the expansion when no more expandable nodes are found
    let shouldStopEarly = true;

    // Start expansion layer by layer
    let currentLayer = 0;
    let continuingExpansion = true;

    // This will be our current tree state that gets updated after each layer expansion
    let workingTree = JSON.parse(JSON.stringify(currentTree));

    const expandNextLayer = async () => {
      // Find all expandable nodes at the current layer
      const nodesToExpand = findExpandableNodesAtLayer(
        workingTree,
        currentLayer,
      );
      console.log(
        `Layer ${currentLayer}: Found ${nodesToExpand.length} expandable nodes`,
      );

      // If no expandable nodes at this layer, move to the next layer
      if (nodesToExpand.length === 0) {
        currentLayer++;

        // Check if we've reached the maximum layers or should stop
        if (
          currentLayer >= MAX_LAYERS ||
          (shouldStopEarly && !continuingExpansion)
        ) {
          console.log("Expansion complete!");
          return;
        }

        // Schedule the next layer expansion
        setTimeout(expandNextLayer, EXPANSION_DELAY);
        return;
      }

      // We found nodes to expand, so we should continue after this
      continuingExpansion = true;

      // Expand each node in this layer
      for (let i = 0; i < nodesToExpand.length; i++) {
        const node = nodesToExpand[i];
        console.log(`Expanding node with path [${node.path.join(", ")}]`);

        try {
          // Expand this node
          workingTree = expandTreeByNode(workingTree, node.path);

          // Update the tree in the state
          const newTrees = [...defaultTrees];
          newTrees[treeIndex] = {
            ...newTrees[treeIndex],
            tree: workingTree,
          };

          // Update state (this will trigger a re-render)
          setDefaultTrees(newTrees);

          // Small delay between node expansions within the same layer
          if (i < nodesToExpand.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
        } catch (error) {
          console.error(
            `Error expanding node with path [${node.path.join(", ")}]:`,
            error,
          );
        }
      }

      // Move to the next layer
      currentLayer++;

      // Check if we've reached the maximum layers
      if (currentLayer >= MAX_LAYERS) {
        console.log("Reached maximum layers, stopping expansion.");
        return;
      }

      // Schedule the next layer expansion
      setTimeout(expandNextLayer, EXPANSION_DELAY);
    };

    // Start the expansion process
    expandNextLayer();
  };

  // Count visible nodes at each depth for better spacing
  const countVisibleNodesAtDepth = (node: TreeNode, depth = 0, counts = {}) => {
    counts[depth] = (counts[depth] || 0) + 1;

    if (node.children) {
      node.children.forEach((child) =>
        countVisibleNodesAtDepth(child, depth + 1, counts),
      );
    }

    return counts;
  };

  // Resize observer to adjust tree size based on container
  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          setContainerDimensions({ width, height });
        }
      });

      resizeObserver.observe(containerRef.current);

      // Also handle window resize events for fullscreen mode
      const handleResize = () => {
        if (isFullScreen) {
          // Force redraw with new dimensions when in fullscreen mode
          setContainerDimensions({
            width: window.innerWidth,
            height: window.innerHeight - 60, // Leave room for controls
          });
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        resizeObserver.disconnect();
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isFullScreen]);

  // Check if selected tree is the winner
  const isWinnerSelected = () => {
    return winnerInfo && selectedTreeId === winnerInfo.id;
  };

  // Helper function to determine pruning type and color
  const getPruningInfo = (node: TreeNode) => {
    if (!node.pruned) {
      return { type: "NEN", color: "#ff6b6b" }; // Default for safety
    }

    // 最可靠的检测方法：将整个 prunedBy 对象转为字符串，然后检查是否包含 "neb"
    const prunedByString = JSON.stringify(node.prunedBy || {}).toLowerCase();

    // 如果字符串中包含 "neb"，则判定为 NEB 类型
    if (prunedByString.includes("neb")) {
      return { type: "NEB", color: "#4dabf7" }; // Blue color for NEB
    } else {
      return { type: "NEN", color: "#ff6b6b" }; // Red color for NEN
    }
  };

  // Render the tree visualization
  const renderTree = () => {
    if (!svgRef.current) return;

    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll("*").remove();

    // Automatically re-render when fullscreen state changes
    const width = isFullScreen
      ? window.innerWidth
      : containerDimensions.width || dimensions.width;
    const height = isFullScreen
      ? window.innerHeight - 60 // Leave room for controls
      : containerDimensions.height || dimensions.height;

    const margin = { top: 30, right: 40, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const targetTree = defaultTrees.find(
      (tree) => tree.rootId === selectedTreeId,
    );

    if (!targetTree) {
      console.error("No matching tree found:", selectedTreeId);
      return;
    }

    // Count number of visible nodes at each level for better spacing
    const nodeCounts = countVisibleNodesAtDepth(targetTree.tree);
    const maxNodesAtAnyLevel = Math.max(
      ...(Object.values(nodeCounts) as number[]),
      1,
    );

    // Calculate dynamic node spacing based on tree width and node count
    const nodeSpacing = Math.max(
      innerWidth / (maxNodesAtAnyLevel + 2),
      NODE_RADIUS * 2 + NODE_MARGIN, // Ensure minimum spacing
    );

    // Create tree layout with improved spacing
    const treeLayout = d3
      .tree<TreeNode>()
      .size([innerWidth, innerHeight])
      .nodeSize([nodeSpacing * 0.8, 70]) // Set minimum node size to prevent overlap
      .separation((a, b) => {
        // Return a larger separation value between non-sibling nodes
        return a.parent === b.parent ? 1 : 1.5;
      });

    const root = d3.hierarchy(targetTree.tree);

    // Center the root node
    const treeDataLayout = treeLayout(root);

    // Adjust y-coordinate to ensure top-down orientation with root at top
    treeDataLayout.descendants().forEach((node) => {
      node.y = node.depth * 100; // Fixed vertical spacing
    });

    // Recenter the root node horizontally
    const rootNode = treeDataLayout.descendants()[0];
    const xOffset = innerWidth / 2 - rootNode.x;

    treeDataLayout.descendants().forEach((node) => {
      node.x += xOffset;
    });

    const nodes = treeDataLayout.descendants();
    const links = treeDataLayout.links();

    const g: d3.Selection<SVGGElement, unknown, null, undefined> = svgElement
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    gRef.current = g.node();

    // Draw links
    g.selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y)
      .attr("stroke", (d) => {
        // If target node is pruned, use red
        if (d.target.data.pruned) {
          return "#ff0000";
        }
        return "#e9bc39";
      })
      .attr("stroke-width", 3);

    // Create node groups
    const groups = g
      .selectAll("g.node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .classed("cursor-pointer", true)
      .on("click", (event: MouseEvent, d) => {
        handleNodeClick(d.data as TreeNode, selectedTreeId);
      });

    // Add node circles
    groups
      .append("circle")
      .attr("r", NODE_RADIUS)
      .attr("fill", (d) => {
        // If node is pruned, use light red fill
        if (d.data.pruned) {
          return "#ffcccc";
        }
        // If node has expandable children, use light orange fill
        if (d.data.remaining && d.data.remaining.length > 0) {
          return "#ffe0b2";
        }
        return "white";
      })
      .attr("stroke", (d) => (d.data.pruned ? "red" : "black"))
      .attr("stroke-width", 1);

    // Add node text with improved text handling
    groups
      .append("text")
      .attr("y", 3)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "black")
      .text(function (d) {
        const { shortName } = getSmartDisplayName(d.data.id, candidateList);
        const maxWidth = 35;
        let text = shortName;
        const ellipsis = "..";

        // Create temporary text element to measure width
        let textElement = d3.select(this).text(text);

        // Check if text width exceeds maximum width
        while (
          textElement.node().getComputedTextLength() > maxWidth &&
          text.length > 0
        ) {
          text = text.slice(0, -1);
          textElement.text(text + ellipsis);
        }

        return textElement.text();
      })
      .append("title")
      .text((d) => {
        // Add more information to hover tooltip
        let tooltip = getSmartDisplayName(d.data.id, candidateList).name;

        // If node is pruned, show pruning reason
        if (d.data.pruned && d.data.prunedBy) {
          tooltip += `\nPruned by: ${getContentFromAssertion({
            assertion: d.data.prunedBy,
            candidateList,
          })}`;
        }

        return tooltip;
      });

    // Add pruning indicators for pruned nodes (NEN, NEB)
    groups
      .filter((d) => d.data.pruned)
      .append("circle")
      .attr("r", 12)
      .attr("cy", 40)
      .attr("fill", (d) => getPruningInfo(d.data).color)
      .attr("stroke", "white")
      .attr("stroke-width", 1);

    groups
      .filter((d) => d.data.pruned)
      .append("text")
      .attr("y", 44)
      .attr("text-anchor", "middle")
      .attr("font-size", "8px")
      .attr("font-weight", "bold")
      .attr("fill", "white")
      .text((d) => getPruningInfo(d.data).type);

    // Add expandable indicators - MODIFIED CODE
    // Only add indicators for nodes that:
    // 1. Have remaining candidates
    // 2. Are not pruned
    // 3. Don't already have expanded children
    groups
      .filter(
        (d) =>
          d.data.remaining &&
          d.data.remaining.length > 0 &&
          !d.data.pruned &&
          (!d.data.children || d.data.children.length === 0),
      )
      .append("circle")
      .attr("r", 12)
      .attr("cy", 40)
      .attr("fill", "#e77d00")
      .attr("stroke-width", 1);

    groups
      .filter(
        (d) =>
          d.data.remaining &&
          d.data.remaining.length > 0 &&
          !d.data.pruned &&
          (!d.data.children || d.data.children.length === 0),
      )
      .append("text")
      .attr("y", 46)
      .attr("text-anchor", "middle")
      .attr("class", "text-lg text-black")
      .text((d) => `${d.data.remaining.length}`);

    // Add zoom behavior
    const zoom: D3ZoomBehavior = d3
      .zoom()
      .scaleExtent([0.25, 2])
      .on("zoom", (event: D3ZoomEvent) => {
        g.attr("transform", event.transform.toString());
        setCurrentZoom(event.transform.k);
        setCurrentTransform(event.transform);
      });

    zoomBehaviorRef.current = zoom;
    svgElement.call(zoom);

    // Apply previous transform if available, or calculate a default one
    if (currentTransform) {
      // Restore previous transform
      svgElement.call(zoom.transform, currentTransform);
    } else {
      // Initial transform to fit the tree in view
      const initialScale = Math.min(
        innerWidth / (root.descendants().length * nodeSpacing * 0.8),
        0.9, // Cap at 90% to leave some margin
      );

      // Center the tree in the view
      const initialTransform = d3.zoomIdentity
        .translate(width / 5, 30)
        .scale(initialScale);

      svgElement.call(zoom.transform, initialTransform);
      setCurrentZoom(initialScale);
    }
  };

  // Render tree or message when dependencies change
  useEffect(() => {
    if (defaultTrees.length > 0 && !isWinnerSelected()) {
      renderTree();
    }

    // Cleanup function
    return () => {
      if (svgRef.current) {
        d3.select(svgRef.current).on(".zoom", null);
      }
    };
  }, [
    selectedTreeId,
    defaultTrees,
    candidateList,
    containerDimensions,
    isFullScreen,
    winnerInfo,
  ]);

  // Handle zoom level changes
  const handleZoomChange = (scaleFactor: number) => {
    if (zoomBehaviorRef.current && svgRef.current) {
      const svgElement = d3.select(svgRef.current);

      // Get current transform to maintain center point during zoom
      const transform = d3.zoomTransform(svgElement.node());

      // Calculate new transform with adjusted scale but maintaining center
      const newTransform = d3.zoomIdentity
        .translate(transform.x, transform.y)
        .scale(scaleFactor);

      svgElement
        .transition()
        .duration(500)
        .call(zoomBehaviorRef.current.transform, newTransform);

      setCurrentZoom(scaleFactor);
      setCurrentTransform(newTransform);
    }
  };

  // Reset view to fit all nodes
  const handleResetView = () => {
    if (zoomBehaviorRef.current && svgRef.current) {
      const svgElement = d3.select(svgRef.current);
      const width = containerDimensions.width || dimensions.width;
      const height = containerDimensions.height || dimensions.height;

      // Use the same margin configuration as in the rendering effect
      const margin = { top: 30, right: 40, bottom: 30, left: 40 };
      const innerWidth = width - margin.left - margin.right;

      // Get the target tree
      const targetTree = defaultTrees.find(
        (tree) => tree.rootId === selectedTreeId,
      );
      if (!targetTree) return;

      // Create hierarchy for the current tree state
      const root = d3.hierarchy(targetTree.tree);

      // Calculate the node spacing exactly as in the rendering logic
      const nodeCounts = countVisibleNodesAtDepth(targetTree.tree);
      const maxNodesAtAnyLevel = Math.max(...Object.values(nodeCounts), 1);
      const nodeSpacing = Math.max(
        innerWidth / (maxNodesAtAnyLevel + 1),
        NODE_RADIUS * 2 + NODE_MARGIN,
      );

      // Use the exact same scale calculation as the initial render
      const initialScale = Math.min(
        innerWidth / (root.descendants().length * nodeSpacing * 0.8),
        0.9,
      );

      // Create the transform exactly as in the initial setup
      const initialTransform = d3.zoomIdentity
        .translate(width / 5, 30)
        .scale(initialScale);

      // Apply the transform with a transition for better UX
      svgElement
        .transition()
        .duration(750)
        .call(zoomBehaviorRef.current.transform, initialTransform);

      setCurrentZoom(initialScale);
      setCurrentTransform(initialTransform);
    }
  };

  // Toggle fullscreen with improved handling
  const toggleFullScreen = () => {
    if (!containerRef.current) return;

    if (!isFullScreen) {
      // Enter fullscreen
      try {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        } else if (containerRef.current.webkitRequestFullscreen) {
          containerRef.current.webkitRequestFullscreen();
        } else if (containerRef.current.mozRequestFullScreen) {
          containerRef.current.mozRequestFullScreen();
        } else if (containerRef.current.msRequestFullscreen) {
          containerRef.current.msRequestFullscreen();
        }
      } catch (err: unknown) {
        const error = err as Error;
        console.error(
          `Error attempting to enable fullscreen: ${error.message}`,
        );
      }
    } else {
      // Exit fullscreen
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error attempting to exit fullscreen: ${error.message}`);
        // Force the state update even if the API call failed
        setIsFullScreen(false);
      }
    }
  };

  // Listen for fullscreen change events with improved handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      // Check for fullscreen element across different browsers
      const isInFullScreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );

      setIsFullScreen(isInFullScreen);

      // If exiting fullscreen, ensure we update the state
      if (!isInFullScreen && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    // Add event listeners for different browsers
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    // Add an escape key handler as fallback for fullscreen exit
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);

    // Clean up all event listeners
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange,
      );
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isFullScreen]);

  // Render the winner message when the winner is selected
  const renderWinnerMessage = () => {
    if (!winnerInfo) return null;

    const { name, shortName } = getSmartDisplayName(
      winnerInfo.id,
      candidateList,
    );

    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl shadow-sm">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Winner Selected: {name || shortName}
          </h3>
          <p className="text-gray-700 mb-4">
            The winner&apos;s elimination tree is typically very large and
            complex, which may cause performance issues if displayed.
          </p>
          <p className="text-gray-700 mb-6">
            Please select another candidate from the list above to view their
            elimination tree instead.
          </p>
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="bg-green-100 hover:bg-green-200 text-green-800 border-green-300"
              onClick={() => {
                // Find the first non-winner candidate and select their tree
                const firstNonWinnerCandidate = candidateList.find(
                  (candidate) => candidate.id !== winnerInfo.id,
                );
                if (firstNonWinnerCandidate) {
                  setSelectedTreeId(firstNonWinnerCandidate.id);
                }
              }}
            >
              View Another Candidate&apos;s Tree
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <DefaultCandidateListBar
        selectedTreeId={selectedTreeId}
        candidateList={candidateList}
        setSelectedTreeId={setSelectedTreeId}
      />
      <div
        ref={containerRef}
        className={`relative ${
          isFullScreen
            ? "fixed inset-0 bg-white z-10"
            : "w-full h-96 flex-grow overflow-hidden"
        }`}
        data-tour="tree-view"
      >
        {isWinnerSelected() ? (
          renderWinnerMessage()
        ) : (
          <svg
            ref={svgRef}
            width="100%"
            height={isFullScreen ? "calc(100vh - 60px)" : "100%"}
            className="overflow-hidden"
            preserveAspectRatio="xMidYMid meet"
          />
        )}

        {isFullScreen && !isWinnerSelected() && (
          <div className="fixed bottom-0 left-0 right-0 flex justify-between items-center px-4 py-2 border-t bg-white z-20">
            <div></div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleZoomChange(currentZoom - 0.1)}
                disabled={currentZoom <= 0.25}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {Math.round(currentZoom * 100)}%
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleZoomChange(0.25)}>
                    25%
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleZoomChange(0.5)}>
                    50%
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleZoomChange(0.75)}>
                    75%
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleZoomChange(1)}>
                    100%
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleZoomChange(1.5)}>
                    150%
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleZoomChange(2)}>
                    200%
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleZoomChange(currentZoom + 0.1)}
                disabled={currentZoom >= 2}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={handleResetView}
                size="sm"
                className="ml-2"
              >
                Fit
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullScreen}
                className="ml-2"
                title="Exit Fullscreen"
              >
                <Minimize className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" onClick={expandAllNodes}>
              <ExpandIcon className="h-4 w-4 mr-2" />
              Expand All
            </Button>
          </div>
        )}
      </div>

      {/* Controls when not in fullscreen mode */}
      {!isFullScreen && !isWinnerSelected() && (
        <div className="flex justify-between items-center mt-2 px-4 py-2 border-t bg-white">
          <div></div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleZoomChange(currentZoom - 0.1)}
              disabled={currentZoom <= 0.25}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {Math.round(currentZoom * 100)}%
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleZoomChange(0.25)}>
                  25%
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleZoomChange(0.5)}>
                  50%
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleZoomChange(0.75)}>
                  75%
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleZoomChange(1)}>
                  100%
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleZoomChange(1.5)}>
                  150%
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleZoomChange(2)}>
                  200%
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleZoomChange(currentZoom + 0.1)}
              disabled={currentZoom >= 2}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleResetView}
              size="sm"
              className="ml-2"
            >
              Fit
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleFullScreen}
              className="ml-2"
              title="Fullscreen"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" onClick={expandAllNodes}>
            <ExpandIcon className="h-4 w-4 mr-2" />
            Expand All
          </Button>
        </div>
      )}
    </div>
  );
}

export default LazyLoadView;
