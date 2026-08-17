"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { giveStarAction } from "@/app/(app)/rewards/actions";

const CONFETTI_COLORS = ["#a0ced9", "#f0df87", "#e1932c", "#3d9e71", "#133968"];

const STAR_POINTS = "50,3 61,37 97,37 68,58 79,94 50,73 21,94 32,58 3,37 39,37";

export function GiveStarButton({ todayCount }: { todayCount: number }) {
  const [optimisticCount, setOptimisticCount] = useState(todayCount);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    setOptimisticCount((count) => count + 1);
    confetti({
      particleCount: 140,
      spread: 100,
      startVelocity: 45,
      origin: { y: 0.7 },
      colors: CONFETTI_COLORS,
    });

    startTransition(async () => {
      await giveStarAction();
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-bold uppercase tracking-wide text-atlantic/60">
        Give a star!
      </p>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-label="Give a star"
        className="h-48 w-48 transition-transform duration-100 active:translate-y-1 active:scale-95 disabled:opacity-70"
      >
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full drop-shadow-[0_6px_0_rgba(19,57,104,0.35)]"
        >
          <defs>
            <linearGradient id="give-star-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f0df87" />
              <stop offset="100%" stopColor="#e1932c" />
            </linearGradient>
          </defs>
          {/* Invisible full-square hit area so taps near the points (not just
              dead-center on the polygon) still register — matters for a kid. */}
          <rect x="0" y="0" width="100" height="100" fill="transparent" />
          <polygon points={STAR_POINTS} fill="url(#give-star-gradient)" />
        </svg>
      </button>
      <p className="text-lg font-bold text-atlantic">
        {optimisticCount} given today
      </p>
    </div>
  );
}
