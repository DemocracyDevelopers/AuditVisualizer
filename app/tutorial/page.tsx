"use client";

import React, { useState } from "react";
import TutorialContent from "./components/TutorialContent";
import SidebarWithSearch from "./components/SidebarWithSearch";
import Breadcrumbs from "./components/Breadcrumbs"; // 导入 Breadcrumbs 组件

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
        <div
          className="p-4"
          style={{
            marginLeft: collapsed ? 0 : sidebarWidth, // 动态调整面包屑的位置，确保不会被侧边栏覆盖
            transition: "margin-left 0.3s ease",
          }}
        >
          {/* 面包屑 */}
          <Breadcrumbs paths={breadcrumbPaths} />
        </div>

        {/* Tutorial content */}
        <TutorialContent sidebarWidth={sidebarWidth} collapsed={collapsed} />

        {/* Footer Section */}
        <div className="p-4 text-sm text-gray-500 text-center border-t mt-8">
          By sharing your files or using our service, you agree to our{" "}
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

export default Tutorial;
