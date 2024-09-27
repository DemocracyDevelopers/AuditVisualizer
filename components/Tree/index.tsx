"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toggleChildren, TreeNode } from "./helper";

// Define the JSON data type

interface TreeProps {
  data: TreeNode;
}

export default function Tree({ data }: TreeProps) {
  const [zoomEnabled, setZoomEnabled] = useState<boolean>(true); // State for zoom enable/disable
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null); // Ref for the group element
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [treeData, setTreeData] = useState(data); // State for the tree data

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const parent = svgRef.current.parentElement;
        if (parent) {
          setDimensions({
            width: parent.clientWidth, // Use parent's width
            height: parent.clientHeight, // Use parent's height
          });
        }
      }
    };

    // Set dimensions initially
    handleResize();
    // Add resize event listener
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (svgRef.current) {
      const svgElement = d3.select(svgRef.current);
      svgElement.selectAll("*").remove(); // Clear previous contents

      const { width, height } = dimensions;
      const margin = { top: 20, right: 20, bottom: 20, left: 20 };

      const treeLayout = d3.tree<TreeNode>().size([
        height - margin.top - margin.bottom - 10, // 横向高度!!!
        (width - margin.left - margin.right - 150) * 0.4, // 纵向高度!!!
      ]);

      const root = d3.hierarchy(treeData);
      const treeDataLayout = treeLayout(root);

      const nodes = treeDataLayout.descendants();
      const links = treeDataLayout.links();

      const g = svgElement
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
      gRef.current = g.node(); // Save group element ref

      // Draw links
      g.selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("x1", (d) => (d.source as d3.HierarchyPointNode<TreeNode>).x)
        .attr("y1", (d) => (d.source as d3.HierarchyPointNode<TreeNode>).y)
        .attr("x2", (d) => (d.target as d3.HierarchyPointNode<TreeNode>).x)
        .attr("y2", (d) => (d.target as d3.HierarchyPointNode<TreeNode>).y)
        .attr("stroke", "gray");

      //  创建组以便绑定事件
      const groups = g
        .selectAll("g")
        .data(nodes)
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${d.x},${d.y})`)
        .classed("cursor-pointer", true) // 添加 Tailwind 的 cursor-pointer 类
        .on("click", (event, d) => {
          toggleChildren(d.data); // Toggle children on click
          setTreeData({ ...treeData }); // Re-render tree with updated data
        });

      // 添加圆形
      groups
        .append("circle")
        .attr("r", 18) // 圆的半径
        .attr("fill", "white") // 设置为空心
        .attr("stroke", "black") // 圆的边框颜色
        .attr("stroke-width", 2); // 边框宽度

      // 添加文本
      groups
        .append("text")
        .attr("y", 3) // 让文本在圆的中央对齐
        .attr("text-anchor", "middle")
        .attr("font-size", "10px") // 字体大小
        .text((d) => d.data.name);

      // 添加折叠节点数量的圆形
      groups
        .filter((d) => !!d.data.collapsedCount)
        .append("circle")
        .attr("cy", 40) // 圆心y坐标
        .attr("r", 12) // 半径
        .attr("fill", "#e77d00") // 设置填充色为 #e77d00
        .attr("stroke-width", 1); // 设置圆形边框的宽度

      // 添加折叠节点数量
      groups
        .filter((d) => !!d.data.collapsedCount)
        .append("text")
        .attr("y", 46) // 控制折叠数量的文本位置
        .attr("text-anchor", "middle")
        .attr("class", "text-lg text-black")
        .text((d) => (d.data.collapsedCount ? `${d.data.collapsedCount}` : ""));

      // Create zoom behavior
      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.5, 2])
        .on("zoom", (event) => {
          if (zoomEnabled) {
            d3.select(gRef.current).attr(
              "transform",
              event.transform.toString(),
            );
          }
        });

      svgElement.call(zoom);

      // Cleanup function to prevent memory leaks
      return () => {
        svgElement.on(".zoom", null);
      };
    }
  }, [treeData, zoomEnabled, dimensions]);

  return (
    <Card className="w-3/4 h-[400px]">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div>Process Explores</div>
          <Button size="sm">
            Save
            <Download className="ml-1 h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <div className="flex flex-col h-full">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="overflow-hidden"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          preserveAspectRatio="xMidYMid meet"
        />
        <div className="flex items-center h-8 mt-2">
          <span>Enable Zoom</span>
          <Switch
            className="ml-2"
            checked={zoomEnabled}
            onCheckedChange={setZoomEnabled}
          />
        </div>
      </div>
    </Card>
  );
}
