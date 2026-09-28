'use client';

import React from 'react';
import Image from 'next/image';

type GameButtonTone = 'primary' | 'success' | 'danger' | 'neutral' | 'ghost';

interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iconSrc?: string;
  tone?: GameButtonTone;
  compact?: boolean;
  fullWidth?: boolean;
}

const toneMap: Record<GameButtonTone, string> = {
  primary:
    'bg-gradient-to-b from-amber-500 to-orange-700 border-amber-300/70 text-white hover:brightness-110',
  success:
    'bg-gradient-to-b from-emerald-500 to-emerald-700 border-emerald-300/70 text-white hover:brightness-110',
  danger:
    'bg-gradient-to-b from-red-600 to-red-800 border-red-300/60 text-white hover:brightness-110',
  neutral:
    'bg-stone-800 border-stone-600 text-stone-100 hover:bg-stone-700',
  ghost:
    'bg-stone-950/45 border-stone-600/70 text-stone-200 hover:bg-stone-900/70',
};

export const GameButton: React.FC<GameButtonProps> = ({
  iconSrc,
  tone = 'primary',
  compact = false,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl border font-black outline-none',
        'shadow-[0_3px_0_rgba(0,0,0,0.28)] transition-all active:translate-y-[1px] active:shadow-none focus-visible:ring-2 focus-visible:ring-amber-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#17110f]',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:shadow-none',
        compact ? 'min-h-[40px] px-3 py-2 text-[11px]' : 'min-h-[44px] px-4 py-2.5 text-xs sm:text-sm',
        fullWidth ? 'w-full' : '',
        toneMap[tone],
        className,
      ].join(' ')}
      {...props}
    >
      {iconSrc && (
        <span className="relative w-5 h-5 shrink-0">
          <Image src={iconSrc} alt="" fill sizes="20px" className="object-contain" />
        </span>
      )}
      <span className="min-w-0 leading-tight">{children}</span>
    </button>
  );
};
