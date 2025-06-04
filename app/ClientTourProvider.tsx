"use client";

import React from "react";
import { TourProvider } from "@reactour/tour";
import { TourStepWatcher } from "./TourStepWatcher";
import { TourSyncWatcher } from "./TourSyncWatcher";
import { CloseTourOnRouteChange } from "@/hooks/CloseTourOnRouteChange";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { X } from "lucide-react";

interface ClientTourProviderProps {
  readonly children: React.ReactNode;
}

/**
 * ClientTourProvider wraps the application with the Reactour TourProvider.
 */
export default function ClientTourProvider({
  children,
}: ClientTourProviderProps) {
  const disableBody = (target: any) => disableBodyScroll(target);
  const enableBody = (target: any) => enableBodyScroll(target);
  return (
    <TourProvider
      steps={[]}
      showNavigation={false}
      showDots={false}
      disableInteraction={true}
      disableKeyboardNavigation={["esc", "right", "left"]}
      onClickClose={({ setIsOpen }) => setIsOpen(false)}
      onClickMask={() => {}}
      styles={{
        popover: (base) => ({ ...base, borderRadius: "12px" }),
      }}
      scrollSmooth={true}
      afterOpen={disableBody}
      beforeClose={enableBody}
      components={{
        Close: ({ onClick }) => (
          <button
            onClick={onClick}
            className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 bg-white rounded-full p-2 shadow-md"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        ),
      }}
    >
      <CloseTourOnRouteChange />
      <TourSyncWatcher />
      <TourStepWatcher />
      {children}
    </TourProvider>
  );
}
