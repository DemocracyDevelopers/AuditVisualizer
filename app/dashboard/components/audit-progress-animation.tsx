// components/AuditProgressAnimation.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import anime from "animejs";
import { X } from "lucide-react";

interface AuditProgressAnimationProps {
  championName: string;
  isValid: boolean;
}

const AuditProgressAnimation = ({
  championName,
  isValid,
}: AuditProgressAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    // 动态配色和图标
    const fromColor = isValid ? "#4caf50" : "#e53e3e";
    const toColor = isValid ? "#81c784" : "#fc8181";
    const icon = isValid ? "🏆" : "❌";
    const message = isValid
      ? `Verification Pass: ${championName} is the Champion!`
      : `Verification Failed: ${championName} is not the Champion`;

    anime
      .timeline({ easing: "easeInOutQuad", duration: 2000 })
      // 进度条从 0 到 100%
      .add({
        targets: progressBarRef.current,
        width: ["0%", "100%"],
        background: [`linear-gradient(90deg, ${fromColor}, ${toColor})`],
        backgroundSize: ["200% 100%", "200% 100%"],
      })
      // 弹出验证信息
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
                <span class="mr-2 text-2xl">${icon}</span>
                <span>${message}</span>
              </div>`;
          }
        },
      })
      // 轻微抖动
      .add({
        targets: confirmationRef.current,
        translateY: [0, -5, 0],
        duration: 500,
        easing: "easeInOutSine",
      });
  }, [championName, isValid, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-0 left-0 w-full border-t border-b border-gray-300 bg-white p-4 rounded-b-lg z-50">
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
      <div className="h-3 w-full rounded bg-gray-100 overflow-hidden">
        <div
          ref={progressBarRef}
          className="h-full w-0"
          // 初始背景色，动画时会被覆盖
          style={{
            background: `linear-gradient(90deg, ${isValid ? "#4caf50" : "#e53e3e"}, ${isValid ? "#81c784" : "#fc8181"})`,
            backgroundSize: "200% 100%",
          }}
        />
      </div>
      <div
        ref={confirmationRef}
        className="mt-3 text-center opacity-0 scale-[0.8] text-gray-800"
      />
    </div>
  );
};

export default AuditProgressAnimation;
