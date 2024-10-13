"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"; // Lucide icons
import { contentData } from "./dataContent"; // Adjust your path to dataContent

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
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null); // 当前高亮的二级标题
  const pathname = usePathname();
  const router = useRouter();

  // 保存状态到localStorage
  useEffect(() => {
    const savedExpandedSections = localStorage.getItem("expandedSections");
    const savedCollapsed = localStorage.getItem("sidebarCollapsed");

    if (savedExpandedSections) {
      setExpandedSections(JSON.parse(savedExpandedSections));
    }

    if (savedCollapsed !== null) {
      setCollapsed(JSON.parse(savedCollapsed) === true);
    }

    const currentSection = contentData.find(
      (section) => pathname === section.path, // 完全匹配路径
    );
    if (currentSection) {
      // 展开当前页面对应的一级标题
      setExpandedSections((prevSections) => {
        if (!prevSections.includes(currentSection.title)) {
          return [...prevSections, currentSection.title];
        }
        return prevSections;
      });

      // 根据 URL 设置默认的高亮二级标题
      const currentSubItem = currentSection.subItems.find((subItem) =>
        pathname.includes(subItem.toLowerCase().replace(/\s/g, "-")),
      );
      if (currentSubItem) {
        setActiveSubItem(currentSubItem);
      }
    }
  }, [pathname, setCollapsed]);

  // 滚动事件监听，检测当前章节并高亮
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-content]");

      let activeSection: string | null = null;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
          activeSection = section.getAttribute("data-content");
        }
      });

      if (activeSection) {
        setActiveSubItem(activeSection); // 高亮当前滚动到的二级标题

        // 找到属于该二级标题的一级标题并展开
        contentData.forEach((section) => {
          if (section.subItems.includes(activeSection!)) {
            if (!expandedSections.includes(section.title)) {
              setExpandedSections([section.title]);
            }
          }
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [expandedSections]);

  // 搜索处理
  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (!term) {
      setSearchResults([]); // 清空搜索结果
      return;
    }

    const results: { content: string; path: string }[] = [];

    contentData.forEach((page) => {
      page.subItems.forEach((subItem) => {
        if (subItem.toLowerCase().includes(term.toLowerCase())) {
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
    setExpandedSections((prevSections) => {
      if (prevSections.includes(title)) {
        return prevSections.filter((item) => item !== title);
      }
      return [...prevSections, title]; // 展开一级标题
    });
  };

  // 点击二级标题或搜索结果时处理
  const handleResultClick = (path: string, content: string) => {
    setSearchResults([]);
    setSearchTerm("");

    setActiveSubItem(content); // 强制设置高亮的二级标题

    // 找到对应的一级标题并展开
    const section = contentData.find((page) => page.path === path);
    if (section) {
      setExpandedSections([section.title]); // 确保只有一个一级标题展开
    }

    router.push(path); // 导航到新的路径
    setTimeout(() => {
      const element = document.querySelector(`[data-content="${content}"]`);
      if (element) {
        // 滚动到页面中央偏上位置
        element.scrollIntoView({
          behavior: "smooth",
          block: "center", // 使目标滚动到视图的中间偏上位置
        });
      }
    }, 300);
  };

  // 折叠所有目录并保存状态到 localStorage
  const collapseAll = () => {
    setExpandedSections([]); // 折叠所有展开的一级标题
    setCollapsed(true); // 折叠侧边栏
    localStorage.setItem("sidebarCollapsed", "true");
    localStorage.setItem("expandedSections", JSON.stringify([]));
  };

  // 展开按钮，保存到 localStorage
  const toggleSidebar = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    localStorage.setItem("sidebarCollapsed", JSON.stringify(newCollapsedState));
  };

  // 监听 expandedSections 的变化并保存到 localStorage
  useEffect(() => {
    localStorage.setItem("expandedSections", JSON.stringify(expandedSections));
  }, [expandedSections]);

  return (
    <>
      {/* Sidebar wrapper */}
      <div
        className="fixed bottom-0 left-0 z-50 flex flex-col"
        style={{ height: "88vh" }}
      >
        <div
          className="bg-white shadow-lg transition-transform duration-300 flex-1 overflow-auto"
          style={{ width: collapsed ? "0px" : `${sidebarWidth}px` }}
        >
          {!collapsed && (
            <div className="p-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
              <button
                onClick={() => handleSearch(searchTerm)}
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
                          (pathname === section.path &&
                            pathname === "/tutorial")
                            ? "text-blue-600 font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        {section.title}
                      </span>
                      <span className="text-gray-500">
                        {expandedSections.includes(section.title) ? (
                          <ChevronDown />
                        ) : (
                          <ChevronRight />
                        )}
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

        {/* 折叠按钮 */}
        {!collapsed && (
          <div
            className="h-10 w-full bg-gray-300 cursor-col-resize flex items-center justify-center"
            onClick={collapseAll} // 点击后触发折叠
          >
            <button
              className="text-gray-600 hover:text-gray-900"
              aria-label="Collapse"
            >
              <ChevronLeft />
            </button>
          </div>
        )}

        {/* 展开按钮 (仅在折叠状态时显示) */}
        {collapsed && (
          <button
            className="fixed top-1/2 left-0 transform -translate-y-1/2 bg-gray-200 p-2 rounded-r-md shadow-lg"
            onClick={toggleSidebar}
          >
            <ChevronRight />
          </button>
        )}
      </div>
    </>
  );
};

export default SidebarWithSearch;
