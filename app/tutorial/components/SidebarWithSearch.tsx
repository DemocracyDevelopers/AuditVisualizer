"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { contentData } from "./dataContent";

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
  const [searchResults, setSearchResults] = useState<
    { content: string; path: string }[]
  >([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarHeight, setSidebarHeight] = useState("90vh");

  // 初始化展开的章节
  useEffect(() => {
    const currentSection = contentData.find(
      (section) => pathname === section.path, // 完全匹配路径
    );
    if (currentSection) {
      setExpandedSections([currentSection.title]);
    }
  }, [pathname]);

  // 搜索处理
  const handleSearch = () => {
    if (!searchTerm) return;

    const results: { content: string; path: string }[] = [];

    contentData.forEach((page) => {
      page.subItems.forEach((subItem) => {
        if (subItem.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push({ content: subItem, path: page.path });
        }
      });
    });

    const uniqueResults = results.filter(
      (result, index, self) =>
        index === self.findIndex((r) => r.content === result.content),
    );

    setSearchResults(uniqueResults);
  };

  // 折叠/展开处理
  const toggleSection = (title: string) => {
    if (expandedSections.includes(title)) {
      setExpandedSections(expandedSections.filter((item) => item !== title));
    } else {
      setExpandedSections([title]); // 确保只有一个一级标题展开
    }
  };

  // 点击搜索结果或二级标题时处理
  const handleResultClick = (path: string, content: string) => {
    setSearchResults([]);
    setSearchTerm("");
    setActiveSubItem(content);

    // 找到对应的一级标题并展开
    const section = contentData.find((page) => page.path === path);
    if (section) {
      setExpandedSections([section.title]); // 确保只有一个一级标题展开
    }

    router.push(path);
    setTimeout(() => {
      const element = document.querySelector(`[data-content="${content}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);
  };

  // 监听滚动事件，动态更新当前活动的二级标题
  const handleScroll = () => {
    const scrollTop = window.scrollY;
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
      const newWidth = Math.min(Math.max(e.clientX, 100), 400);
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
      <div
        className="bg-white shadow-lg transition-transform duration-300"
        style={{ width: collapsed ? "0px" : `${sidebarWidth}px` }}
      >
        {!collapsed && (
          <div className="p-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch();
              }}
              className="w-full p-2 border rounded-md"
            />
            <button
              onClick={handleSearch}
              className="w-full mt-2 bg-blue-500 text-white p-2 rounded-md"
            >
              Search
            </button>

            {searchResults.length > 0 && (
              <ul className="mt-4 bg-gray-100 p-2 rounded-md max-h-60 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <li
                    key={index}
                    className="text-blue-500 hover:underline cursor-pointer"
                    onClick={() =>
                      handleResultClick(result.path, result.content)
                    }
                  >
                    {result.content}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6"></div>
            <h4 className="text-xl font-bold mb-4">Table of Content</h4>
            <ul className="space-y-2">
              {contentData.map((section) => (
                <li key={section.title}>
                  <div
                    className="flex justify-between items-center cursor-pointer py-2"
                    onClick={() => toggleSection(section.title)}
                  >
                    <span
                      className={`${
                        expandedSections.includes(section.title) ||
                        (pathname === section.path && pathname === "/tutorial")
                          ? "text-blue-600 font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      {section.title}
                    </span>
                    <span className="text-gray-500">
                      {expandedSections.includes(section.title) ? "▼" : "▶"}
                    </span>
                  </div>
                  {expandedSections.includes(section.title) && (
                    <ul className="ml-4 mt-2 space-y-1">
                      {section.subItems.map((subItem) => (
                        <li key={subItem}>
                          <span
                            className={`block cursor-pointer ${
                              activeSubItem === subItem
                                ? "text-blue-600 font-semibold"
                                : "text-gray-700"
                            } hover:underline`}
                            onClick={() =>
                              handleResultClick(section.path, subItem)
                            }
                          >
                            {subItem}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
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
