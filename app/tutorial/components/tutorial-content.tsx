// components/tutorial-content.tsx

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import TermsAndPrivacy from "@/app/upload/components/terms-and-privacy";
import Breadcrumbs from "@/app/tutorial/components/Breadcrumbs";

// 定义 TutorialContentProps 类型
interface TutorialContentProps {
  sidebarWidth: number;
  collapsed: boolean;
}

const breadcrumbPaths = [
    { name: "Home", href: "/" },
    { name: "Getting Started", href: "/tutorial" }, // 当前页面的一级标题
];

const TutorialContent: React.FC<TutorialContentProps> = ({
  sidebarWidth,
  collapsed,
}) => {
  return (
      <div className="p-8 transition-all duration-300">
        <h2 className="text-5xl font-bold mb-8" data-content="Getting Started">
          Getting Started
        </h2>

        <div className="mb-8" data-content="Welcome">
          <h3 className="text-2xl font-semibold mb-4">Welcome</h3>
          <p className="text-lg text-gray-700">
            Welcome to the Audit Visualiser! By the time you&apos;ve completed
            this tutorial, you&apos;ll be at least somewhat comfortable with the
            fundamental principles of the AuditVisualiser and how to go about
            using it.
          </p>
        </div>

        <div className="mb-8" data-content="What’s Here">
          <h3 className="text-2xl font-semibold mb-4">What&apos;s Here</h3>
          <p className="text-lg text-gray-700">
            This document is designed to be an extremely gentle introduction, so
            we included a fair amount of material that may already be very
            familiar to you. To keep things simple, we also left out some
            information intermediate and advanced users will probably want.
          </p>
        </div>

        <div className="mb-8" data-content="Ready">
          <h3 className="text-2xl font-semibold mb-4">Ready?</h3>
          <p className="text-lg text-gray-700">Let&apos;s go!</p>
        </div>

        <div className="flex flex-col items-end mt-8 space-y-2 text-right">
          <div>
            <span className="font-bold">Next:</span>{" "}
            <Link
                href="/tutorial/introduction"
                className="text-lg text-blue-500 hover:underline"
            >
              Introduction: IRV RLAs with RAIRE
            </Link>
          </div>
          <div>
            <span className="font-bold">or:</span>{" "}
            <Link
                href="/upload"
                className="text-lg text-blue-500 hover:underline"
            >
              Back to Home Page
            </Link>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-sm text-gray-600">
          <TermsAndPrivacy/>
        </div>
      </div>
  );
};

export default TutorialContent;
