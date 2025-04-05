"use client";
import { useEffect, useState } from "react";
import { Progress } from "../ui/progress";
import { useWorker } from "@/hooks/useWorker";

export default function VerificationProgress() {
  const [progress, setProgress] = useState(0);
  const { execute, result, error, status, isReady, reset } = useWorker();

  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed right-2 bottom-4 z-50">
      <Progress value={progress} className="w-[200px] h-4" />
    </div>
  );
}
