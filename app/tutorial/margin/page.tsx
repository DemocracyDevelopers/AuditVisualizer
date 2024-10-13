"use client";

import React, { useState } from "react";
import MarginDifficultyContent from "../components/margin-content"; // 引入新的组件
import SidebarWithSearch from "../components/SidebarWithSearch";
import Breadcrumbs from "../components/Breadcrumbs"; // 导入面包屑组件

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
        <div
          className="p-4"
          style={{
            marginLeft: collapsed ? 0 : sidebarWidth, // 根据侧边栏状态动态调整位置
            transition: "margin-left 0.3s ease",
          }}
        >
          {/* 面包屑 */}
          <Breadcrumbs paths={breadcrumbPaths} />
        </div>

        {/* 内容部分 */}
        <MarginDifficultyContent
          sidebarWidth={sidebarWidth}
          collapsed={collapsed}
        />

        {/* Footer Section */}
        <div className="p-4 text-sm text-gray-500 text-center border-t mt-8">
          By sharing your files or using our{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Privacy Policy
          </a>
          .
        </div>
      </main>
    </div>
  );
};

export default MarginDifficultyPage;
