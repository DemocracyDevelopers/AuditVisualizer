// "use client";
//
// import * as React from "react";
// import * as AvatarPrimitive from "@radix-ui/react-avatar";
//
// import { cn } from "@/lib/utils";
//
// const Avatar = React.forwardRef<
//   React.ElementRef<typeof AvatarPrimitive.Root>,
//   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
// >(({ className, ...props }, ref) => (
//   <AvatarPrimitive.Root
//     ref={ref}
//     className={cn(
//       "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
//       className,
//     )}
//     {...props}
//   />
// ));
// Avatar.displayName = AvatarPrimitive.Root.displayName;
//
// const AvatarImage = React.forwardRef<
//   React.ElementRef<typeof AvatarPrimitive.Image>,
//   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
// >(({ className, ...props }, ref) => (
//   <AvatarPrimitive.Image
//     ref={ref}
//     className={cn("aspect-square h-full w-full", className)}
//     {...props}
//   />
// ));
// AvatarImage.displayName = AvatarPrimitive.Image.displayName;
//
// const AvatarFallback = React.forwardRef<
//   React.ElementRef<typeof AvatarPrimitive.Fallback>,
//   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
// >(({ className, ...props }, ref) => (
//   <AvatarPrimitive.Fallback
//     ref={ref}
//     className={cn(
//       "flex h-full w-full items-center justify-center rounded-full bg-muted",
//       className,
//     )}
//     {...props}
//   />
// ));
// AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
//
// export { Avatar, AvatarImage, AvatarFallback };
"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import useMultiWinnerDataStore from "@/store/multi-winner-data"; // 引入 zustand store

// 定义 AvatarProps 接口，明确指定 candidateId 的类型
interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  candidateId: number; // 将 id 改为 candidateId，避免与 AvatarPrimitive.Root 的 id 冲突
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, candidateId, ...props }, ref) => {
  const { candidateList } = useMultiWinnerDataStore();

  // 根据 candidateId 获取候选人信息
  const candidate = candidateList.find(
    (candidate) => candidate.id === candidateId,
  );
  const color = candidate?.color || "transparent"; // 获取颜色或设置默认值
  const imageSrc = candidate?.imageSrc; // 获取图片链接

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    >
      <AvatarImage src={imageSrc} />
      <AvatarFallback name={candidate?.name || "Unknown"} color={color} />
    </AvatarPrimitive.Root>
  );
});
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {
  name?: string;
  color?: string;
}

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, name = "Unknown", color = "gray", ...props }, ref) => {
  // 获取前五个字母
  const truncatedName = name.length > 5 ? name.slice(0, 5) : name;

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      title={name} // 悬停时显示完整名字
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full text-white text-xs font-bold ",
        className,
      )}
      style={{ backgroundColor: color !== "OVERFLOW" ? color : "gray" }}
      {...props}
    >
      {truncatedName} {/* 显示前五个字母 */}
    </AvatarPrimitive.Fallback>
  );
});
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
