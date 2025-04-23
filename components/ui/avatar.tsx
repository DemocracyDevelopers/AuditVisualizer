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
        "relative flex h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 bg-white",
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
          "flex h-full w-full items-center justify-center rounded-full bg-white text-black font-bold px-1 text-center leading-tight whitespace-nowrap",
          shortName.length > 5 ? "text-[8px]" : "text-[9px]",
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
): { shortName: string; explanation?: string } {
  const current = candidateList.find((c) => c.id === currentId);
  if (!current || !current.name) return { shortName: "???" };

  const parts = current.name.trim().split(/\s+/);
  const firstNameRaw = parts[0];
  const lastName = parts[parts.length - 1];

  const truncate = (str: string, len = 5) =>
    str.length > len ? str.slice(0, len) + ".." : str;

  const firstName = truncate(firstNameRaw);

  // Step 1: All candidates with same first name
  const sameFirst = candidateList.filter((c) => {
    const p = c.name.trim().split(/\s+/);
    return p[0] === firstNameRaw; // still use original name for disambiguation
  });

  // Step 2: Same first name and same last initial
  const sameFirstLastInitial = sameFirst.filter((c) => {
    const p = c.name.trim().split(/\s+/);
    return p.length > 1 && p[p.length - 1][0] === lastName[0];
  });

  // Step 3: Same full name
  const sameFullName = sameFirstLastInitial.filter(
    (c) => c.name.trim() === current.name.trim(),
  );

  // Step 4: Disambiguate full name duplicates
  if (sameFullName.length > 1) {
    const index = sameFullName.findIndex((c) => c.id === currentId);
    return {
      shortName: `${firstName} ${lastName} ${index + 1}`,
      explanation: `${current.name} (${index + 1})`,
    };
  }

  // Step 3 fallback: full last name
  if (sameFirstLastInitial.length > 1) {
    return {
      shortName: `${firstName} ${lastName}`,
      explanation: current.name,
    };
  }

  // Step 2 fallback: last initial
  if (sameFirst.length > 1) {
    return {
      shortName: `${firstName} ${lastName[0]}.`,
      explanation: current.name,
    };
  }

  // Step 1: unique first name
  return {
    shortName: firstName,
    explanation: current.name,
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
