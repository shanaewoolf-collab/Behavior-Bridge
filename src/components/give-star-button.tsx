"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { giveStarAction } from "@/app/(app)/rewards/actions";

const CONFETTI_COLORS = ["#a0ced9", "#f0df87", "#e1932c", "#3d9e71", "#133968"];

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
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="flex h-40 w-40 flex-col items-center justify-center rounded-full border-b-8 border-persimmon/60 bg-gradient-to-b from-cornsilk to-persimmon text-atlantic shadow-lg transition-transform duration-100 active:translate-y-2 active:border-b-2 disabled:opacity-70"
      >
        <span className="text-5xl">★</span>
        <span className="text-sm font-bold">Give a star!</span>
      </button>
      <p className="text-lg font-bold text-atlantic">
        {optimisticCount} given today
      </p>
    </div>
  );
}
