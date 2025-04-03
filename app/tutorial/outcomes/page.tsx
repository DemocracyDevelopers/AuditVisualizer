"use client";

import React, { useState } from "react";
import OutcomesContent from "../components/outcomes-content"; //
import SidebarWithSearch from "../components/SidebarWithSearch"; //
import Breadcrumbs from "../components/Breadcrumbs";
import MarginContainer from "@/app/tutorial/components/MarginContainer";
import TermsAndPrivacy from "@/app/upload/components/terms-and-privacy";

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
            <div
                style={{
                    paddingLeft: collapsed ? 16 : 24, // px，根据 sidebar 状态动态设定
                }}
            >
                <Breadcrumbs paths={breadcrumbPaths}/>
            </div>
            {/* Outcomes content */}
            <OutcomesContent sidebarWidth={sidebarWidth} collapsed={collapsed}/>
            {/* Footer Section */}
        </main>
    </div>
  );
};

export default OutcomesPage;
