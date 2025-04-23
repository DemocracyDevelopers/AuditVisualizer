"use client";
import React, { useEffect, useRef, useState } from "react";
import anime from "animejs";
import { X } from "lucide-react";

interface AuditProgressAnimationProps {
  championName: string;
}

const AuditProgressAnimation = ({
  championName,
}: AuditProgressAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) return;
    anime
      .timeline({
        easing: "easeInOutQuad",
        duration: 2000,
      })
      .add({
        targets: progressBarRef.current,
        width: ["0%", "100%"],
        backgroundPosition: ["0% 0%", "100% 0%"],
      })
      .add({
        targets: confirmationRef.current,
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 1000,
        easing: "easeOutExpo",
        begin: () => {
          if (confirmationRef.current) {
            confirmationRef.current.innerHTML = `
              <div class="flex items-center justify-center">
                <span class="mr-2 text-2xl">🏆</span>
                <span>
                  Verification Pass: <strong>${championName}</strong> is the Champion!
                </span>
              </div>`;
          }
        },
      })
      .add({
        targets: confirmationRef.current,
        translateY: [0, -5, 0],
        duration: 500,
        easing: "easeInOutSine",
      });
  }, [championName, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-0 left-0 w-full border-t border-b border-gray-300 bg-white p-4 rounded-b-lg">
      {/* 标题 + 关闭按钮 */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-bold text-gray-600">Audit Progress</div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 bg-transparent hover:bg-gray-100 rounded"
          aria-label="Close Animation"
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>

      {/* 进度条 */}
      <div className="h-3 w-full rounded bg-gray-100 overflow-hidden">
        <div
          ref={progressBarRef}
          className="h-full w-0 bg-gradient-to-r from-[#4caf50] to-[#81c784] [background-size:200%_100%]"
        />
      </div>

      {/* 成功提示 */}
      <div
        ref={confirmationRef}
        className="mt-3 text-center opacity-0 scale-[0.8] text-[#4caf50]"
      />
    </div>
  );
};

export default AuditProgressAnimation;
