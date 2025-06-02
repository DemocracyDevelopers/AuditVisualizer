"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Search } from "lucide-react";
import { contentData } from "./data-content";

interface SidebarProps {
  sidebarWidth: number;
  setSidebarWidth: React.Dispatch<React.SetStateAction<number>>;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarWithSearch: React.FC<SidebarProps> = ({
  sidebarWidth,
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
      (section) => pathname === section.path,
    );
    if (currentSection) {
      setExpandedSections((prev) =>
        prev.includes(currentSection.title)
          ? prev
          : [...prev, currentSection.title],
      );

      const currentSubItem = currentSection.subItems?.find((subItem) =>
        pathname.includes(subItem.toLowerCase().replace(/\s/g, "-")),
      );
      if (currentSubItem) {
        setActiveSubItem(currentSubItem);
      }
    }
  }, [pathname, setCollapsed]);

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
        setActiveSubItem(activeSection);
        contentData.forEach((section) => {
          if (section.subItems?.includes(activeSection as string)) {
            if (!expandedSections.includes(section.title)) {
              setExpandedSections([section.title]);
            }
          }
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [expandedSections]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (!term) {
      setSearchResults([]);
      return;
    }

    const results: { content: string; path: string }[] = [];

    contentData.forEach((page) => {
      page.subItems?.forEach((subItem) => {
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

  const handleResultClick = (path: string, content: string) => {
    setSearchResults([]);
    setSearchTerm("");
    setActiveSubItem(content);

    const section = contentData.find((page) => page.path === path);
    if (section) {
      setExpandedSections([section.title]);
    }

    router.push(path, { scroll: false });
    setTimeout(() => {
      const element = document.querySelector(`[data-content="${content}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 300);
  };

  const toggleSection = (title: string, path: string, hasSubItems: boolean) => {
    if (hasSubItems) {
      setExpandedSections((prev) =>
        prev.includes(title)
          ? prev.filter((item) => item !== title)
          : [...prev, title],
      );
    } else {
      router.push(path);
    }
  };

  const collapseAll = () => {
    setExpandedSections([]);
    setCollapsed(true);
    localStorage.setItem("sidebarCollapsed", "true");
    localStorage.setItem("expandedSections", JSON.stringify([]));
  };

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
  };

  useEffect(() => {
    localStorage.setItem("expandedSections", JSON.stringify(expandedSections));
  }, [expandedSections]);

  return (
    <>
      <div
        className="sticky top-6 left-2 flex flex-col"
        style={{ height: "88vh" }}
      >
        <div
          className="bg-background shadow-xl rounded-xl transition-transform duration-300 flex-1 overflow-auto"
          style={{ width: collapsed ? "0px" : `${sidebarWidth}px` }}
        >
          {!collapsed && (
            <div className="p-4">
              {/* 搜索框区域 */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleSearch(searchTerm)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-500 hover:text-blue-700"
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
              </div>

              {searchResults.length > 0 && (
                <ul className="mt-4 bg-gray-50 p-2 rounded-md max-h-60 overflow-y-auto shadow-inner">
                  {searchResults.map((result, index) => (
                    <li
                      key={index}
                      className="text-blue-600 px-3 py-2 hover:bg-blue-100 rounded cursor-pointer border-b last:border-b-0"
                      onClick={() =>
                        handleResultClick(result.path, result.content)
                      }
                    >
                      {result.content}
                    </li>
                  ))}
                </ul>
              )}

              {searchResults.length === 0 && searchTerm && (
                <p className="text-gray-500 mt-3 text-sm">No results found.</p>
              )}

              {/* Table of content field */}
              <div className="mt-6 pt-4 border-t">
                <h4 className="text-xl font-bold mb-4">Table of Content</h4>
                <ul className="space-y-2">
                  {contentData.map((section) => (
                    <li key={section.title}>
                      <div
                        className="flex justify-between items-center cursor-pointer py-2"
                        onClick={() =>
                          toggleSection(
                            section.title,
                            section.path,
                            !!section.subItems && section.subItems.length > 0,
                          )
                        }
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
                        {section.subItems && section.subItems.length > 0 && (
                          <span className="text-gray-500">
                            {expandedSections.includes(section.title) ? (
                              <ChevronDown />
                            ) : (
                              <ChevronRight />
                            )}
                          </span>
                        )}
                      </div>
                      {expandedSections.includes(section.title) &&
                        section.subItems &&
                        section.subItems.length > 0 && (
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
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="flex justify-center py-3 bg-transparent">
            <button
              onClick={collapseAll}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 p-2 rounded-full shadow-md transition"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        )}

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
