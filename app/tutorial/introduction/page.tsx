"use client";

import React, { useState } from "react";
import IntroductionContent from "../components/introduction-content";
import SidebarWithSearch from "../components/SidebarWithSearch";
import Breadcrumbs from "../components/Breadcrumbs"; // 使用你现有的面包屑组件

const IntroductionPage: React.FC = () => {
  const [sidebarWidth, setSidebarWidth] = useState(256); // initial sidebar width in pixels
  const [collapsed, setCollapsed] = useState(false);

  // 设置面包屑路径（这里只显示到一级标题）
  const breadcrumbPaths = [
    { name: "Home", href: "/" },
    {
      name: "Introduction: IRV RAs with RAIRE",
      href: "/tutorial/introduction",
    }, // 当前页面的标题
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
      <main className="flex-grow">
        {/* Breadcrumbs 放置在侧边栏右侧 */}
        <div
          className="p-4"
          style={{
            marginLeft: collapsed ? 0 : sidebarWidth, // 确保面包屑不会被侧边栏覆盖
            transition: "margin-left 0.3s ease",
          }}
        >
          <Breadcrumbs paths={breadcrumbPaths} /> {/* 使用新的面包屑组件 */}
        </div>

        {/* 主内容 */}
        <IntroductionContent
          sidebarWidth={sidebarWidth}
          collapsed={collapsed}
        />

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

export default IntroductionPage;
