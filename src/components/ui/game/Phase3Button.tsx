'use client';

import React from 'react';
import Image from 'next/image';
import { PHASE3_SEMANTIC_MAP, Phase3SemanticKey } from '@/game/assets/phase3UiAssets';
import { soundManager } from '@/utils/audio';

interface Phase3ButtonProps {
  action: Phase3SemanticKey;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  title?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'dock';
  height?: number;
  label?: string;
  type?: 'button' | 'submit' | 'reset';
  priority?: boolean;
}

export const Phase3Button: React.FC<Phase3ButtonProps> = ({
  action,
  onClick,
  disabled = false,
  className = '',
  title,
  size = 'md',
  height,
  label,
  type = 'button',
  priority = false,
}) => {
  const meta = PHASE3_SEMANTIC_MAP[action];

  if (!meta) {
    return (
      <span className="text-[10px] text-amber-400 font-bold px-1 border border-amber-400/40 rounded">
        Thiếu asset
      </span>
    );
  }

  // Pre-calculated ergonomic heights (with touch targets >= 44px on mobile via padding)
  const defaultHeightMap = {
    xs: 28,
    sm: 34,
    md: 42,
    lg: 48,
    dock: 44,
  };

  const actualHeight = height || defaultHeightMap[size];
  const calculatedWidth = Math.round(actualHeight * meta.aspectRatio);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      soundManager.playClick();
      if (onClick) onClick(e);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      title={title || meta.label || label}
      aria-label={title || meta.label || label}
      className={`relative inline-flex items-center justify-center p-0 select-none cursor-pointer transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 ${className}`}
      style={{
        height: actualHeight,
        minWidth: calculatedWidth,
      }}
    >
      <div
        className="relative shrink-0 flex items-center justify-center pointer-events-none"
        style={{ width: calculatedWidth, height: actualHeight }}
      >
        <Image
          src={meta.path}
          alt={label || meta.label}
          width={meta.width}
          height={meta.height}
          priority={priority}
          className="w-full h-full object-contain drop-shadow-sm pointer-events-none"
          draggable={false}
        />
      </div>

      {label && (
        <span className="sr-only">
          {label}
        </span>
      )}
    </button>
  );
};
