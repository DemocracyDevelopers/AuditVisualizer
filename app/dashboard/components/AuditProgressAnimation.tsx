"use client";
import React, { useEffect, useRef, useState } from "react";
import anime from "animejs";

interface EnhancedAuditAnimationProps {
  championName: string;
}

const EnhancedAuditAnimation = ({
  championName,
}: EnhancedAuditAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isVisible) return; // If the component is not visible, do nothing
    console.log("championName", championName);
    anime
      .timeline({
        easing: "easeInOutQuad",
        duration: 2000,
      })
      // 第一步：渐变进度条动画
      .add({
        targets: progressBarRef.current,
        width: ["0%", "100%"],
        // 可以在这里增加背景位置或渐变动画来制造流动效果
        backgroundPosition: ["0% 0%", "100% 0%"],
        begin: () => console.log("Verification Begin"),
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
            confirmationRef.current.innerHTML = `<div style="display:flex; align-items:center; justify-content:center;">
            <span style="display:inline-block; margin-right:8px; font-size:24px;">🏆</span>
            <span>Verification Pass!:<strong>${championName}</strong> is the Champion!</span>
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
    <div
      style={{
        position: "fixed",
        right: "20px",
        bottom: "20px",
        width: "300px",
        padding: "15px",
        background: "#fff",
        boxShadow: "0 0 15px rgba(0,0,0,0.15)",
        borderRadius: "10px",
        overflow: "hidden",
        zIndex: 9999,
      }}
    >
      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        style={{
          position: "absolute",
          top: "5px",
          right: "5px",
          border: "none",
          background: "transparent",
          fontSize: "16px",
          cursor: "pointer",
        }}
        aria-label="Close Animation"
      >
        ✖
      </button>
      <div
        style={{ marginBottom: "12px", fontSize: "15px", fontWeight: "bold" }}
      >
        Audit Progress
      </div>
      <div
        style={{
          height: "12px",
          width: "100%",
          borderRadius: "6px",
          overflow: "hidden",
          background: "linear-gradient(90deg, #4caf50, #81c784)",
          backgroundSize: "200% 100%",
        }}
      >
        <div
          ref={progressBarRef}
          style={{
            height: "100%",
            width: "0%",
            background: "linear-gradient(90deg, #4caf50, #81c784)",
            backgroundSize: "200% 100%",
          }}
        />
      </div>
      <div
        ref={confirmationRef}
        style={{
          marginTop: "15px",
          textAlign: "center",
          opacity: 0,
          transform: "scale(0.8)",
          fontSize: "16px",
          color: "#4caf50",
        }}
      ></div>
    </div>
  );
};

export default EnhancedAuditAnimation;
