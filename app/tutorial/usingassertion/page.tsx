"use client";

import React, { useState } from "react";
import UsingAssertionsContent from "../components/using-assertions-content";
import SidebarWithSearch from "../components/SidebarWithSearch";
import Breadcrumbs from "../components/Breadcrumbs";
import TermsAndPrivacy from "@/app/upload/components/terms-and-privacy"; // 导入面包屑组件

const UsingAssertionsPage: React.FC = () => {
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [collapsed, setCollapsed] = useState(false);

  // 面包屑路径，显示到一级标题
  const breadcrumbPaths = [
    { name: "Home", href: "/" },
    {
      name: "Using Assertions to Audit IRV Outcomes",
      href: "/tutorial/using-assertions-to-audit",
    },
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

      {/* Main content area */}
      <main className="flex-grow overflow-y-auto">
        {/* Breadcrumbs 放置在侧边栏右侧 */}
        <div
          style={{
            paddingLeft: collapsed ? 16 : 24, // px，根据 sidebar 状态动态设定
          }}
        >
          <Breadcrumbs paths={breadcrumbPaths} />
        </div>
        {/* 内容部分 */}
        <UsingAssertionsContent
          sidebarWidth={sidebarWidth}
          collapsed={collapsed}
        />
      </main>
    </div>
  );
};

export default UsingAssertionsPage;
