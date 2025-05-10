import React from "react";
import Breadcrumbs from "../components/Breadcrumbs"; // Assuming Breadcrumbs is already defined

interface PageLayoutProps {
  sidebarWidth: number;
  collapsed: boolean;
  breadcrumbPaths: { name: string; href: string }[]; // Adjust the type if needed
  children: React.ReactNode; // To render the actual page content
}

const PageLayout: React.FC<PageLayoutProps> = ({
  sidebarWidth,
  collapsed,
  breadcrumbPaths,
  children,
}) => {
  return (
    <main className="flex-grow overflow-y-auto">
      {/* Breadcrumbs */}
      <div
        className="p-4"
        style={{
          marginLeft: collapsed ? 0 : sidebarWidth, // Adjust position based on sidebar
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Breadcrumbs */}
        <Breadcrumbs paths={breadcrumbPaths} />
      </div>

      {/* Page content */}
      <div
        style={{
          marginLeft: collapsed ? 0 : sidebarWidth, // Adjust position based on sidebar
          transition: "margin-left 0.3s ease",
        }}
      >
        {children}
      </div>
    </main>
  );
};

export default PageLayout;
