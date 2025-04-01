"use client";

import React, { useState } from "react";
import IntroductionContent from "../components/introduction-content";
import SidebarWithSearch from "../components/SidebarWithSearch";
import Breadcrumbs from "../components/Breadcrumbs";
import MarginContainer from "@/app/tutorial/components/MarginContainer";
import TermsAndPrivacy from "../../upload/components/terms-and-privacy";

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
        <MarginContainer collapsed={collapsed} sidebarWidth={sidebarWidth}>
          <Breadcrumbs paths={breadcrumbPaths} />
        </MarginContainer>
        {/* 主内容 */}
        <IntroductionContent
          sidebarWidth={sidebarWidth}
          collapsed={collapsed}
        />
        {/* Footer Section */}
        {/* Footer Section */}
        <TermsAndPrivacy /> {/* Reusing the TermsAndPrivacy component */}
      </main>
    </div>
  );
};

export default IntroductionPage;
