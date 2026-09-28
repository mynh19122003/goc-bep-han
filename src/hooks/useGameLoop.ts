'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/useGameStore';

/**
 * Runs two simulations:
 * - cookingTick always runs while the game is not paused, so free-cook works
 *   even before the restaurant opens.
 * - gameTick internally advances restaurant/day/customer/delivery state only
 *   while the business day is active.
 */
export function useGameLoop() {
  const isPaused = useGameStore((state) => state.isPaused);
  const gameTick = useGameStore((state) => state.gameTick);
  const cookingTick = useGameStore((state) => state.cookingTick);

  const lastTickRef = useRef<number>(Date.now());

  useEffect(() => {
    if (isPaused) return;

    lastTickRef.current = Date.now();

    const interval = window.setInterval(() => {
      const now = Date.now();
      const deltaMs = now - lastTickRef.current;
      lastTickRef.current = now;

      const deltaSec = Math.min(0.25, deltaMs / 1000);
      cookingTick(deltaSec);
      gameTick(deltaSec);
    }, 100);

    return () => window.clearInterval(interval);
  }, [isPaused, gameTick, cookingTick]);
}
