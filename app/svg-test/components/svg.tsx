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
import { Download, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// 定义 JSON 数据的类型
interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface TreeProps {
  data: TreeNode;
}

export default function Tree({ data }: TreeProps) {
  const [zoomEnabled, setZoomEnabled] = useState<boolean>(true); // 状态管理缩放功能的启用/禁用
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null); // 通过 ref 访问群组元素
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const parent = svgRef.current.parentElement;
        if (parent) {
          setDimensions({
            // width: parent.clientWidth,
            width: 400,
            // height: parent.clientHeight,
            height: 300,
          });
        }
      }
    };

    // 初始化时设置尺寸
    handleResize();
    // 监听窗口大小变化
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (svgRef.current) {
      const svgElement = d3.select(svgRef.current);
      svgElement.selectAll("*").remove(); // 清空之前的内容

      const { width, height } = dimensions;
      const margin = { top: 20, right: 20, bottom: 20, left: 20 };

      const treeLayout = d3
        .tree<TreeNode>()
        .size([
          height - margin.top - margin.bottom,
          width - margin.left - margin.right,
        ]);

      const root = d3.hierarchy(data);
      const treeData = treeLayout(root);

      const nodes = treeData.descendants();
      const links = treeData.links();

      const g = svgElement
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
      gRef.current = g.node(); // 保存群组元素的引用

      // 绘制链接
      g.selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("x1", (d) => (d.source as d3.HierarchyPointNode<TreeNode>).x)
        .attr("y1", (d) => (d.source as d3.HierarchyPointNode<TreeNode>).y)
        .attr("x2", (d) => (d.target as d3.HierarchyPointNode<TreeNode>).x)
        .attr("y2", (d) => (d.target as d3.HierarchyPointNode<TreeNode>).y)
        .attr("stroke", "gray");

      // 绘制节点
      g.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", 5)
        .attr("fill", "black");

      // 绘制节点标签
      g.selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("x", (d) => d.x + 6)
        .attr("y", (d) => d.y + 3)
        .text((d) => d.data.name);

      // 创建缩放行为
      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.5, 2])
        .on("zoom", (event) => {
          if (zoomEnabled) {
            d3.select(gRef.current).attr("transform", event.transform);
          }
        });

      svgElement.call(zoom);

      // 清理函数，避免内存泄漏
      return () => {
        svgElement.on(".zoom", null);
      };
    }
  }, [data, zoomEnabled, dimensions]);
  console.log("render");

  return (
    <Card className="w-3/4 h-[400px] ">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div>Process Explores</div>
          <Button size="sm">
            Save
            <Download className="ml-1 h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <UserRound />
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
