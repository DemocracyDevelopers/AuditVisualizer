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

// Define the JSON data type
interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface TreeProps {
  data: TreeNode;
}

export default function Tree({ data }: TreeProps) {
  const [zoomEnabled, setZoomEnabled] = useState<boolean>(true); // State for zoom enable/disable
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null); // Ref for the group element
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

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

      // Draw nodes circles
      // 绘制节点
      // g.selectAll("circle")
      //   .data(nodes)
      //   .enter()
      //   .append("circle")
      //   .attr("cx", (d) => d.x)
      //   .attr("cy", (d) => d.y)
      //   .attr("r", 5)
      //   .attr("fill", "black");

      g.selectAll("foreignObject")
        .data(nodes)
        .enter()
        .append("foreignObject")
        .attr("x", (d) => d.x - 12) // Adjust position so the icon is centered
        .attr("y", (d) => d.y - 12)
        .attr("width", 24)
        .attr("height", 24)
        .html(
          `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>`,
        );

      // <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
      // stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      // class="lucide lucide-user-round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>

      // g.selectAll("i")
      //   .data(nodes)
      //   .enter()
      //   .append("i")
      //   .attr("data-lucide", "user-round");

      // Draw node labels
      g.selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("x", (d) => d.x + 6)
        .attr("y", (d) => d.y + 3)
        .text((d) => d.data.name);

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
  }, [data, zoomEnabled, dimensions]);

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
        {/* <i data-lucide="user-round"></i> */}
      </div>
    </Card>
  );
}
