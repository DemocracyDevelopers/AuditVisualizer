"use client";
import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import * as d3 from "d3";
import { toggleChildren, TreeNode } from "./helper";
import { Button } from "../ui/button";
import { Maximize, Minimize, Minus, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

// Node sizing constants
const NODE_RADIUS = 18;
const NODE_MARGIN = 15;

// Tree component with instant rendering and proper centering
export default function Tree({
  data,
  nextComponent,
  backComponent,
  resetHiddenNodes,
  onResetComplete,
  onNodeCut,
}: TreeProps) {
  // Refs
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // State
  const [treeData, setTreeData] = useState<TreeNode>(data);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [currentScale, setCurrentScale] = useState(0.8);
  const [currentTranslate, setCurrentTranslate] = useState({ x: 0, y: 0 });
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [renderKey, setRenderKey] = useState(0);

  // Initialize tree with stored settings if available
  useEffect(() => {
    try {
      const savedState = sessionStorage.getItem("treeState");
      if (savedState) {
        const { scale, translate } = JSON.parse(savedState);
        setCurrentScale(scale);
        setCurrentTranslate(translate);
        sessionStorage.removeItem("treeState");
      }
    } catch (e) {
      console.error("Failed to restore tree state:", e);
    }

    // Save state before unload
    const handleBeforeUnload = () => {
      try {
        sessionStorage.setItem(
          "treeState",
          JSON.stringify({
            scale: currentScale,
            translate: currentTranslate,
          }),
        );
      } catch (e) {
        console.error("Failed to save tree state:", e);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentScale, currentTranslate]);

  // Calculate tree layout data with proper centering
  const calculateTreeLayout = (
    treeData: TreeNode,
    width: number,
    height: number,
  ) => {
    // Create hierarchy
    const root = d3.hierarchy(treeData);

    // Count visible nodes at each depth
    const nodeCounts: Record<number, number> = {};
    root.each((node) => {
      if (!node.data.hide) {
        nodeCounts[node.depth] = (nodeCounts[node.depth] || 0) + 1;
      }
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
      node.y = node.depth * 100 - 20; // 整体上移20个单位
    });

    // Calculate the min and max x values to determine horizontal bounds
    const descendants = treeDataLayout
      .descendants()
      .filter((node) => !node.data.hide);
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
    const xOffset = -((maxX + minX) / 2); // 将树居中到原点(0,0)

    // Apply offset to all nodes
    descendants.forEach((node) => {
      node.x += xOffset;
    });

    return {
      nodes: descendants,
      links: treeDataLayout.links().filter((link) => !link.target.data.hide),
      width: treeWidth, // 树宽度用于缩放计算
      center: { x: 0, y: 0 }, // 树中心现在在原点
    };
  };

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: isFullScreen ? window.innerWidth : width,
          height: isFullScreen ? window.innerHeight - 60 : height,
        });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, [isFullScreen]);

  // Handle node toggle
  const handleNodeToggle = (node: TreeNode) => {
    toggleChildren(node);
    setTreeData({ ...treeData });
  };

  // Mark node and children as hidden
  const markNodeAndChildrenAsHidden = (node: TreeNode) => {
    node.hide = true;
    if (node.children) {
      node.children.forEach((child) => markNodeAndChildrenAsHidden(child));
    }
    setTreeData({ ...treeData });
    onNodeCut();
  };

  // Reset hidden nodes
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
  }, [resetHiddenNodes, onResetComplete]);

  // Add zoom and pan functionality
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Setup mouse event handlers for manual panning
    const handleMouseDown = (event: MouseEvent) => {
      if (event.button !== 0) return; // Only handle left mouse button

      setIsDragging(true);
      setDragStart({
        x: event.clientX,
        y: event.clientY,
      });

      svg.style("cursor", "grabbing");
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;

      const dx = event.clientX - dragStart.x;
      const dy = event.clientY - dragStart.y;

      setCurrentTranslate((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      setDragStart({
        x: event.clientX,
        y: event.clientY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      svg.style("cursor", "grab");
    };

    // Handle mouse wheel for zooming
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      // Calculate zoom factor
      const delta = -event.deltaY;
      const zoomFactor = 0.05;
      const scale = currentScale * (1 + (delta > 0 ? zoomFactor : -zoomFactor));

      // Limit scale between 0.25 and 2
      const newScale = Math.max(0.25, Math.min(2, scale));

      // Get mouse position relative to SVG
      const svgRect = svgRef.current!.getBoundingClientRect();
      const mouseX = event.clientX - svgRect.left;
      const mouseY = event.clientY - svgRect.top;

      // Calculate new translation to zoom toward mouse position
      const margin = { top: 30, right: 40, bottom: 30, left: 40 };
      const x = mouseX - margin.left;
      const y = mouseY - margin.top;

      // Adjust translation based on scale change and mouse position
      if (newScale !== currentScale) {
        const scaleRatio = newScale / currentScale;

        setCurrentTranslate((prev) => ({
          x: x - (x - prev.x) * scaleRatio,
          y: y - (y - prev.y) * scaleRatio,
        }));

        setCurrentScale(newScale);
      }
    };

    // Add event listeners
    svg.on("mousedown", handleMouseDown);
    svg.on("mousemove", handleMouseMove);
    svg.on("mouseup", handleMouseUp);
    svg.on("mouseleave", handleMouseUp);
    svg.on("wheel", handleWheel);

    // Set initial cursor style
    svg.style("cursor", "grab");

    // Clean up event listeners
    return () => {
      svg.on("mousedown", null);
      svg.on("mousemove", null);
      svg.on("mouseup", null);
      svg.on("mouseleave", null);
      svg.on("wheel", null);
    };
  }, [isDragging, dragStart, currentScale]);

  // Handle zoom controls
  const handleZoomChange = (newScale: number) => {
    setCurrentScale(newScale);
  };

  // Reset view with proper centering
  const handleResetView = () => {
    const { width } = dimensions;
    const layout = calculateTreeLayout(treeData, width, dimensions.height);

    // Calculate optimal scale
    let optimalScale = 0.8; // Default scale
    if (layout.nodes.length > 0 && layout.width > 0) {
      optimalScale = Math.min(width / (layout.width * 1.2), 0.9);
    }

    // Apply centered positioning
    setCurrentScale(optimalScale);
    setCurrentTranslate({ x: 0, y: 10 });

    // Force re-render with new layout
    setRenderKey((prev) => prev + 1);
  };

  // Calculate initial optimal scale on first render
  useEffect(() => {
    if (isInitialRender && dimensions.width > 0) {
      handleResetView();
      setIsInitialRender(false);
    }
  }, [dimensions, isInitialRender]);

  // Function to handle double click for resetting view
  const handleDoubleClick = () => {
    handleResetView();
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
            console.error(`Error enabling fullscreen: ${err.message}`),
          );
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        (containerRef.current as any).webkitRequestFullscreen();
        setIsFullScreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document
          .exitFullscreen()
          .then(() => setIsFullScreen(false))
          .catch((err) =>
            console.error(`Error exiting fullscreen: ${err.message}`),
          );
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  // Fullscreen change event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
    };
  }, []);

  // Use synchronous layoutEffect to avoid flickering
  useLayoutEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const margin = { top: 30, right: 40, bottom: 30, left: 40 };
    const innerWidth = dimensions.width - margin.left - margin.right;
    const innerHeight = dimensions.height - margin.top - margin.bottom;

    // Calculate centered tree layout
    const layout = calculateTreeLayout(treeData, innerWidth, innerHeight);

    // Create main svg element with immediate rendering
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Calculate the center position in the container
    const centerX = dimensions.width / 2;

    // Create group with transform already applied
    // 首先应用整体居中变换，然后应用用户的平移，最后应用缩放
    const g = svg
      .append("g")
      .attr(
        "transform",
        `translate(${centerX}, ${margin.top}) translate(${currentTranslate.x}, ${currentTranslate.y}) scale(${currentScale})`,
      );

    // Draw links immediately
    g.selectAll("line")
      .data(layout.links)
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

    // Add cut markers
    g.selectAll("foreignObject.cut-marker")
      .data(layout.links)
      .enter()
      .filter((d) => !!d.target.data.cut && !d.target.data.hide)
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
      .on("click", (event, d) => {
        event.stopPropagation();
        markNodeAndChildrenAsHidden(d.target.data);
      });

    // Create node groups
    const groups = g
      .selectAll("g.node")
      .data(layout.nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .classed("cursor-pointer", true)
      .on("click", (event, d) => {
        event.stopPropagation();
        handleNodeToggle(d.data);
      });

    // Add node circles
    groups
      .append("circle")
      .attr("r", NODE_RADIUS)
      .attr("fill", "white")
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    // Add node text
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
        const { explanation, shortName } = getSmartDisplayName(
          d.data.id,
          candidateList,
        );
        return explanation || shortName; //这里的返回值应是shortName kwj 2025/5/7
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

    // REMOVED: The expandable/collapsible indicators (circles with + and - symbols)
    // The following 3 blocks have been removed:
    // 1. The circle background for the +/- indicator
    // 2. The "-" text for collapsible nodes
    // 3. The "+" text for expandable nodes
  }, [treeData, dimensions, currentScale, currentTranslate, renderKey]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col ${isFullScreen ? "h-screen bg-white" : "h-full"} overflow-hidden relative`}
      data-tour="seventh-step"
    >
      <div className="flex-grow relative overflow-hidden">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="overflow-hidden"
          preserveAspectRatio="xMidYMid meet"
          onDoubleClick={handleDoubleClick}
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
            onClick={() => handleZoomChange(currentScale - 0.1)}
            disabled={currentScale <= 0.25}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {Math.round(currentScale * 100)}%
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
            onClick={() => handleZoomChange(currentScale + 0.1)}
            disabled={currentScale >= 2}
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
