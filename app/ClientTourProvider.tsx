"use client";

import React, { useEffect, useState } from "react";
import { TourProvider } from "@reactour/tour";
import { steps } from "./steps";
import { useTheme } from "next-themes";

interface ClientTourProviderProps {
  readonly children: React.ReactNode;
}

export default function ClientTourProvider({
  children,
}: ClientTourProviderProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 避免 hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <TourProvider
      steps={steps}
      onClickClose={({ setIsOpen }) => {
        setIsOpen(false);
      }}
      styles={{
        popover: (base) => ({
          ...base,
          backgroundColor: isDark ? "#1f2937" : "#ffffff", // dark: gray-800
          color: isDark ? "#f9fafb" : "#111827", // dark: gray-100
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
        }),
        close: (base) => ({
          ...base,
          color: isDark ? "#d1d5db" : "#4b5563", // dark: gray-300
        }),
        badge: (base) => ({
          ...base,
          backgroundColor: isDark ? "#3b82f6" : "#2563eb", // blue-500 / blue-600
          color: "#ffffff",
        }),
        maskArea: (base) => ({
          ...base,
          rx: 8,
        }),
      }}
    >
      {children}
    </TourProvider>
  );
}
