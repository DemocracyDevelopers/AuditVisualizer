// components/AuditProgressAnimation.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import anime from "animejs";
import { X } from "lucide-react";

interface AuditProgressAnimationProps {
  championName: string;
  isValid: boolean;
  onClose?: () => void;
}

const AuditProgressAnimation = ({
  championName,
  isValid,
  onClose,
}: AuditProgressAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    // Dynamic color and icon
    const fromColor = isValid ? "#4caf50" : "#e53e3e";
    const toColor = isValid ? "#81c784" : "#fc8181";
    const icon = isValid ? "🏆" : "❌";
    const message = isValid
      ? `Verification Pass: ${championName} is the Champion!`
      : `Verification Failed: ${championName} is not the Champion`;

    anime
      .timeline({ easing: "easeInOutQuad", duration: 2000 })
      // Progress bar from 0 to 100%
      .add({
        targets: progressBarRef.current,
        width: ["0%", "100%"],
        background: [`linear-gradient(90deg, ${fromColor}, ${toColor})`],
        backgroundSize: ["200% 100%", "200% 100%"],
      })
      // Pop up verification message
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
      // Slight shake effect
      .add({
        targets: confirmationRef.current,
        translateY: [0, -5, 0],
        duration: 500,
        easing: "easeInOutSine",
      });
  }, [championName, isValid, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="w-full border border-gray-300 bg-background p-4 rounded-b-lg shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-bold text-gray-600">Audit Progress</div>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
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
          // Initial background color, will be overridden by animation
          style={{
            background: `linear-gradient(90deg, ${isValid ? "#4caf50" : "#e53e3e"}, ${isValid ? "#81c784" : "#fc8181"})`,
            backgroundSize: "200% 100%",
          }}
        />
      </div>
      <div
        ref={confirmationRef}
        className="mt-[15px] text-center opacity-0 scale-[0.8] text-[#4caf50] text-[16px]"
      />
    </div>
  );
};

export default AuditProgressAnimation;
