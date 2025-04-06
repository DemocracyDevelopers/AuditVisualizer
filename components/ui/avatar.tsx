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
  const imageSrc = candidate?.imageSrc;

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-300 bg-white",
        className,
      )}
      {...props}
    >
      <AvatarImage src={imageSrc} alt={candidate?.name || "Avatar"} />
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
          "flex h-full w-full items-center justify-center rounded-full bg-white text-black border border-gray-300 text-[10px] leading-tight text-center font-bold px-1",
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
): { shortName: string; explanation?: string } {
  const current = candidateList.find((c) => c.id === currentId);
  if (!current || !current.name) return { shortName: "???" };

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
        explanation: `${firstName}（Same Name Mark）`,
      };
    }

    return { shortName: truncateWithDots(firstName) };
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
      explanation: `${current.name}（Rename user identification）`,
    };
  }

  return {
    shortName:
      display.length > maxLength ? display.slice(0, maxLength) : display,
  };
}

function getCircledNumber(n: number): string {
  const circled = ["", "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];
  return n >= 1 && n <= 10 ? circled[n] : `(${n})`;
}
