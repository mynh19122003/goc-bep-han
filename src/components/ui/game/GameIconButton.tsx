'use client';

import React from 'react';
import Image from 'next/image';

export interface GameIconButtonProps {
  asset: string;
  label?: string;
  onClick?: () => void;
  badge?: number | string | null;
  active?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'dock';
  variant?: 'primary' | 'wood' | 'glass' | 'ghost' | 'dock';
  className?: string;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const GameIconButton: React.FC<GameIconButtonProps> = ({
  asset,
  label,
  onClick,
  badge,
  active = false,
  disabled = false,
  size = 'md',
  variant = 'wood',
  className = '',
  title,
  type = 'button',
}) => {
  // Sizing definitions
  const sizeMap = {
    sm: {
      button: 'p-1.5 min-w-[36px] min-h-[36px] rounded-xl',
      icon: 22,
      text: 'text-[10px]',
    },
    md: {
      button: 'p-2 min-w-[44px] min-h-[44px] rounded-2xl',
      icon: 28,
      text: 'text-xs',
    },
    lg: {
      button: 'p-2.5 min-w-[52px] min-h-[52px] rounded-2xl',
      icon: 36,
      text: 'text-sm font-bold',
    },
    dock: {
      button: 'px-3 py-1.5 min-w-[60px] min-h-[50px] rounded-2xl flex-col',
      icon: 30,
      text: 'text-[11px] font-bold tracking-tight',
    },
  };

  const currentSize = sizeMap[size];

  // Variant styles
  const variantMap = {
    wood: active
      ? 'bg-gradient-to-b from-amber-600 to-amber-800 text-amber-100 border-2 border-amber-300 shadow-lg scale-105'
      : 'bg-stone-900/80 hover:bg-stone-800 border border-amber-600/40 text-stone-200 hover:border-amber-400/70 shadow-md',
    primary: active
      ? 'bg-gradient-to-b from-red-600 to-red-800 text-white border-2 border-amber-300 shadow-lg scale-105'
      : 'bg-red-700/80 hover:bg-red-600 border border-red-400/50 text-white shadow-md',
    glass: active
      ? 'bg-white/25 backdrop-blur-md text-white border-2 border-amber-300 shadow-lg scale-105'
      : 'bg-stone-900/60 hover:bg-stone-900/85 backdrop-blur-md border border-white/20 text-stone-200 shadow-sm',
    ghost: active
      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 scale-105'
      : 'hover:bg-white/10 text-stone-300 hover:text-white border border-transparent',
    dock: active
      ? 'bg-gradient-to-b from-amber-500/30 to-amber-700/40 text-amber-200 border-2 border-amber-400/80 shadow-inner scale-[1.04]'
      : 'hover:bg-stone-800/80 text-stone-400 hover:text-amber-200 border border-transparent',
  };

  const currentVariant = variantMap[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title || label}
      className={`relative inline-flex items-center justify-center font-baloo cursor-pointer transition-all duration-150 select-none active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 ${currentSize.button} ${currentVariant} ${className}`}
    >
      {/* Icon Image with proper containment */}
      <div
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <Image
          src={asset}
          alt={label || 'game-icon'}
          width={currentSize.icon}
          height={currentSize.icon}
          className="object-contain w-full h-full drop-shadow-sm pointer-events-none"
        />
      </div>

      {/* Optional Label */}
      {label && (
        <span
          className={`leading-none mt-0.5 text-center font-baloo transition-colors ${currentSize.text} ${
            active ? 'text-amber-200 font-black' : ''
          }`}
        >
          {label}
        </span>
      )}

      {/* Badge (Notification Counter) */}
      {badge !== undefined && badge !== null && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-red-600 text-white font-black text-[10px] rounded-full flex items-center justify-center shadow-md border-2 border-stone-900 animate-bounce-slight">
          {badge}
        </span>
      )}
    </button>
  );
};
