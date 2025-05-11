"use client";

import { useMemo, useState } from "react";
import SidebarWithSearch from "./components/SidebarWithSearch";
import TermsAndPrivacy from "../upload/components/terms-and-privacy";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { contentData } from "./components/data-content";
import Breadcrumbs from "./components/Breadcrumbs";

export default function TutorialLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(256); // 设置侧边栏宽度
  const [collapsed, setCollapsed] = useState(false); // 控制侧边栏折叠状态
  // route
  const pathname = usePathname();

  const breadcrumbPaths = useMemo(() => {
    return [
      { name: "Home", href: "/" },
      {
        name: contentData.find((item) => item.path === pathname)?.title || "",
        href: pathname,
      },
    ];
  }, [pathname]);

  return (
    <div className="flex bg-white">
      {/* Sidebar */}
      <SidebarWithSearch
        sidebarWidth={sidebarWidth}
        setSidebarWidth={setSidebarWidth}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main content area */}
      <main className="flex-grow overflow-y-auto">
        {/* Breadcrumbs 放置在侧边栏的右侧 */}
        <div
          style={{
            paddingLeft: collapsed ? 16 : 24, // px，根据 sidebar 状态动态设定
          }}
        >
          {/* <Breadcrumbs paths={breadcrumbPaths} /> */}

          <div className="p-8 transition-all duration-300">
            <Breadcrumbs paths={breadcrumbPaths} />
            {children}
            {/*  */}
            <NavigationArea />
          </div>
        </div>
        {/* Tutorial content */}
      </main>
    </div>
  );
}

const NavigationArea = () => {
  const pathname = usePathname();
  const currentIndex = useMemo(() => {
    return contentData.findIndex((item) => item.path === pathname);
  }, [pathname]);

  const prevItem = currentIndex > 0 ? contentData[currentIndex - 1] : null;
  const nextItem =
    currentIndex < contentData.length - 1
      ? contentData[currentIndex + 1]
      : null;

  return (
    <div className="flex justify-between items-center mt-12">
      {/* Back Button - Left aligned */}
      {prevItem ? (
        <div className="mb-2">
          <span className="font-bold">Previous:</span>{" "}
          <Link
            href={prevItem.path}
            // className="text-gray-600 hover:text-gray-900 flex items-center group"
            className="text-blue-500 hover:underline items-center inline-flex"
          >
            {prevItem.title}
          </Link>
        </div>
      ) : (
        <div></div> // Empty div to maintain layout
      )}

      {/* Next and Home Links - Right aligned */}
      <div className="text-right">
        {nextItem && (
          <div className="mb-2">
            <span className="font-bold">Next:</span>{" "}
            <Link
              href={nextItem.path}
              className="text-blue-500 hover:underline items-center inline-flex"
            >
              {nextItem.title}
              {/* <ChevronRight className="ml-2 text-blue-500" /> */}
            </Link>
          </div>
        )}
        <div>
          <Link href="/upload" className="font-bold hover:underline">
            Back to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};
