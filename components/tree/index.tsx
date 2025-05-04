"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Switch } from "@/components/ui/switch";
import { toggleChildren, TreeNode } from "./helper";
import { Button } from "../ui/button";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Minus,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import useMultiWinnerDataStore from "@/store/multi-winner-data";
import { getSmartDisplayName } from "@/components/ui/avatar";

interface TreeProps {
  data: TreeNode;
  nextComponent: React.ReactNode;
  backComponent: React.ReactNode;
  resetHiddenNodes: boolean;
  onResetComplete: () => void;
  onNodeCut: () => void;
}

// Adjusted dimensions with more width to prevent horizontal crowding
const dimensions = { width: 800, height: 500 };

// Node sizing constants
const NODE_RADIUS = 18;
const NODE_MARGIN = 15; // Minimum margin between nodes

export default function Tree({
  data,
  nextComponent,
  backComponent,
  resetHiddenNodes,
  onResetComplete,
  onNodeCut,
}: TreeProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<
    SVGSVGElement,
    unknown
  > | null>(null);

  const [treeData, setTreeData] = useState<TreeNode>(data);
  const [currentZoom, setCurrentZoom] = useState<number>(1);
  const [currentTransform, setCurrentTransform] =
    useState<d3.ZoomTransform | null>(null);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  // Reset hidden nodes when requested
  useEffect(() => {
    if (resetHiddenNodes) {
      const resetNodes = (node: TreeNode) => {
        node.hide = false;

        // Handle visible children
        if (node.children) {
          node.children.forEach(resetNodes);
        }

        // Also handle collapsed children
        if (node._children) {
          node._children.forEach(resetNodes);
        }
      };

      resetNodes(treeData);
      setTreeData({ ...treeData });
      onResetComplete();
    }
  }, [resetHiddenNodes, treeData, onResetComplete]);

  // Mark node and its children as hidden
  function markNodeAndChildrenAsHidden(node: TreeNode) {
    node.hide = true;
    if (node.children) {
      node.children.forEach((child) => markNodeAndChildrenAsHidden(child));
    }
    setTreeData({ ...treeData });
    onNodeCut();
  }

  // Toggle node children with view state preservation
  function handleNodeToggle(node: TreeNode) {
    // Store current transform before toggling
    if (svgRef.current && zoomBehaviorRef.current) {
      const transform = d3.zoomTransform(svgRef.current);
      setCurrentTransform(transform);
    }

    // Toggle node children
    toggleChildren(node);
    setTreeData({ ...treeData });
  }

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

  const countVisibleNodesAtDepth = (
    node: TreeNode,
    depth = 0,
    counts: Record<number, number> = {},
  ): Record<number, number> => {
    if (node.hide) return counts;

    counts[depth] = (counts[depth] || 0) + 1;

    if (node.children) {
      node.children.forEach((child) =>
        countVisibleNodesAtDepth(child, depth + 1, counts),
      );
    }

    return counts;
  };

  // Main effect for tree rendering
  useEffect(() => {
    if (svgRef.current) {
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

      // Count number of visible nodes at each level for better spacing
      const nodeCounts = countVisibleNodesAtDepth(treeData);
      const maxNodesAtAnyLevel = Math.max(...Object.values(nodeCounts));

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

      const root = d3.hierarchy(treeData);

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

      const g = svgElement
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
      gRef.current = g.node();

      // Draw links
      g.selectAll("line")
        .data(links.filter((link) => !link.target.data.hide))
        .enter()
        .append("line")
        .attr("x1", (d) => (d.source as d3.HierarchyPointNode<TreeNode>).x)
        .attr("y1", (d) => (d.source as d3.HierarchyPointNode<TreeNode>).y)
        .attr("x2", (d) => (d.target as d3.HierarchyPointNode<TreeNode>).x)
        .attr("y2", (d) => (d.target as d3.HierarchyPointNode<TreeNode>).y)
        .attr("stroke", (d) =>
          d.source.data.eliminated ||
          d.target.data.eliminated ||
          d.source.data.cut ||
          d.target.data.cut
            ? "#d4d4d4"
            : "#e9bc39",
        )
        .attr("stroke-width", 3);

      // Add cut markers (scissors)
      g.selectAll("foreignObject.cut-marker")
        .data(links)
        .enter()
        .filter(
          (d: d3.HierarchyLink<TreeNode>) =>
            !!d.target.data.cut && !d.target.data.hide,
        )
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
          `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-scissors">
          <circle cx="6" cy="6" r="3"/>
          <path d="M8.12 8.12 12 12"/>
          <path d="M20 4 8.12 15.88"/>
          <circle cx="6" cy="18" r="3"/>
          <path d="M14.8 14.8 20 20"/>
        </svg>
      `,
        )
        .on("click", (event, d) => {
          markNodeAndChildrenAsHidden(d.target.data);
        });

      // Create node groups
      const groups = g
        .selectAll("g.node")
        .data(nodes.filter((node) => !node.data.hide))
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${d.x},${d.y})`)
        .classed("cursor-pointer", true)
        .on("click", (event, d) => {
          handleNodeToggle(d.data);
        });

      // Add node circles
      groups
        .append("circle")
        .attr("r", NODE_RADIUS)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 1);

      // Add node text with improved text handling
      groups
        .append("text")
        .attr("y", 3)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "black")
        .text(function (d) {
          const { candidateList } = useMultiWinnerDataStore.getState();
          const { shortName } = getSmartDisplayName(d.data.id, candidateList);
          const maxWidth = 35;
          let text = shortName;
          const ellipsis = "..";

          // Create temporary text element to measure width
          let textElement = d3.select(this).text(text);

          // Check if text width exceeds maximum width
          while (
            textElement.node()!.getComputedTextLength() > maxWidth &&
            text.length > 0
          ) {
            text = text.slice(0, -1);
            textElement.text(text + ellipsis);
          }

          return textElement.text();
        })
        .append("title")
        .text(function (d) {
          const { candidateList } = useMultiWinnerDataStore.getState();
          const { explanation } = getSmartDisplayName(d.data.id, candidateList);
          return explanation || d.data.name;
        });

      // Add collapsed node count indicator
      groups
        .filter((d) => !!d.data.collapsedCount)
        .append("circle")
        .attr("cy", 54)
        .attr("r", 12)
        .attr("fill", "#e77d00")
        .attr("stroke-width", 1);

      groups
        .filter((d) => !!d.data.collapsedCount)
        .append("text")
        .attr("y", 60)
        .attr("text-anchor", "middle")
        .attr("class", "text-lg text-black")
        .text((d) => (d.data.collapsedCount ? `${d.data.collapsedCount}` : ""));

      // Add collapsible/expandable indicators
      groups
        .filter(
          (d) =>
            (d.data.children && d.data.children.length > 0) ||
            (d.data._children && d.data._children.length > 0),
        )
        .append("circle")
        .attr("r", 8)
        .attr("cy", NODE_RADIUS + 15)
        .attr("fill", "#f0f0f0")
        .attr("stroke", "#888")
        .attr("stroke-width", 1);

      groups
        .filter((d) => d.data.children && d.data.children.length > 0)
        .append("text")
        .attr("text-anchor", "middle")
        .attr("y", NODE_RADIUS + 18)
        .attr("font-size", "12px")
        .text("-");

      groups
        .filter((d) => d.data._children && d.data._children.length > 0)
        .append("text")
        .attr("text-anchor", "middle")
        .attr("y", NODE_RADIUS + 18)
        .attr("font-size", "12px")
        .text("+");

      // Add zoom behavior
      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.25, 2])
        .on("zoom", (event) => {
          d3.select(gRef.current).attr("transform", event.transform.toString());
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

      return () => {
        svgElement.on(".zoom", null);
      };
    }
  }, [treeData, containerDimensions]);

  const handleZoomChange = (scaleFactor: number) => {
    if (zoomBehaviorRef.current && svgRef.current) {
      const svgElement = d3.select(svgRef.current);

      // Get current transform to maintain center point during zoom
      const transform = d3.zoomTransform(svgElement.node()!);

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

  // Reset view to fit all nodes with the same settings as initial view
  const handleResetView = () => {
    if (zoomBehaviorRef.current && svgRef.current) {
      const svgElement = d3.select(svgRef.current);
      const width = containerDimensions.width || dimensions.width;
      const height = containerDimensions.height || dimensions.height;

      // Use the same margin configuration as in the rendering effect
      const margin = { top: 30, right: 40, bottom: 30, left: 40 };
      const innerWidth = width - margin.left - margin.right;

      // Create hierarchy for the current tree state
      const root = d3.hierarchy(treeData);

      // Calculate the node spacing exactly as in the rendering logic
      const nodeCounts = countVisibleNodesAtDepth(treeData);
      const maxNodesAtAnyLevel = Math.max(...Object.values(nodeCounts));
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

  // Toggle fullscreen
  const toggleFullScreen = () => {
    if (!containerRef.current) return;

    if (!isFullScreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current
          .requestFullscreen()
          .then(() => setIsFullScreen(true))
          .catch((err) =>
            console.error(
              `Error attempting to enable fullscreen: ${err.message}`,
            ),
          );
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        (containerRef.current as any).webkitRequestFullscreen();
        setIsFullScreen(true);
      } else if ((containerRef.current as any).msRequestFullscreen) {
        (containerRef.current as any).msRequestFullscreen();
        setIsFullScreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document
          .exitFullscreen()
          .then(() => setIsFullScreen(false))
          .catch((err) =>
            console.error(
              `Error attempting to exit fullscreen: ${err.message}`,
            ),
          );
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
        setIsFullScreen(false);
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

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
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col ${isFullScreen ? "h-screen bg-white" : "h-full"} overflow-hidden`}
      data-tour="seventh-step"
    >
      <div className="flex-grow relative overflow-hidden">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="overflow-hidden"
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
      <div
        className={`flex justify-between items-center mt-2 ${isFullScreen ? "p-2 border-t" : ""}`}
      >
        {!isFullScreen && backComponent}
        <div
          className={`flex items-center space-x-2 ${isFullScreen ? "mx-auto" : ""}`}
        >
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
            title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullScreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </Button>
        </div>
        {!isFullScreen && nextComponent}
      </div>
    </div>
  );
}
