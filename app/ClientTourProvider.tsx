"use client";

import React from "react";
import { TourProvider } from "@reactour/tour";
import { steps } from "./steps";
import useTreeTabStore from "@/store/use-tree-tab-store";

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
        useTreeTabStore.getState().restoreTab();
      }}
      onClickMask={() => {
        // 不执行任何操作，用户点击遮罩不会关闭引导
      }}
      disableInteraction={true} // ✅ 禁止点击目标元素
      styles={{
        popover: (base) => ({
          ...base,
          borderRadius: "12px",
        }),
      }}
    >
      {children}
    </TourProvider>
  );
}
