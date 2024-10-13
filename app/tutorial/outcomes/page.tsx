"use client";

import React, { useState } from "react";
import OutcomesContent from "../components/outcomes-content"; //
import SidebarWithSearch from "../components/SidebarWithSearch"; //
import Breadcrumbs from "../components/Breadcrumbs";
import MarginContainer from "@/app/tutorial/components/MarginContainer";

const OutcomesPage: React.FC = () => {
  const [sidebarWidth, setSidebarWidth] = useState(256); // 初始侧边栏宽度
  const [collapsed, setCollapsed] = useState(false); // 侧边栏折叠状态

  // 设置面包屑路径，只显示到一级标题
  const breadcrumbPaths = [
    { name: "Home", href: "/" },
    {
      name: "IRV elections and Visualizing Outcomes",
      href: "/tutorial/outcomes",
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

      {/* Main content */}
      <main className="flex-grow overflow-y-auto">
        {/* Breadcrumbs 放置在侧边栏右侧 */}
        <MarginContainer collapsed={collapsed} sidebarWidth={sidebarWidth}>
          <Breadcrumbs paths={breadcrumbPaths} />
        </MarginContainer>

        {/* Outcomes content */}
        <OutcomesContent sidebarWidth={sidebarWidth} collapsed={collapsed} />

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

export default OutcomesPage;
