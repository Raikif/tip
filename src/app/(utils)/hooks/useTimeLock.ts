"use client";

import { useState, useEffect } from "react";
import { useEventTimeline } from "./useEventTimeline";
import type { EventCategory } from "../types/event";

export function useTimeLock(
  category: string,
  stageKey: keyof EventCategory,
) {
  const { timeline, loading } = useEventTimeline();
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    if (loading || !timeline) return;

    // Compute the final locked state
    let newLockedState = true;

    const bypass = localStorage.getItem("debug_time_bypass");
    if (bypass === "1" || bypass === "2") {
      newLockedState = false;
    } else {
      const cat = timeline[category as keyof typeof timeline];
      if (cat) {
        const stage = cat[stageKey];
        if (stage) {
          const now = Date.now();
          if (stage.start !== undefined && stage.end !== undefined) {
            newLockedState = now < stage.start || now > stage.end;
          } else if (stage.time !== undefined) {
            const timeNum = typeof stage.time === "string" ? new Date(stage.time).getTime() : stage.time;
            newLockedState = now < timeNum;
          }
        }
      }
    }

    // Call setState once with the final value
    setIsLocked(newLockedState);
  }, [timeline, loading, category, stageKey]);

  const lockMessage = getLockMessage(category, String(stageKey));

  return { isLocked: isLocked && !loading, lockMessage };
}

function getLockMessage(category: string, stageKey: string): string {
  if (category === "poster") {
    if (stageKey === "pengumpulan_poster")
      return "Pengumpulan Poster hanya dapat dilakukan pada masa yang ditentukan.";
    if (stageKey === "pengumpulan_poster_final")
      return "Pengumpulan Poster Final hanya dapat dilakukan pada masa final.";
  }
  if (stageKey === "pengumpulan_fullpaper")
    return "Pengumpulan Fullpaper hanya dapat dilakukan setelah pengumuman Abstrak.";
  if (stageKey === "final")
    return "Pengumpulan PPT hanya dapat dilakukan setelah pengumuman Finalis.";
  return "Masa pengumpulan belum dibuka atau sudah ditutup.";
}
