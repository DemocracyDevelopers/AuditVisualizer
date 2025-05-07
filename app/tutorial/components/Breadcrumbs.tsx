"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
          {index === paths.length - 1 ? (
            // 最后一个，用 span 显示为普通文字
            <span className="bg-gray-100 text-gray-900 font-medium px-3 py-1 rounded-full">
              {path.name}
            </span>
          ) : (
            // 其他的仍然是链接
            <Link
              href={path.href}
              className={`hover:underline ${
                index === 0 ? "text-gray-600" : "text-gray-600"
              }`}
            >
              {index === 0 ? (
                <span className="flex items-center">
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
          )}
          {index < paths.length - 1 && (
            <ChevronRight className="mx-2 text-gray-400" />
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
