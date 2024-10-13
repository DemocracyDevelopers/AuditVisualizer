"use client";

import React, { useState } from "react";
import AssertionContent from "../components/AssertionContent"; // 调整导入路径
import SidebarWithSearch from "../components/SidebarWithSearch"; // 导入 SidebarWithSearch 组件
import Breadcrumbs from "../components/Breadcrumbs"; // 导入 Breadcrumbs 组件

const AssertionPage: React.FC = () => {
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [collapsed, setCollapsed] = useState(false);

  // 设置面包屑路径，只显示到一级标题
  const breadcrumbPaths = [
    { name: "Home", href: "/" },
    { name: "Assertions for IRV winners", href: "/tutorial/assertion" },
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

      {/* Main content */}
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

        {/* Assertion content */}
        <AssertionContent sidebarWidth={sidebarWidth} collapsed={collapsed} />

        {/* Footer Section */}
        <p className="p-4 text-sm text-gray-500 text-center border-t mt-8">
          By sharing your files or using our{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </main>
    </div>
  );
};

export default AssertionPage;
