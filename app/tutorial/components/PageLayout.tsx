import React from "react";
import Breadcrumbs from "../components/Breadcrumbs";

interface PageLayoutProps {
  sidebarWidth: number;
  collapsed: boolean;
  breadcrumbPaths: { name: string; href: string }[];
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  sidebarWidth,
  collapsed,
  breadcrumbPaths,
  children,
}) => {
  /* 计算左边距：侧边栏折叠时为 0，其余为 sidebarWidth */
  const marginLeft = collapsed ? 0 : sidebarWidth;

  return (
    <main
      className="flex-grow overflow-y-auto bg-background text-foreground transition-colors"
      /* 让整体高度随视口变化 */
      style={{ minHeight: "100vh" }}
    >
      {/* ---------- Breadcrumbs ---------- */}
      <div
        className="p-4"
        style={{
          marginLeft,
          transition: "margin-left 0.3s ease",
        }}
      >
        <Breadcrumbs paths={breadcrumbPaths} />
      </div>

      {/* ---------- Page Content ---------- */}
      <div
        className="px-4 pb-16"
        style={{
          marginLeft,
          transition: "margin-left 0.3s ease",
        }}
      >
        {children}
      </div>
    </main>
  );
};

export default PageLayout;
