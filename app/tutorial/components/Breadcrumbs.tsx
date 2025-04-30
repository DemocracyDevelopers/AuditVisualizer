"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbsProps {
  paths: { name: string; href: string }[];
}

/**
 * Breadcrumbs component — colors auto-adapt to Light / Dark theme
 */
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ paths }) => {
  return (
    <nav
      aria-label="breadcrumb"
      className="flex items-center space-x-2 text-sm transition-colors"
    >
      {paths.map((path, idx) => {
        const isLast = idx === paths.length - 1;

        /* -------- Home icon for the first crumb -------- */
        const label =
          idx === 0 ? (
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12l9-9 9 9" />
                <path d="M4 10v10a1 1 0 001 1h3m8-11l4 4m-4-4v11a1 1 0 01-1 1h-3" />
                <path d="M10 21v-5a1 1 0 011-1h2a1 1 0 011 1v5" />
              </svg>
            </span>
          ) : (
            path.name
          );

        return (
          <span key={idx} className="flex items-center">
            {/* ---------- Link or current page ---------- */}
            {isLast ? (
              <span className="bg-muted text-foreground font-medium px-3 py-1 rounded-full">
                {path.name}
              </span>
            ) : (
              <Link
                href={path.href}
                className="text-muted-foreground hover:text-foreground hover:underline"
              >
                {label}
              </Link>
            )}

            {/* ---------- Chevron separator ---------- */}
            {!isLast && <ChevronRight className="mx-2 text-muted-foreground" />}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
