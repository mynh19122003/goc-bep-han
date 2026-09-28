'use client';

import React from 'react';

interface CloseButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
  light?: boolean;
}

export const CloseButton: React.FC<CloseButtonProps> = ({
  onClick,
  label = 'Đóng',
  className = '',
  light = false,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className={[
      'min-w-[44px] h-10 px-2.5 sm:px-3 rounded-xl border font-black text-[9px] sm:text-[10px] tracking-wide outline-none',
      'transition-all active:scale-95 shrink-0 focus-visible:ring-2 focus-visible:ring-amber-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#17110f]',
      light
        ? 'bg-white/90 border-stone-300 text-stone-700 hover:bg-stone-100'
        : 'bg-stone-950/70 border-amber-500/35 text-amber-100 hover:bg-stone-800',
      className,
    ].join(' ')}
  >
    {label.toUpperCase()}
  </button>
);
