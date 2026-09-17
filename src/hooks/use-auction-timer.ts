"use client";

import { useEffect, useRef, useState } from "react";

type UseAuctionTimerOptions = {
  expiresAt?: string | null;
  timeRemainingSeconds?: number | null;
  totalDurationSeconds?: number;
  isLive?: boolean;
};

export type AuctionTimerState = {
  secondsLeft: number;
  formattedTime: string;
  isFinal10Min: boolean;
  isTimeOver: boolean;
  progressPct: number;
};

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatAuctionCountdown(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}

export function useAuctionTimer({
  expiresAt,
  timeRemainingSeconds,
  totalDurationSeconds = 7200, // Default 2 hours (7200s)
  isLive = true,
}: UseAuctionTimerOptions): AuctionTimerState {
  // Compute initial target end timestamp (milliseconds)
  const computeTargetEndTime = () => {
    if (expiresAt) {
      const parsed = new Date(expiresAt).getTime();
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
    if (typeof timeRemainingSeconds === "number" && !isNaN(timeRemainingSeconds)) {
      return Date.now() + Math.max(0, timeRemainingSeconds) * 1000;
    }
    return Date.now() + 7200 * 1000;
  };

  const targetEndTimeRef = useRef<number>(computeTargetEndTime());
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    return Math.max(0, Math.floor((targetEndTimeRef.current - Date.now()) / 1000));
  });

  // When server props update (via polling), update targetEndTime only if drift is significant (> 4s)
  // or if expiresAt explicitly changed. This eliminates timer jitter on 3-second RTK Query polls!
  useEffect(() => {
    if (expiresAt) {
      const serverTarget = new Date(expiresAt).getTime();
      if (!isNaN(serverTarget) && serverTarget > 0) {
        const driftMs = Math.abs(serverTarget - targetEndTimeRef.current);
        if (driftMs > 4000) {
          targetEndTimeRef.current = serverTarget;
          setSecondsLeft(Math.max(0, Math.floor((serverTarget - Date.now()) / 1000)));
        }
        return;
      }
    }

    if (typeof timeRemainingSeconds === "number" && !isNaN(timeRemainingSeconds)) {
      const currentRemaining = Math.max(0, Math.floor((targetEndTimeRef.current - Date.now()) / 1000));
      const drift = Math.abs(currentRemaining - timeRemainingSeconds);
      if (drift > 4) {
        targetEndTimeRef.current = Date.now() + Math.max(0, timeRemainingSeconds) * 1000;
        setSecondsLeft(Math.max(0, timeRemainingSeconds));
      }
    }
  }, [expiresAt, timeRemainingSeconds]);

  // Smooth local 1-second interval
  useEffect(() => {
    if (!isLive) return;

    const interval = window.setInterval(() => {
      const rem = Math.max(0, Math.floor((targetEndTimeRef.current - Date.now()) / 1000));
      setSecondsLeft(rem);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isLive]);

  const isFinal10Min = secondsLeft > 0 && secondsLeft <= 10 * 60;
  const isTimeOver = secondsLeft <= 0;

  // Calculate progress % out of totalDurationSeconds
  const elapsed = Math.max(0, totalDurationSeconds - secondsLeft);
  const rawPct = (elapsed / totalDurationSeconds) * 100;
  const progressPct = Math.min(100, Math.max(0, rawPct));

  return {
    secondsLeft,
    formattedTime: formatAuctionCountdown(secondsLeft),
    isFinal10Min,
    isTimeOver,
    progressPct,
  };
}
