"use client";
import React, { useEffect, useRef, useState } from "react";
import anime from "animejs";
import { X } from "lucide-react";

interface EnhancedAuditAnimationProps {
  championName: string;
}

const EnhancedAuditAnimation = ({
  championName,
}: EnhancedAuditAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const progressBarRef = useRef<HTMLDivElement>();
  const confirmationRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (!isVisible) return; // 如果组件不可见则不执行动画
    anime
      .timeline({
        easing: "easeInOutQuad",
        duration: 2000,
      })
      // 第一步：渐变进度条动画
      .add({
        targets: progressBarRef.current,
        width: ["0%", "100%"],
        backgroundPosition: ["0% 0%", "100% 0%"],
        // begin: () => console.log("Verification Begin"),
      })
      // 第二步：淡入并弹出冠军确认信息
      .add({
        targets: confirmationRef.current,
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 1000,
        easing: "easeOutExpo",
        begin: () => {
          if (confirmationRef.current) {
            confirmationRef.current.innerHTML = `<div class="flex items-center justify-center">
              <span class="mr-2 text-2xl">🏆</span>
              <span>Verification Pass!<strong>${championName}</strong> is the Champion!</span>
            </div>`;
          }
        },
      })
      // 第三步：轻微抖动，提升动感
      .add({
        targets: confirmationRef.current,
        translateY: [0, -5, 0],
        duration: 500,
        easing: "easeInOutSine",
      });
  }, [championName, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed right-5 bottom-5 w-[300px] p-[15px] bg-white shadow-[0_0_15px_rgba(0,0,0,0.15)] rounded-[10px] overflow-hidden z-[9999]">
      {/* 关闭按钮 */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-[5px] right-[5px] border-0 bg-transparent text-[16px] cursor-pointer"
        aria-label="Close Animation"
      >
        <X size={16} />
      </button>
      <div className="mb-[12px] text-[15px] font-bold">Audit Progress</div>
      <div className="h-[12px] w-full rounded-[6px] overflow-hidden bg-gradient-to-r from-[#4caf50] to-[#81c784] [background-size:200%_100%]">
        <div
          ref={progressBarRef}
          className="h-full w-0 bg-gradient-to-r from-[#4caf50] to-[#81c784] [background-size:200%_100%]"
        />
      </div>
      <div
        ref={confirmationRef}
        className="mt-[15px] text-center opacity-0 scale-[0.8] text-[16px] text-[#4caf50]"
      ></div>
    </div>
  );
};

export default EnhancedAuditAnimation;
