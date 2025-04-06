"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react"; // 或其他图标库

interface BreadcrumbsProps {
  paths: { name: string; href: string }[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ paths }) => {
  return (
    <nav
      aria-label="breadcrumb"
      className="flex items-center space-x-2 text-sm"
    >
      {paths.map((path, index) => (
        <span key={index} className="flex items-center">
          <Link
            href={path.href}
            className={`hover:underline ${
              index === paths.length - 1 ? "text-blue-600" : "text-gray-600"
            }`}
          >
            {index === 0 ? (
              <span className="flex items-center">
                {/* 主页的图标 */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 4v-4a1 1 0 011-1h2a1 1 0 011 1v4m-6 4h6"
                  />
                </svg>
              </span>
            ) : (
              path.name
            )}
          </Link>
          {index < paths.length - 1 && (
            <ChevronRight className="mx-2 text-gray-400" />
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
