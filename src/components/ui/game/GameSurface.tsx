'use client';

import React from 'react';

interface GameSurfaceProps {
  children: React.ReactNode;
  className?: string;
  strong?: boolean;
}

export const GameSurface: React.FC<GameSurfaceProps> = ({
  children,
  className = '',
  strong = false,
}) => (
  <div
    className={[
      'rounded-2xl border shadow-lg',
      strong
        ? 'bg-stone-950/82 border-amber-500/35'
        : 'bg-stone-950/58 border-amber-400/20 backdrop-blur-[3px]',
      className,
    ].join(' ')}
  >
    {children}
  </div>
);
