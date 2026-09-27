'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/useGameStore';

export function useGameLoop() {
  const isDayActive = useGameStore((state) => state.isDayActive);
  const isPaused = useGameStore((state) => state.isPaused);
  const gameTick = useGameStore((state) => state.gameTick);

  const lastTickRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!isDayActive || isPaused) return;

    lastTickRef.current = Date.now();

    const interval = setInterval(() => {
      const now = Date.now();
      const deltaMs = now - lastTickRef.current;
      lastTickRef.current = now;

      // Delta in seconds, clamp to avoid huge jumps if tab was backgrounded
      const deltaSec = Math.min(0.25, deltaMs / 1000);
      gameTick(deltaSec);
    }, 100); // 100ms tick rate

    return () => clearInterval(interval);
  }, [isDayActive, isPaused, gameTick]);
}
