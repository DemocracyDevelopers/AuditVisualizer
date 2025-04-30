"use client";

import React, { useState } from "react";
import AssertionContent from "../components/assertion-content"; // Adjust the path if necessary
import SidebarWithSearch from "../components/SidebarWithSearch"; // Import the SidebarWithSearch component
import Breadcrumbs from "../components/Breadcrumbs"; // 导入 Breadcrumbs 组件
import MarginContainer from "../components/MarginContainer";
import TermsAndPrivacy from "../../upload/components/terms-and-privacy";

const AssertionPage: React.FC = () => {
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [collapsed, setCollapsed] = useState(false);

  // 设置面包屑路径，只显示到一级标题
  const breadcrumbPaths = [
    { name: "Home", href: "/" },
    { name: "Assertions for IRV winners", href: "/tutorial/assertion" },
  ];

  return (
    <div className="flex bg-background">
      {/* Sidebar */}
      <SidebarWithSearch
        sidebarWidth={sidebarWidth}
        setSidebarWidth={setSidebarWidth}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main content */}
      <main className="flex-grow overflow-y-auto">
        {/* Breadcrumbs 放置在侧边栏右侧 */}
        {/* Use MarginContainer for Breadcrumbs */}
        <div
          style={{
            paddingLeft: collapsed ? 16 : 24, // px，根据 sidebar 状态动态设定
          }}
        >
          <Breadcrumbs paths={breadcrumbPaths} />
        </div>
        {/* Assertion content */}
        <AssertionContent sidebarWidth={sidebarWidth} collapsed={collapsed} />
        {/* Footer Section */}
      </main>
    </div>
  );
};

export default AssertionPage;
