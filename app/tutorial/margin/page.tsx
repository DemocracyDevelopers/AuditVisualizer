"use client";

import React, { useState } from "react";
import MarginDifficultyContent from "../components/margin-content"; // 引入新的组件
import SidebarWithSearch from "../components/SidebarWithSearch";
import Breadcrumbs from "../components/Breadcrumbs";
import MarginContainer from "@/app/tutorial/components/MarginContainer";
import TermsAndPrivacy from "@/app/upload/components/terms-and-privacy"; // 导入面包屑组件

const MarginDifficultyPage: React.FC = () => {
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [collapsed, setCollapsed] = useState(false);

  // 面包屑路径，显示到一级标题
  const breadcrumbPaths = [
    { name: "Home", href: "/" },
    {
      name: "Margin and Difficulty",
      href: "/tutorial/margin",
    },
  ];

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
        {/* Breadcrumbs 放置在侧边栏右侧 */}
        <MarginContainer collapsed={collapsed} sidebarWidth={sidebarWidth}>
          <Breadcrumbs paths={breadcrumbPaths} />
        </MarginContainer>
        {/* 内容部分 */}
        <MarginDifficultyContent
          sidebarWidth={sidebarWidth}
          collapsed={collapsed}
        />
        {/* Footer Section */}
        <TermsAndPrivacy /> {/* Reusing the TermsAndPrivacy component */}
      </main>
    </div>
  );
};

export default MarginDifficultyPage;
