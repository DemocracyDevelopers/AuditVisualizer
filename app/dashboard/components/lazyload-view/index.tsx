import {
  MutableRefObject,
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

// Node sizing constants
const NODE_RADIUS = 18;
const NODE_MARGIN = 15; // Minimum margin between nodes
const dimensions = { width: 800, height: 500 }; // Increased dimensions for better spacing

// TypeScript interfaces
interface CountsObject {
  [depth: number]: number;
}

function LazyLoadView() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Updated to use SVGSVGElement instead of Element
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<
    SVGSVGElement,
    unknown
  > | null>(null);

  const [selectedTreeId, setSelectedTreeId] = useState(0);
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

  // 计算树布局数据并居中 - 提取为复用函数
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

  // 计算最佳缩放比例 - 提取为复用函数
  const calculateOptimalScale = useCallback(
    (treeWidth: number, viewportWidth: number) => {
      if (treeWidth <= 0) return 0.8; // 默认缩放
      return Math.min(viewportWidth / (treeWidth * 1.2), 0.9);
    },
    [],
  );

  // 创建初始化变换 - 提取为复用函数
  const createInitialTransform = useCallback((optimalScale: number) => {
    return d3.zoomIdentity.translate(0, 10).scale(optimalScale);
  }, []);

  // Initialize the tree data when fileData changes
  const initializeTree = useCallback(() => {
    if (fileData) {
      const trees = candidateList.map((candidate) => ({
        rootId: candidate.id,
        tree: createTreeFromFile(fileData, candidate.id),
      }));
      setSelectedTreeId(winnerInfo?.id || 0);
      setDefaultTrees(trees);
      console.log("Initial tree data:", trees, winnerInfo);
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
  }, [fileData, defaultTrees, selectedTreeId, setDefaultTrees]);

  // Check if selected tree is the winner
  const isBigDataWinnerSelected = useCallback(() => {
    return (
      winnerInfo &&
      selectedTreeId === winnerInfo.id &&
      getCandidateNumber(fileData) >= 6
    );
  }, [winnerInfo, selectedTreeId, fileData]);

  // Helper function to determine pruning type and color

  // 修复拖拽功能并添加滚轮缩放
  const setupDragHandling = useCallback(
    (svgElement: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
      const g = d3.select(gRef.current);

      // 获取中心坐标
      const width = containerDimensions.width || dimensions.width;
      const centerX = width / 2;
      const margin = { top: 30, right: 40, bottom: 30, left: 40 };

      // 设置拖拽开始处理函数
      const handleMouseDown = (event: MouseEvent) => {
        // 重要: 检查是否点击在SVG本身而不是子元素
        if (event.target === svgElement.node()) {
          if (event.button !== 0) return; // 只处理左键点击
          console.log("SVG背景被点击，开始拖拽");

          setIsDragging(true);
          setDragStart({
            x: event.clientX,
            y: event.clientY,
          });

          svgElement.style("cursor", "grabbing");
        }
      };

      // 设置拖拽移动处理函数
      const handleMouseMove = (event: MouseEvent) => {
        if (!isDragging || !currentTransform) return;

        const dx = event.clientX - dragStart.x;
        const dy = event.clientY - dragStart.y;

        // 更新变换参数
        const newTransform = d3.zoomIdentity
          .translate(currentTransform.x + dx, currentTransform.y + dy)
          .scale(currentTransform.k);

        // 应用新的变换
        g.attr(
          "transform",
          `translate(${centerX}, ${margin.top}) translate(${newTransform.x}, ${newTransform.y}) scale(${newTransform.k})`,
        );

        // 更新拖拽起始点和当前变换
        setDragStart({
          x: event.clientX,
          y: event.clientY,
        });
        setCurrentTransform(newTransform);
      };

      // 设置拖拽结束处理函数
      const handleMouseUp = () => {
        setIsDragging(false);
        svgElement.style("cursor", "grab");
      };

      // 处理滚轮缩放事件
      const handleWheel = (event: WheelEvent) => {
        event.preventDefault();

        if (!currentTransform) return;

        // 计算缩放因子
        const delta = -event.deltaY;
        const zoomFactor = 0.05;
        const scale =
          currentTransform.k * (1 + (delta > 0 ? zoomFactor : -zoomFactor));

        // 限制缩放范围在0.25到2之间
        const newScale = Math.max(0.25, Math.min(2, scale));

        // 获取鼠标相对于SVG的位置
        const svgRect = svgRef.current!.getBoundingClientRect();
        const mouseX = event.clientX - svgRect.left;
        const mouseY = event.clientY - svgRect.top;

        // 向鼠标位置缩放
        const x = mouseX - centerX;
        const y = mouseY - margin.top;

        // 根据缩放比例变化调整平移
        if (newScale !== currentTransform.k) {
          const scaleRatio = newScale / currentTransform.k;

          // 创建新变换
          const newTransform = d3.zoomIdentity
            .translate(
              x - (x - currentTransform.x) * scaleRatio,
              y - (y - currentTransform.y) * scaleRatio,
            )
            .scale(newScale);

          // 应用新变换
          g.attr(
            "transform",
            `translate(${centerX}, ${margin.top}) translate(${newTransform.x}, ${newTransform.y}) scale(${newTransform.k})`,
          );

          // 更新状态
          setCurrentZoom(newScale);
          setCurrentTransform(newTransform);
        }
      };

      // 添加事件监听器
      svgElement
        .on("mousedown", handleMouseDown)
        .on("mousemove", handleMouseMove)
        .on("mouseup", handleMouseUp)
        .on("mouseleave", handleMouseUp)
        .on("wheel", handleWheel);

      // 设置初始光标样式
      svgElement.style("cursor", "grab");

      // 返回清理函数
      return () => {
        svgElement
          .on("mousedown", null)
          .on("mousemove", null)
          .on("mouseup", null)
          .on("mouseleave", null)
          .on("wheel", null);
      };
    },
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

    // 设置拖拽处理
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
          return `Pruned by: ${getContentFromAssertion({
            assertion: d.target.data.prunedBy,
            candidateList,
          })}`;
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
        console.log("svg clicked");
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
          tooltip += `\nPruned by: ${getContentFromAssertion({
            assertion: d.data.prunedBy,
            candidateList,
          })}`;
        }

        return tooltip;
      });

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

    // 设置初始变换
    if (isInitialRender) {
      // 计算最佳缩放比例
      const optimalScale = calculateOptimalScale(layout.width, innerWidth);
      // 创建初始变换
      const initialTransform = createInitialTransform(optimalScale);

      // 应用初始变换
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
      // 应用已有的变换
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

      // 获取当前变换的位置，保持位置不变，只改变缩放比例
      const newTransform = d3.zoomIdentity
        .translate(currentTransform.x, currentTransform.y)
        .scale(scaleFactor);

      // 应用新变换
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

      // 更新状态
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

    const width = containerDimensions.width || dimensions.width;
    const height = containerDimensions.height || dimensions.height;
    const margin = { top: 30, right: 40, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const centerX = width / 2;

    // 获取当前树
    const targetTree = defaultTrees.find(
      (tree) => tree.rootId === selectedTreeId,
    );

    if (!targetTree) return;

    // 计算树布局
    const layout = calculateTreeLayout(
      targetTree.tree,
      innerWidth,
      height - margin.top - margin.bottom,
    );

    // 计算最佳缩放比例
    const optimalScale = calculateOptimalScale(layout.width, innerWidth);

    // 创建初始变换
    const initialTransform = createInitialTransform(optimalScale);

    // 应用变换
    d3.select(gRef.current)
      .transition()
      .duration(500)
      .attr(
        "transform",
        `translate(${centerX}, ${margin.top}) translate(${initialTransform.x}, ${initialTransform.y}) scale(${initialTransform.k})`,
      );

    // 更新状态
    setCurrentZoom(optimalScale);
    setCurrentTransform(initialTransform);

    // 强制重新渲染视图
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

    const { name, shortName } = getSmartDisplayName(
      winnerInfo.id,
      candidateList,
    );

    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl shadow-sm">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            You have selected the Winner - {winnerInfo.name}
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
            ? "fixed inset-0 bg-white z-10"
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
      {!isFullScreen && !isBigDataWinnerSelected() && (
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
