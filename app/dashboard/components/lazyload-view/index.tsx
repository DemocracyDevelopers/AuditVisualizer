import {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
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
import { getCandidateNumber } from "@/app/explain-assertions/components/explain-process";
import useTreeSelectionStore from "@/store/use-tree-selection-store";

// Node sizing constants
const NODE_RADIUS = 18;
const NODE_MARGIN = 15; // Minimum margin between nodes
const dimensions = { width: 800, height: 500 }; // Increased dimensions for better spacing

interface CountsObject {
  [depth: number]: number;
}

function LazyLoadView() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedTreeId = useTreeSelectionStore((s) => s.selectedTreeId);
  const setSelectedTreeId = useTreeSelectionStore((s) => s.setSelectedTreeId);

  const [currentZoom, setCurrentZoom] = useState(1);
  const [currentTransform, setCurrentTransform] =
    useState<d3.ZoomTransform | null>(null);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [renderKey, setRenderKey] = useState(0);
  const [isInitialRender, setIsInitialRender] = useState(true);

  const fileData = useFileDataStore((state) => state.fileData);
  const { candidateList, winnerInfo } = useMultiWinnerDataStore();
  const { defaultTrees, setDefaultTrees } = useDefaultTree();

  // Calculate tree layout data and center it
  const calculateTreeLayout = useCallback(
    (treeData: TreeNode, width: number, height: number) => {
      // Create hierarchy
      const root = d3.hierarchy(treeData);

      // Count visible nodes at each depth
      const nodeCounts: Record<number, number> = {};
      root.each((node) => {
        // Count each node by depth
        nodeCounts[node.depth] = (nodeCounts[node.depth] || 0) + 1;
      });

      const maxNodesAtAnyLevel = Math.max(...Object.values(nodeCounts), 1);
      const nodeSpacing = Math.max(
        width / (maxNodesAtAnyLevel + 2),
        NODE_RADIUS * 2 + NODE_MARGIN,
      );

      // Create tree layout
      const treeLayout = d3
        .tree<TreeNode>()
        .size([width, height])
        .nodeSize([nodeSpacing * 0.8, 70])
        .separation((a, b) => (a.parent === b.parent ? 1 : 1.5));

      // Generate layout
      const treeDataLayout = treeLayout(root);

      // Adjust y coordinates for top-down orientation
      treeDataLayout.descendants().forEach((node) => {
        node.y = node.depth * 100 - 20; // Move the entire tree up by 20 units
      });

      // Calculate the min and max x values to determine horizontal bounds
      const descendants = treeDataLayout.descendants();
      if (descendants.length === 0)
        return {
          nodes: [],
          links: [],
          width: 0,
          center: { x: 0, y: 0 },
        };

      const xValues = descendants.map((d) => d.x);
      const minX = Math.min(...xValues);
      const maxX = Math.max(...xValues);
      const treeWidth = maxX - minX;

      // Center the tree horizontally - calculate correct offset
      const xOffset = -((maxX + minX) / 2); // Center the tree at the origin (0,0)

      // Apply offset to all nodes
      descendants.forEach((node) => {
        node.x += xOffset;
      });

      return {
        nodes: descendants,
        links: treeDataLayout.links(),
        width: treeWidth, // Tree width for scaling calculation
        center: { x: 0, y: 0 }, // Tree center is now at the origin
      };
    },
    [],
  );

  // calculate optimal scale based on tree width and viewport width
  const calculateOptimalScale = useCallback(
    (treeWidth: number, viewportWidth: number) => {
      if (treeWidth <= 0) return 0.8; // Avoid division by zero
      return Math.min(viewportWidth / (treeWidth * 1.2), 0.9);
    },
    [],
  );

  const createInitialTransform = useCallback((optimalScale: number) => {
    return d3.zoomIdentity.translate(0, 10).scale(optimalScale);
  }, []);

  const initializeTree = useCallback(() => {
    if (fileData) {
      const trees = candidateList.map((candidate) => ({
        rootId: candidate.id,
        tree: createTreeFromFile(fileData, candidate.id),
      }));
      setSelectedTreeId(winnerInfo?.id || 0);
      setDefaultTrees(trees);
    }
  }, [fileData, candidateList, winnerInfo, setDefaultTrees]);

  // Initialize tree when fileData, candidateList, or winnerInfo changes
  useEffect(() => {
    initializeTree();
  }, [initializeTree]);

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

  // Handle node click to expand children
  const handleNodeClick = useCallback(
    (node: TreeNode, rootId: number) => {
      // If node is pruned, don't expand
      // Node clicked: node.path
      if (node.pruned) {
        // Node is pruned, cannot expand
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
    },
    [defaultTrees, setDefaultTrees],
  );

  // Count visible nodes at each depth for better spacing
  const countVisibleNodesAtDepth = useCallback(
    (node: TreeNode, depth = 0, counts: CountsObject = {}): CountsObject => {
      counts[depth] = (counts[depth] || 0) + 1;

      if (node.children) {
        node.children.forEach((child) =>
          countVisibleNodesAtDepth(child, depth + 1, counts),
        );
      }

      return counts;
    },
    [],
  );

  // Expand all nodes layer by layer
  const expandAllNodes = useCallback(async () => {
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
    // This will be our current tree state that gets updated after each layer expansion
    let workingTree = JSON.parse(JSON.stringify(currentTree));
    let currentLayer = 0;
    let continuingExpansion = true;

    const expandNextLayer = async () => {
      // Find all expandable nodes at the current layer
      const nodesToExpand = findExpandableNodesAtLayer(
        workingTree,
        currentLayer,
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
  }, [fileData, defaultTrees, selectedTreeId, setDefaultTrees]);

  // Check if selected tree is the winner
  const isBigDataWinnerSelected = useCallback(() => {
    return (
      winnerInfo &&
      selectedTreeId === winnerInfo.id &&
      getCandidateNumber(fileData) >= 6
    );
  }, [winnerInfo, selectedTreeId, fileData]);

  // Setup drag and zoom handling for SVG visualization
  const setupDragHandling = useCallback(
    (svgElement: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
      // Get reference to the main group element that contains the visualization
      const g = d3.select(gRef.current);

      // Calculate layout dimensions and positioning
      const width = containerDimensions.width || dimensions.width;
      const centerX = width / 2;
      const margin = { top: 30, right: 40, bottom: 30, left: 40 };

      // Handle mouse down event to start dragging
      const handleMouseDown = (event: MouseEvent) => {
        // Only handle clicks directly on the SVG element (not child elements)
        if (event.target === svgElement.node()) {
          // Only respond to left mouse button clicks
          if (event.button !== 0) return;

          // Set dragging state and record initial mouse position
          setIsDragging(true);
          setDragStart({
            x: event.clientX,
            y: event.clientY,
          });

          // Change cursor to indicate active dragging
          svgElement.style("cursor", "grabbing");
        }
      };

      // Handle mouse move event during dragging
      const handleMouseMove = (event: MouseEvent) => {
        // Exit early if not dragging or no current transform exists
        if (!isDragging || !currentTransform) return;

        // Calculate movement delta from last position
        const dx = event.clientX - dragStart.x;
        const dy = event.clientY - dragStart.y;

        // Create new transform by adding the movement delta to current position
        const newTransform = d3.zoomIdentity
          .translate(currentTransform.x + dx, currentTransform.y + dy)
          .scale(currentTransform.k);

        // Apply the new transform to the visualization group
        // The transform includes: centering, margin offset, translation, and scaling
        g.attr(
          "transform",
          `translate(${centerX}, ${margin.top}) translate(${newTransform.x}, ${newTransform.y}) scale(${newTransform.k})`,
        );

        // Update drag start position for next move calculation
        setDragStart({
          x: event.clientX,
          y: event.clientY,
        });

        // Update the current transform state
        setCurrentTransform(newTransform);
      };

      // Handle mouse up event to end dragging
      const handleMouseUp = () => {
        setIsDragging(false);
        // Reset cursor to default grab state
        svgElement.style("cursor", "grab");
      };

      // Handle mouse wheel event for zooming
      const handleWheel = (event: WheelEvent) => {
        // Prevent default browser scroll behavior
        event.preventDefault();

        // Exit early if no current transform exists
        if (!currentTransform) return;

        // Calculate zoom direction and amount
        const delta = -event.deltaY; // Negative to make scroll up = zoom in
        const zoomFactor = 0.05; // Zoom sensitivity
        const scale =
          currentTransform.k * (1 + (delta > 0 ? zoomFactor : -zoomFactor));

        // Clamp zoom scale between 0.25x and 2x
        const newScale = Math.max(0.25, Math.min(2, scale));

        // Get mouse position relative to SVG element for zoom center point
        const svgRect = svgRef.current!.getBoundingClientRect();
        const mouseX = event.clientX - svgRect.left;
        const mouseY = event.clientY - svgRect.top;

        // Convert mouse position to visualization coordinate space
        const x = mouseX - centerX;
        const y = mouseY - margin.top;

        // Only apply zoom if scale actually changed (within bounds)
        if (newScale !== currentTransform.k) {
          // Calculate scale ratio for position adjustment
          const scaleRatio = newScale / currentTransform.k;

          // Create new transform that zooms around the mouse cursor position
          // This keeps the point under the mouse cursor fixed during zoom
          const newTransform = d3.zoomIdentity
            .translate(
              x - (x - currentTransform.x) * scaleRatio,
              y - (y - currentTransform.y) * scaleRatio,
            )
            .scale(newScale);

          // Apply the new transform to the visualization
          g.attr(
            "transform",
            `translate(${centerX}, ${margin.top}) translate(${newTransform.x}, ${newTransform.y}) scale(${newTransform.k})`,
          );

          // Update state with new zoom level and transform
          setCurrentZoom(newScale);
          setCurrentTransform(newTransform);
        }
      };

      // Attach event listeners to the SVG element
      svgElement
        .on("mousedown", handleMouseDown) // Start dragging
        .on("mousemove", handleMouseMove) // Handle drag movement
        .on("mouseup", handleMouseUp) // End dragging
        .on("mouseleave", handleMouseUp) // End dragging when mouse leaves SVG
        .on("wheel", handleWheel); // Handle zoom

      // Set initial cursor style to indicate draggable
      svgElement.style("cursor", "grab");

      // Return cleanup function to remove event listeners
      return () => {
        svgElement
          .on("mousedown", null)
          .on("mousemove", null)
          .on("mouseup", null)
          .on("mouseleave", null)
          .on("wheel", null);
      };
    },
    // Dependencies: re-create handler when these values change
    [containerDimensions, isDragging, dragStart, currentTransform],
  );

  // Render the tree visualization with much better positioning
  // This is the updated renderTree function for LazyLoadView with scissors markers

  const renderTree = useCallback(() => {
    if (!svgRef.current) return;

    // Use proper typing for SVG selection
    const svgElement = d3.select<SVGSVGElement, unknown>(svgRef.current);
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

    // Use improved layout calculation function
    const layout = calculateTreeLayout(
      targetTree.tree,
      innerWidth,
      innerHeight,
    );

    // Calculate the center position in the container
    const centerX = width / 2;

    // Create main SVG group with transform already applied
    const g = svgElement
      .append("g")
      .attr("transform", `translate(${centerX}, ${margin.top})`);

    // Update gRef safely
    if (g.node()) {
      gRef.current = g.node();
    }

    setupDragHandling(svgElement);

    // Draw links with proper positioning
    g.selectAll("line")
      .data(layout.links)
      .enter()
      .append("line")
      .attr("x1", (d) => (d.source as d3.HierarchyPointNode<TreeNode>).x)
      .attr("y1", (d) => (d.source as d3.HierarchyPointNode<TreeNode>).y)
      .attr("x2", (d) => (d.target as d3.HierarchyPointNode<TreeNode>).x)
      .attr("y2", (d) => (d.target as d3.HierarchyPointNode<TreeNode>).y)
      .attr("stroke", (d) => {
        // If target node is pruned, use a lighter color
        if (d.target.data.pruned) {
          return "#d4d4d4";
        }
        return "#e9bc39";
      })
      .attr("stroke-width", 3);

    // Add scissors cut markers for pruned nodes
    g.selectAll("foreignObject.cut-marker")
      .data(layout.links)
      .enter()
      .filter((d) => !!(d.target.data.pruned && d.target.data.prunedBy))
      .append("foreignObject")
      .attr("class", "cut-marker")
      .attr(
        "x",
        (d) =>
          ((d.source as d3.HierarchyPointNode<TreeNode>).x +
            (d.target as d3.HierarchyPointNode<TreeNode>).x) /
            2 -
          12,
      )
      .attr(
        "y",
        (d) =>
          ((d.source as d3.HierarchyPointNode<TreeNode>).y +
            (d.target as d3.HierarchyPointNode<TreeNode>).y) /
            2 -
          12,
      )
      .attr("width", 24)
      .attr("height", 24)
      .attr("class", "cursor-pointer")
      .html(
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-scissors">
        <circle cx="6" cy="6" r="3"/>
        <path d="M8.12 8.12 12 12"/>
        <path d="M20 4 8.12 15.88"/>
        <circle cx="6" cy="18" r="3"/>
        <path d="M14.8 14.8 20 20"/>
      </svg>`,
      )
      .append("title")
      .text((d) => {
        // Add tooltip showing the pruning reason
        if (d.target.data.prunedBy) {
          const obj = getContentFromAssertion({
            assertion: d.target.data.prunedBy,
            candidateList,
          });
          return `[${obj.idx}] Pruned by: ${obj.text}`;
        }
        return "Pruned node";
      });

    // Create node groups with proper positioning
    const groups = g
      .selectAll("g.node")
      .data(layout.nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .classed("cursor-pointer", true)
      .on("click", function (event: MouseEvent, d) {
        event.stopPropagation();
        handleNodeClick(d.data as TreeNode, selectedTreeId);
      });

    // Add node circles
    groups
      .append("circle")
      .attr("r", NODE_RADIUS)
      .attr("fill", (d) => "white")
      .attr("stroke", (d) => "black")
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
        const node = textElement.node();

        // Check if text width exceeds maximum width and node exists
        if (node) {
          while (node.getComputedTextLength() > maxWidth && text.length > 0) {
            text = text.slice(0, -1);
            textElement.text(text + ellipsis);
          }
        }

        return textElement.text();
      })
      .append("title")
      .text((d) => {
        // Add more information to hover tooltip
        let tooltip = getSmartDisplayName(d.data.id, candidateList).shortName;

        // If node is pruned, show pruning reason
        if (d.data.pruned && d.data.prunedBy) {
          tooltip += `\nPruned by: ${
            getContentFromAssertion({
              assertion: d.data.prunedBy,
              candidateList,
            }).text
          }`;
        }

        return tooltip;
      });

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

    if (isInitialRender) {
      const optimalScale = calculateOptimalScale(layout.width, innerWidth);
      const initialTransform = createInitialTransform(optimalScale);

      if (currentTransform) {
        g.attr(
          "transform",
          `translate(${centerX}, ${margin.top}) translate(${currentTransform.x}, ${currentTransform.y}) scale(${currentTransform.k})`,
        );
      } else {
        g.attr(
          "transform",
          `translate(${centerX}, ${margin.top}) translate(${initialTransform.x}, ${initialTransform.y}) scale(${initialTransform.k})`,
        );
        setCurrentTransform(initialTransform);
        setCurrentZoom(initialTransform.k);
      }

      setIsInitialRender(false);
    } else if (currentTransform) {
      g.attr(
        "transform",
        `translate(${centerX}, ${margin.top}) translate(${currentTransform.x}, ${currentTransform.y}) scale(${currentTransform.k})`,
      );
    }
  }, [
    containerDimensions,
    defaultTrees,
    selectedTreeId,
    isFullScreen,
    calculateTreeLayout,
    handleNodeClick,
    candidateList,
    isInitialRender,
    currentTransform,
    calculateOptimalScale,
    createInitialTransform,
    setupDragHandling,
  ]);

  // Render tree or message when dependencies change
  useLayoutEffect(() => {
    if (defaultTrees.length > 0 && !isBigDataWinnerSelected()) {
      renderTree();
    }

    // Cleanup function
    return () => {
      if (svgRef.current) {
        d3.select(svgRef.current).on(".zoom", null);
      }
    };
  }, [renderTree, defaultTrees.length, isBigDataWinnerSelected, renderKey]);

  // Handle zoom level changes
  const handleZoomChange = useCallback(
    (scaleFactor: number) => {
      if (!currentTransform || !gRef.current) return;

      // Get the current transform position, keep the position unchanged, only change the scale factor
      const newTransform = d3.zoomIdentity
        .translate(currentTransform.x, currentTransform.y)
        .scale(scaleFactor);

      const width = containerDimensions.width || dimensions.width;
      const centerX = width / 2;
      const margin = { top: 30, right: 40, bottom: 30, left: 40 };

      d3.select(gRef.current)
        .transition()
        .duration(300)
        .attr(
          "transform",
          `translate(${centerX}, ${margin.top}) translate(${newTransform.x}, ${newTransform.y}) scale(${newTransform.k})`,
        );

      setCurrentZoom(scaleFactor);
      setCurrentTransform(newTransform);
    },
    [currentTransform, containerDimensions],
  );

  // Function to handle double click for resetting view
  const handleDoubleClick = useCallback(() => {
    handleResetView();
  }, []);

  // Reset view to fit all nodes
  const handleResetView = useCallback(() => {
    if (!gRef.current) return;

    // Get container dimensions with fallback to default dimensions
    const width = containerDimensions.width || dimensions.width;
    const height = containerDimensions.height || dimensions.height;
    const margin = { top: 30, right: 40, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const centerX = width / 2;

    // Find the target tree based on selected tree ID
    const targetTree = defaultTrees.find(
      (tree) => tree.rootId === selectedTreeId,
    );

    if (!targetTree) return;

    // Calculate tree layout with available dimensions
    const layout = calculateTreeLayout(
      targetTree.tree,
      innerWidth,
      height - margin.top - margin.bottom,
    );

    // Calculate optimal scale ratio to fit the tree
    const optimalScale = calculateOptimalScale(layout.width, innerWidth);

    // Create initial transform configuration
    const initialTransform = createInitialTransform(optimalScale);

    // Apply transform with smooth transition animation
    d3.select(gRef.current)
      .transition()
      .duration(500)
      .attr(
        "transform",
        `translate(${centerX}, ${margin.top}) translate(${initialTransform.x}, ${initialTransform.y}) scale(${initialTransform.k})`,
      );

    // Update zoom and transform state
    setCurrentZoom(optimalScale);
    setCurrentTransform(initialTransform);

    // Force re-render of the view
    setRenderKey((prev) => prev + 1);
  }, [
    containerDimensions,
    calculateTreeLayout,
    defaultTrees,
    selectedTreeId,
    calculateOptimalScale,
    createInitialTransform,
  ]);

  // Toggle fullscreen with improved handling
  const toggleFullScreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!isFullScreen) {
      // Enter fullscreen
      try {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).mozRequestFullScreen) {
          (containerRef.current as any).mozRequestFullScreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          (containerRef.current as any).webkitRequestFullscreen();
        } else if ((containerRef.current as any).msRequestFullscreen) {
          (containerRef.current as any).msRequestFullscreen();
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
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error attempting to exit fullscreen: ${error.message}`);
        // Force the state update even if the API call failed
        setIsFullScreen(false);
      }
    }
  }, [isFullScreen]);

  // Listen for fullscreen change events with improved handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      // Check for fullscreen element across different browsers
      const isInFullScreen = !!(
        document.fullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
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
  const renderWinnerMessage = useCallback(() => {
    if (!winnerInfo) return null;

    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl shadow-sm">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            You have selected the Winner - {winnerInfo.name}
          </h3>
          <p className="text-gray-700 mb-4">
            Since {winnerInfo.name} wasn’t eliminated, <br />
            their tree simply follows the active path to victory.
            <br />
            To simplify the view, we’ve hidden the winner’s tree.
          </p>
          <p className="text-gray-700 mb-6">
            If you’re curious, try selecting another candidate to explore how
            they were eliminated along the way.
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
  }, [winnerInfo, candidateList, setSelectedTreeId]);

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
            ? "fixed inset-0 bg-background z-10"
            : "w-full h-96 flex-grow overflow-hidden"
        }`}
        data-tour="tree-view"
        onDoubleClick={handleDoubleClick}
      >
        {isBigDataWinnerSelected() ? (
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

        {isFullScreen && !isBigDataWinnerSelected() && (
          <div className="fixed bottom-0 left-0 right-0 flex justify-between items-center px-4 py-2 border-t bg-background z-20">
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
                  {[0.25, 0.5, 0.75, 1, 1.5, 2].map((zoom) => (
                    <DropdownMenuItem
                      key={zoom}
                      onClick={() => handleZoomChange(zoom)}
                    >
                      {zoom * 100}%
                    </DropdownMenuItem>
                  ))}
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
            <Button
              variant="outline"
              onClick={expandAllNodes}
              data-tour="expand-all-button"
            >
              <ExpandIcon className="h-4 w-4 mr-2" />
              Expand All
            </Button>
          </div>
        )}
      </div>

      {/* Controls when not in fullscreen mode */}
      {!isFullScreen && !isBigDataWinnerSelected() && (
        <div className="flex justify-between items-center mt-2 px-4 py-2 border-t bg-background">
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
                {[0.25, 0.5, 0.75, 1, 1.5, 2].map((zoom) => (
                  <DropdownMenuItem
                    key={zoom}
                    onClick={() => handleZoomChange(zoom)}
                  >
                    {zoom * 100}%
                  </DropdownMenuItem>
                ))}
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
          <Button
            variant="outline"
            onClick={expandAllNodes}
            data-tour="expand-all-button"
          >
            <ExpandIcon className="h-4 w-4 mr-2" />
            Expand All
          </Button>
        </div>
      )}
    </div>
  );
}

export default LazyLoadView;
