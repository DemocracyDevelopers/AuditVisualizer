// tutorial/assertion/page.tsx
"use client";

import React, { useState } from "react";
import AssertionContent from "../components/AssertionContent"; // Adjust the path if necessary
import SidebarWithSearch from "../components/SidebarWithSearch"; // Import the SidebarWithSearch component

const AssertionPage: React.FC = () => {
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [collapsed, setCollapsed] = useState(false);

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
        <AssertionContent sidebarWidth={sidebarWidth} collapsed={collapsed} />

        {/* Footer Section */}
        <p className="p-4 text-sm text-gray-500 text-center border-t mt-8">
          By sharing your files or using our service, you agree to our{" "}
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
