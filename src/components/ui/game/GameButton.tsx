'use client';

import React from 'react';
import { soundManager } from '@/utils/audio';

interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'wood' | 'red' | 'amber' | 'emerald' | 'cream';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const GameButton: React.FC<GameButtonProps> = ({
  variant = 'amber',
  size = 'md',
  children,
  onClick,
  disabled,
  className = '',
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      soundManager.playClick();
      if (onClick) onClick(e);
    }
  };

  const variantStyles = {
    wood: 'bg-gradient-to-b from-[#8C5B3F] to-[#5C3826] text-amber-100 border-[#451A03] hover:from-[#9B6647] shadow-[0_4px_0_#381704]',
    red: 'bg-gradient-to-b from-red-500 to-red-700 text-white border-red-800 hover:from-red-400 shadow-[0_4px_0_#7f1d1d]',
    amber: 'bg-gradient-to-b from-amber-400 to-orange-500 text-stone-900 border-amber-600 hover:from-amber-300 shadow-[0_4px_0_#9a3412]',
    emerald: 'bg-gradient-to-b from-emerald-500 to-green-700 text-white border-green-800 hover:from-emerald-400 shadow-[0_4px_0_#14532d]',
    cream: 'bg-gradient-to-b from-[#FFFDF9] to-[#F4ECE4] text-stone-800 border-[#D4C2B0] hover:bg-white shadow-[0_3px_0_#bfa792]',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs rounded-xl border-2 font-bold',
    md: 'px-4 py-2 text-sm rounded-2xl border-2 font-extrabold',
    lg: 'px-5 py-3 text-base rounded-2xl border-3 font-black',
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-1.5 transition-all select-none cursor-pointer font-baloo active:translate-y-1 active:shadow-none ${
        disabled
          ? 'bg-stone-300 border-stone-400 text-stone-500 cursor-not-allowed shadow-none'
          : variantStyles[variant]
      } ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
