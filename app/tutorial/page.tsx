"use client";

import React, { useState } from "react";
import TutorialContent from "./components/tutorial-content";
import SidebarWithSearch from "./components/SidebarWithSearch";
import Breadcrumbs from "./components/Breadcrumbs";
import MarginContainer from "@/app/tutorial/components/MarginContainer";
import TermsAndPrivacy from "@/app/upload/components/terms-and-privacy"; // 导入 Breadcrumbs 组件

const Tutorial: React.FC = () => {
  const [sidebarWidth, setSidebarWidth] = useState(256); // 设置侧边栏宽度
  const [collapsed, setCollapsed] = useState(false); // 控制侧边栏折叠状态

  // 设置面包屑路径（可根据实际的页面路径和导航调整）
  const breadcrumbPaths = [
    { name: "Home", href: "/" },
    { name: "Getting Started", href: "/tutorial" }, // 当前页面的一级标题
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
        {/* Breadcrumbs 放置在侧边栏的右侧 */}
        <MarginContainer collapsed={collapsed} sidebarWidth={sidebarWidth}>
          <Breadcrumbs paths={breadcrumbPaths} />
        </MarginContainer>
        {/* Tutorial content */}
        <TutorialContent sidebarWidth={sidebarWidth} collapsed={collapsed} />
        {/* Footer Section */}
        <TermsAndPrivacy /> {/* Reusing the TermsAndPrivacy component */}
      </main>
    </div>
  );
};

export default Tutorial;
