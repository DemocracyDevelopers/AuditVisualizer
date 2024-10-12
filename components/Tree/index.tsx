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

interface TreeProps {
  data: TreeNode;
  nextComponent: React.ReactNode;
  backComponent: React.ReactNode;
}
const dimensions = { width: 400, height: 400 };

export default function Tree({
  data,
  nextComponent,
  backComponent,
}: TreeProps) {
  // TODO: 应该在这个文件里面操作cut的操作,这样每次通过key就重新渲染,重置操作了
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<
    SVGSVGElement,
    unknown
  > | null>(null); // Ref to store zoom behavior
  const [treeData, setTreeData] = useState(data);
  const [currentZoom, setCurrentZoom] = useState<number>(1);

  useEffect(() => {
    if (svgRef.current) {
      const svgElement = d3.select(svgRef.current);
      svgElement.selectAll("*").remove();

      const { width, height } = dimensions;
      const margin = { top: 20, right: 20, bottom: 20, left: 20 };

      const treeLayout = d3
        .tree<TreeNode>()
        .size([
          height - margin.top - margin.bottom - 10,
          width - margin.left - margin.right - 10,
        ]);

      const root = d3.hierarchy(treeData);
      const treeDataLayout = treeLayout(root);

      const nodes = treeDataLayout.descendants();
      const links = treeDataLayout.links();

      const g = svgElement
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
      gRef.current = g.node();

      // Draw links
      g.selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("x1", (d) => (d.source as d3.HierarchyPointNode<TreeNode>).x)
        .attr("y1", (d) => (d.source as d3.HierarchyPointNode<TreeNode>).y)
        .attr("x2", (d) => (d.target as d3.HierarchyPointNode<TreeNode>).x)
        .attr("y2", (d) => (d.target as d3.HierarchyPointNode<TreeNode>).y)
        // .attr("stroke", "#e9bc39")
        .attr("stroke", (d) =>
          d.source.data.cut || d.target.data.cut ? "#d4d4d4" : "#e9bc39",
        ) // Set stroke to black if cut is true
        .attr("stroke-width", 3);

      // 暂时先用X
      g.selectAll("text.cut-marker")
        .data(links)
        .enter()
        .filter(
          (d: d3.HierarchyLink<TreeNode>) =>
            !!(d.source.data.cut || d.target.data.cut),
        ) // Only add 'X' for cut links
        .append("text")
        .attr("class", "cut-marker")
        .attr(
          "x",
          (d) =>
            ((d.source as d3.HierarchyPointNode<TreeNode>).x +
              (d.target as d3.HierarchyPointNode<TreeNode>).x) /
            2,
        )
        .attr(
          "y",
          (d) =>
            ((d.source as d3.HierarchyPointNode<TreeNode>).y +
              (d.target as d3.HierarchyPointNode<TreeNode>).y) /
            2,
        )
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("fill", "red")
        .text("X");

      // Create groups for each node
      const groups = g
        .selectAll("g")
        .data(nodes)
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${d.x},${d.y})`)
        .classed("cursor-pointer", true)
        .on("click", (event, d) => {
          toggleChildren(d.data);
          setTreeData({ ...treeData });
        });

      // Add circles
      groups
        .append("circle")
        .attr("r", 18)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 2);

      // Add text
      groups
        .append("text")
        .attr("y", 3)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        // .text((d) => d.data.name);
        .text(function (d) {
          const maxWidth = 35; // 最大宽度
          let text = d.data.name;
          const ellipsis = "...";

          // 创建临时的text元素来测量宽度
          let textElement = d3.select(this).text(text);

          // 检查 textElement.node() 是否为 null
          // 如果宽度超过最大宽度，进行截断
          while (
            textElement.node()!.getComputedTextLength() > maxWidth &&
            text.length > 0
          ) {
            text = text.slice(0, -1); // 每次去掉一个字符
            textElement.text(text + ellipsis); // 加上省略号
          }

          return textElement.text();
        });

      // 添加折叠节点数量的圆形
      groups
        .filter((d) => !!d.data.collapsedCount)
        .append("circle")
        .attr("cy", 40) // 圆心y坐标
        .attr("r", 12) // 半径
        .attr("fill", "#e77d00") // 设置填充色为 #e77d00
        .attr("stroke-width", 1); // 设置圆形边框的宽度为 1

      groups
        .filter((d) => !!d.data.collapsedCount)
        .append("text")
        .attr("y", 46) // 控制折叠数量的文本位置
        .attr("text-anchor", "middle")
        .attr("class", "text-lg text-black")
        .text((d) => (d.data.collapsedCount ? `${d.data.collapsedCount}` : ""));

      // Add zoom behavior
      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.25, 1.5])
        .on("zoom", (event) => {
          d3.select(gRef.current).attr("transform", event.transform.toString());
          setCurrentZoom(event.transform.k);
        });

      svgElement.call(zoom);
      zoomBehaviorRef.current = zoom; // Save zoom behavior reference

      return () => {
        svgElement.on(".zoom", null);
      };
    }
  }, [treeData]);

  const handleZoomChange = (scaleFactor: number) => {
    if (zoomBehaviorRef.current && svgRef.current) {
      const svgElement = d3.select(svgRef.current);
      const { width, height } = dimensions;

      const transform = d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(scaleFactor)
        .translate(-width / 2, -height / 2);

      svgElement
        .transition()
        .duration(500)
        .call(zoomBehaviorRef.current.transform, transform);

      setCurrentZoom(scaleFactor);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="overflow-hidden"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid meet"
      />
      <div className="flex justify-between">
        {backComponent}
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleZoomChange(currentZoom - 0.1)}
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
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleZoomChange(currentZoom + 0.1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {nextComponent}
      </div>
    </div>
  );
}
