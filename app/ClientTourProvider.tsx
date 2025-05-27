"use client";

import React from "react";
import { TourProvider } from "@reactour/tour";
import { TourStepWatcher } from "./TourStepWatcher";
import { TourSyncWatcher } from "./TourSyncWatcher";
import { CloseTourOnRouteChange } from "@/hooks/CloseTourOnRouteChange";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { X } from "lucide-react"; // 任意图标库都可以用

// ✅ 不再依赖外部 steps，而交由 TourSyncWatcher 设置
interface ClientTourProviderProps {
  readonly children: React.ReactNode;
}

export default function ClientTourProvider({
  children,
}: ClientTourProviderProps) {
  const disableBody = (target: any) => disableBodyScroll(target);
  const enableBody = (target: any) => enableBodyScroll(target);
  return (
    <TourProvider
      steps={[]} // 初始为空，由 TourSyncWatcher 后续动态设置
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

// export default function ClientTourProvider({
//   children,
// }: ClientTourProviderProps) {
//   const steps = useTourSteps().filter((step) => step !== false);
//   console.log("steps!!!!!!!!!!", steps);
//   return (
//     <TourProvider
//       steps={steps as StepType[]}
//       onClickClose={({ setIsOpen }) => {
//         setIsOpen(false);
//       }}
//       onClickMask={() => {
//         // 不执行任何操作，用户点击遮罩不会关闭引导
//       }}
//       disableInteraction={true} // ✅ 禁止点击目标元素
//       styles={{
//         popover: (base) => ({
//           ...base,
//           borderRadius: "12px",
//         }),
//       }}
//     >
//       <TourStepWatcher />
//       {children}
//     </TourProvider>
//   );
// }
