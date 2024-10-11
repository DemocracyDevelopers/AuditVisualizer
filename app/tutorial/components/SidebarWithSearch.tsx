"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 定义页面列表
const pages = [
  { id: 0, name: "Getting Started", path: "/tutorial" },
  {
    id: 1,
    name: "Introduction: IRV RAs with RAIRE",
    path: "/tutorial/introduction",
  },
  {
    id: 2,
    name: "IRV elections and Visualizing Outcomes",
    path: "/tutorial/outcomes",
  },
  { id: 3, name: "Assertions for IRV winners", path: "/tutorial/assertion" },
  { id: 4, name: "Risk Limiting Audits", path: "/tutorial/risk" },
  {
    id: 5,
    name: "Using assertions to audit IRV outcomes",
    path: "/tutorial/usingassertion",
  },
];

// 定义Props类型
interface SidebarProps {
  sidebarWidth: number;
  setSidebarWidth: React.Dispatch<React.SetStateAction<number>>;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarWithSearch: React.FC<SidebarProps> = ({
  sidebarWidth,
  setSidebarWidth,
  collapsed,
  setCollapsed,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();
  const [sidebarHeight, setSidebarHeight] = useState("90vh"); // 初始化高度

  const handleSearch = () => {
    if (!searchTerm) return;
    const element = document.querySelector(`[data-content*="${searchTerm}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // 监听滚动事件并调整 Sidebar 高度
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    // 当滚动到页面底部时，Sidebar 高度为 100vh，否则按滚动距离逐渐增加
    // const newHeight = Math.min(100, 70 + (scrollTop / 10)) + "vh";
    const newHeight = Math.max(85, Math.min(100, 85 + scrollTop / 10)) + "vh";
    setSidebarHeight(newHeight);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!collapsed) {
      const newWidth = Math.min(Math.max(e.clientX, 100), 400); // Min width: 100px, Max width: 400px
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className="fixed bottom-0 left-0 z-50 flex"
      style={{ height: sidebarHeight }}
    >
      {/* Sidebar */}
      <div
        className="bg-white shadow-lg transition-transform duration-300"
        style={{ width: collapsed ? "0px" : `${sidebarWidth}px` }}
      >
        {!collapsed && (
          <>
            {/*/!* Top horizontal line *!/*/}
            {/*<div className="w-full h-2 bg-gray-300"></div>*/}

            <div className="p-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
              <button
                onClick={handleSearch}
                className="w-full mt-2 bg-blue-500 text-white p-2 rounded-md"
              >
                Search
              </button>

              {/* Add spacing between the Search button and the Table of Content */}
              <div className="mt-6"></div>

              <h4 className="text-xl font-bold mb-4">Table of Content</h4>
              <ul className="space-y-2">
                {pages.map((page) => (
                  <li key={page.id}>
                    <Link
                      href={page.path}
                      className={`block ${
                        pathname === page.path
                          ? "text-blue-600 font-semibold"
                          : "text-gray-700"
                      } hover:underline`}
                    >
                      {page.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      {/* Resizer Bar with Toggle Button */}
      <div
        className="h-full w-1 bg-gray-300 cursor-col-resize flex items-center justify-center"
        onMouseDown={handleMouseDown}
      >
        <button
          onClick={toggleSidebar}
          className="text-white bg-blue-500 rounded-full shadow p-1"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>
    </div>
  );
};

export default SidebarWithSearch;
