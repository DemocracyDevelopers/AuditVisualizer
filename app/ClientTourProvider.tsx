"use client";

import React from "react";
import { TourProvider } from "@reactour/tour";
import { steps } from "./steps";

interface ClientTourProviderProps {
  readonly children: React.ReactNode;
}

export default function ClientTourProvider({
  children,
}: ClientTourProviderProps) {
  return (
    <TourProvider
      steps={steps}
      onClickClose={({ setIsOpen }) => {
        setIsOpen(false);
      }}
      styles={{
        popover: (base) => ({
          ...base,
          borderRadius: "12px", // 设置提示框圆角
        }),
      }}
    >
      {children}
    </TourProvider>
  );
}
