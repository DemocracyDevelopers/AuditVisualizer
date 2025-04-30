"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import { contentData } from "./data-content";

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

  /* -------- 初始状态：展开当前页所在章节 -------- */
  useEffect(() => {
    const savedExpanded = localStorage.getItem("expandedSections");
    const savedCollapsed = localStorage.getItem("sidebarCollapsed");

    if (savedExpanded) setExpandedSections(JSON.parse(savedExpanded));
    if (savedCollapsed !== null) setCollapsed(JSON.parse(savedCollapsed));

    const currentSection = contentData.find((sec) => pathname === sec.path);
    if (currentSection) {
      setExpandedSections((prev) =>
        prev.includes(currentSection.title)
          ? prev
          : [...prev, currentSection.title],
      );
      const currentSub = currentSection.subItems?.find((s) =>
        pathname.includes(s.toLowerCase().replace(/\s/g, "-")),
      );
      if (currentSub) setActiveSubItem(currentSub);
    }
  }, [pathname, setCollapsed]);

  /* -------- 滚动监听，动态高亮目录 -------- */
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-content]");
      let active: string | null = null;

      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
          active = sec.getAttribute("data-content");
        }
      });

      if (active) {
        setActiveSubItem(active);
        contentData.forEach((sec) => {
          if (sec.subItems?.includes(active as string)) {
            if (!expandedSections.includes(sec.title)) {
              setExpandedSections([sec.title]);
            }
          }
        });
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [expandedSections]);

  /* -------- 搜索 -------- */
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term) return setSearchResults([]);

    const results: { content: string; path: string }[] = [];
    contentData.forEach((page) =>
      page.subItems?.forEach((sub) => {
        if (sub.toLowerCase().includes(term.toLowerCase()))
          results.push({ content: sub, path: page.path });
      }),
    );
    setSearchResults(
      results.filter(
        (r, i, arr) => i === arr.findIndex((x) => x.content === r.content),
      ),
    );
  };

  /* -------- 点击搜索结果 / 子项 -------- */
  const handleResultClick = (path: string, content: string) => {
    setSearchResults([]);
    setSearchTerm("");
    setActiveSubItem(content);

    const sec = contentData.find((p) => p.path === path);
    if (sec) setExpandedSections([sec.title]);

    router.push(path, { scroll: false });
    setTimeout(() => {
      const el = document.querySelector(`[data-content="${content}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  /* -------- 展开 / 折叠章节 -------- */
  const toggleSection = (title: string, path: string, hasSubs: boolean) => {
    if (hasSubs) {
      setExpandedSections((prev) =>
        prev.includes(title)
          ? prev.filter((t) => t !== title)
          : [...prev, title],
      );
    } else router.push(path);
  };

  /* -------- 折叠侧栏 -------- */
  const collapseAll = () => {
    setExpandedSections([]);
    setCollapsed(true);
    localStorage.setItem("sidebarCollapsed", "true");
    localStorage.setItem("expandedSections", JSON.stringify([]));
  };

  const toggleSidebar = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebarCollapsed", JSON.stringify(next));
  };

  /* -------- 持久化展开状态 -------- */
  useEffect(() => {
    localStorage.setItem("expandedSections", JSON.stringify(expandedSections));
  }, [expandedSections]);

  return (
    <div
      className="sticky top-6 left-2 flex flex-col"
      style={{ height: "88vh" }}
    >
      {/* -------- 侧栏主体 -------- */}
      <div
        className="bg-background text-foreground shadow-xl rounded-xl transition-all duration-300 flex-1 overflow-auto border border-border dark:border-border/60"
        style={{ width: collapsed ? "0px" : `${sidebarWidth}px` }}
      >
        {!collapsed && (
          <div className="p-4">
            {/* -------- 搜索框 -------- */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full p-2 pr-10 rounded-md border border-border dark:border-border/60 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => handleSearch(searchTerm)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary hover:text-primary/80"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </div>

            {/* -------- 搜索结果 -------- */}
            {searchResults.length > 0 && (
              <ul className="mt-4 bg-muted/40 dark:bg-muted/20 p-2 rounded-md max-h-60 overflow-y-auto shadow-inner">
                {searchResults.map((r) => (
                  <li
                    key={r.content}
                    className="px-3 py-2 cursor-pointer rounded hover:bg-muted/60 text-primary border-b last:border-b-0 border-border/40"
                    onClick={() => handleResultClick(r.path, r.content)}
                  >
                    {r.content}
                  </li>
                ))}
              </ul>
            )}
            {searchResults.length === 0 && searchTerm && (
              <p className="text-muted-foreground mt-3 text-sm">
                No results found.
              </p>
            )}

            {/* -------- 目录 -------- */}
            <div className="mt-6 pt-4 border-t border-border dark:border-border/60">
              <h4 className="text-xl font-bold mb-4">Table of Content</h4>
              <ul className="space-y-2">
                {contentData.map((sec) => (
                  <li key={sec.title}>
                    <div
                      className="flex justify-between items-center cursor-pointer py-2"
                      onClick={() =>
                        toggleSection(
                          sec.title,
                          sec.path,
                          !!sec.subItems?.length,
                        )
                      }
                    >
                      <span
                        className={`${
                          expandedSections.includes(sec.title) ||
                          pathname === sec.path
                            ? "text-primary font-semibold"
                            : ""
                        }`}
                      >
                        {sec.title}
                      </span>
                      {sec.subItems?.length ? (
                        expandedSections.includes(sec.title) ? (
                          <ChevronDown className="text-muted-foreground" />
                        ) : (
                          <ChevronRight className="text-muted-foreground" />
                        )
                      ) : null}
                    </div>

                    {expandedSections.includes(sec.title) &&
                      sec.subItems?.length && (
                        <ul className="ml-4 mt-2 space-y-1">
                          {sec.subItems.map((sub) => (
                            <li key={sub}>
                              <span
                                className={`block cursor-pointer hover:underline ${
                                  activeSubItem === sub
                                    ? "text-primary font-semibold"
                                    : "text-muted-foreground"
                                }`}
                                onClick={() => handleResultClick(sec.path, sub)}
                              >
                                {sub}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* -------- 折叠按钮（展开时） -------- */}
      {!collapsed && (
        <div className="flex justify-center py-3">
          <button
            onClick={collapseAll}
            aria-label="Collapse sidebar"
            className="p-2 rounded-full bg-muted hover:bg-muted/70 text-foreground shadow-md transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
        </div>
      )}

      {/* -------- 展开按钮（折叠时） -------- */}
      {collapsed && (
        <button
          onClick={toggleSidebar}
          className="fixed top-1/2 left-0 -translate-y-1/2 bg-muted p-2 rounded-r-md shadow-lg hover:bg-muted/70 transition-colors"
        >
          <ChevronRight />
        </button>
      )}
    </div>
  );
};

export default SidebarWithSearch;
