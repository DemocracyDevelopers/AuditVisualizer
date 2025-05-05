"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import useMultiWinnerDataStore from "@/store/multi-winner-data";

interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  candidateId: number;
  displayStyle?: "short" | "formal" | "smart" | "auto";
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, candidateId, displayStyle = "auto", ...props }, ref) => {
  const { candidateList } = useMultiWinnerDataStore();
  const candidate = candidateList.find((c) => c.id === candidateId);

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-black bg-white",
        className,
      )}
      {...props}
    >
      <AvatarFallback
        name={candidate?.name || "Unknown"}
        candidateId={candidateId}
        displayStyle={displayStyle}
      />
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
  candidateId: number;
  displayStyle?: "short" | "formal" | "smart" | "auto";
}

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(
  (
    {
      className,
      name = "Unknown",
      candidateId,
      displayStyle = "auto",
      ...props
    },
    ref,
  ) => {
    const { candidateList } = useMultiWinnerDataStore();

    const { shortName, explanation } = getSmartDisplayName(
      candidateId,
      candidateList,
    );

    return (
      <AvatarPrimitive.Fallback
        ref={ref}
        title={explanation || name}
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full bg-white text-black border border-black text-[10px] leading-tight text-center font-bold px-1",
          className,
        )}
        {...props}
      >
        {shortName}
      </AvatarPrimitive.Fallback>
    );
  },
);
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };

// --------------------------------------------
function getSmartDisplayName(
  currentId: number,
  candidateList: { id: number; name: string }[],
  maxLength: number = 7,
): { shortName: string; explanation: string; name: string } {
  const current = candidateList.find((c) => c.id === currentId);
  if (!current || !current.name)
    return { shortName: "???", explanation: "???", name: "???" };

  const parts = current.name.trim().split(/\s+/);
  const firstName = parts[0];

  const truncateWithDots = (str: string) =>
    str.length > 5 ? str.slice(0, 5) + ".." : str;

  // ✅ 处理单名情况
  if (parts.length === 1) {
    const sameFirstOnly = candidateList.filter((c) => {
      const cParts = c.name.trim().split(/\s+/);
      return cParts.length === 1 && cParts[0] === firstName;
    });

    if (sameFirstOnly.length > 1) {
      const index = sameFirstOnly.findIndex((c) => c.id === currentId);
      const circledNumber = getCircledNumber(index + 1);
      return {
        shortName: `${truncateWithDots(firstName)}${circledNumber}`,
        explanation: `${current.name} (${index + 1})`,
        name: current.name,
      };
    }

    return {
      shortName: truncateWithDots(firstName),
      explanation: current.name,
      name: current.name,
    };
  }

  const sameStructureFirst = candidateList.filter((c) => {
    const otherParts = c.name.trim().split(/\s+/);
    return otherParts.length === parts.length && otherParts[0] === firstName;
  });

  const sameFull = sameStructureFirst.filter(
    (c) => c.name.trim() === current.name.trim(),
  );

  if (sameFull.length <= 1) {
    const lastInitial = parts[1]?.[0]?.toUpperCase();
    return {
      shortName: lastInitial
        ? `${firstName} ${lastInitial}.`
        : truncateWithDots(firstName),
      explanation: current.name,
      name: current.name,
    };
  }

  const initials = parts.map((p) => p[0]?.toUpperCase()).filter(Boolean);
  let display = initials.map((ch) => `${ch}.`).join(" ");

  const index = sameFull.findIndex((c) => c.id === currentId);
  if (index !== -1) {
    display += getCircledNumber(index + 1);
    return {
      shortName:
        display.length > maxLength ? display.slice(0, maxLength) : display,
      explanation: `${current.name} (${index + 1})`,
      name: current.name,
    };
  }

  return {
    shortName:
      display.length > maxLength ? display.slice(0, maxLength) : display,
    explanation: current.name,
    name: current.name,
  };
}

function getCircledNumber(n: number): string {
  const circled = [
    "",
    "(1)",
    "(2)",
    " (3)",
    " (4)",
    " (5)",
    " (6)",
    " (7)",
    " (8)",
    " (9)",
    " (10)",
  ];
  return n >= 1 && n <= 10 ? circled[n] : `(${n})`;
}

export { getSmartDisplayName };
