'use client';

import React from 'react';

interface CloseButtonProps {
  onClick: () => void;
  label?: string;
  variant?: 'dark' | 'light';
  className?: string;
}

export const CloseButton: React.FC<CloseButtonProps> = ({
  onClick,
  label = 'Đóng',
  variant = 'dark',
  className = '',
}) => {
  const tone =
    variant === 'light'
      ? 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-700'
      : 'bg-stone-950/80 hover:bg-stone-800 border-amber-500/30 text-amber-100';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`min-w-[44px] h-10 px-3 rounded-xl border font-black text-[10px] sm:text-[11px] tracking-wide transition-all active:scale-95 cursor-pointer shrink-0 ${tone} ${className}`}
    >
      {label.toUpperCase()}
    </button>
  );
};
